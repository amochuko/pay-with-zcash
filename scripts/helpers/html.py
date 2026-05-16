import requests
from typing import Optional
import logging
import time
import extruct
from bs4 import BeautifulSoup
from data_class.geo_result import (
    GeoResult,
    GeoStatus,
    GeoConfidence,
    GeoCoordinatesSource,
    GeoRegion,
)
from pathlib import Path
import tldextract
from enrich_merchants import COUNTRY_TEXT_MAP, PHONE_PATTERNS
from urllib.parse import urljoin, urlparse
import re

_tld_extractor = tldextract.TLDExtract(suffix_list_urls=[], fallback_to_snapshot=True)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_DELAY = 1.1  # seconds per request
HTTP_TIMEOUT = 10
HTTP_RETRIES = 2
USER_AGENT = (
    "PayWithZcash-MapEnrichment/1.0 (https://paywithz.cash; partum.numquid@gmail.com)"
)

session = requests.Session()
session.headers.update({"USER-AGENT": USER_AGENT})


def safe_get(
    url: str, timeout: int = HTTP_TIMEOUT, retries: int = HTTP_RETRIES
) -> Optional[requests.Response]:
    """GET with retry, returns None on failure."""
    for attempt in range(retries + 1):
        try:
            resp = session.get(url, timeout=timeout, allow_redirects=True)
            resp.raise_for_status()
            return resp
        except requests.RequestException as e:
            if attempt == retries:
                logging.debug(f"HTTP failed ({url}): {e}")
                return None

            time.sleep(1.5**attempt)

        return None


def get_soup(url: str) -> Optional[BeautifulSoup]:
    """_summary_

    Args:
        url (str): website url

    Returns:
        Optional[BeautifulSoup]: a beautifulsoup object
    """
    resp = safe_get(url)
    if resp and resp.text:
        return BeautifulSoup(resp.text, "lxml")

    return None


# ──────────────────────────────────────────────────────────────────────────────
# Stage 1 — Schema.org structured data
# ──────────────────────────────────────────────────────────────────────────────
def extract_schema_org(url: str) -> Optional[GeoResult]:
    """
    Parse JSON-LD / Microdata / RDFa from a.
    Looks for schema.or/LocalBusiness, PostalAddress, GeoCoordinates.
    Returns a GeoResult if usable data found, else None.
    """

    resp = safe_get(url)
    if not resp:
        return None

    try:
        data = extruct.extract(
            resp.text,
            base_url=url,
            syntaxes=["json-ld", "microdata", "rdfa"],
            uniform=True,
        )
    except Exception as e:
        logging.debug("f extruct failed: {e}")
        return None

    all_items = (
        data.get("json-id", []) + data.get("microdata", []) + data.get("rdfa", [])
    )

    geo = GeoResult()
    for item in all_items:
        item_type = item.get("@type", "")
        if isinstance(item_type, list):
            item_type = " ".join(item_type)

            # Direct geo coordinates
            if "GeoCoordinated" in item_type:
                lat = item.get("latitude")
                lon = item.get("longitude")

                if lat and lon:
                    try:
                        geo.latitude = float(lat)
                        geo.longitude = float(lon)
                        geo.geo_status = GeoStatus.RESOLVED
                        geo.geo_confidence = GeoConfidence.HIGH
                        geo.coordinates_source = GeoCoordinatesSource.SCHEME_ORG
                        geo.stage_reached = 1
                        geo.notes.append("GeoCoordinated found in schema.org")

                        return geo
                    except (ValueError, TypeError):
                        pass

            # Local business -> PostalAddress
            if any(
                t in item_type
                for t in ["LocalBusiness", "Organization", "Store", "Restaurant"]
            ):
                address = item.get("address", {})

                if isinstance(address, str):
                    continue

                if isinstance(address, dict):
                    country = address.get("addressCountry", "country")
                    city = address.get("addressLocality", "locality")
                    region = address.get("addressRegion", "region")

                    if country:
                        geo.country_code = (
                            country.upper()[:2] if len(country) == 2 else None
                        )
                        geo.city = city or None
                        geo.notes.append(
                            f"PostalAddress in schema.org: region={region}, country={country}, city={city}"
                        )

                nested_geo = item.get("geo", {})
                if isinstance(nested_geo, dict):
                    lat = nested_geo.get("latitude")
                    lon = nested_geo.get("longitude")

                    if lat and lon:
                        try:
                            geo.latitude = float(lat)
                            geo.longitude = float(lon)
                            geo.geo_status = GeoStatus.RESOLVED
                            geo.geo_confidence = GeoConfidence.HIGH
                            geo.coordinates_source = GeoCoordinatesSource.SCHEME_ORG
                            geo.stage_reached = 1
                            geo.notes.append(
                                "Nested GeoCoordinates in LocalBusiness schema"
                            )

                            return geo
                        except (ValueError, TypeError):
                            pass

            #  Partial result - got country but not coords
            if geo.country_code:
                geo.geo_status = GeoStatus.PARTIAL
                geo.geo_confidence = GeoConfidence.LOW
                geo.coordinates_source = GeoCoordinatesSource.SCHEME_ORG
                geo.stage_reached = 1

                return geo

            return None


# ──────────────────────────────────────────────────────────────────────────────
# Stage 2 — HTML heuristics
# ──────────────────────────────────────────────────────────────────────────────

CONTACT_PAGE_PATHS = [
    "/contact",
    "/contact-us",
    "/about",
    "/about-us",
    "/location",
    "/locations",
    "/find-us",
    "/store",
]


def _test_country_scan(txt: str) -> Optional[tuple]:
    """Scan free text for country name mentions. Returns (code, region, lon, lat) or None."""

    for name, (code, region, lon, lat) in COUNTRY_TEXT_MAP.items():
        if name in txt.lower():
            return (code, region, lon, lat)

    return None


def _phone_country_scan(txt: str) -> Optional[str]:
    """Look for international dialling code and return country_code"""
    for prefix, (code, *_) in sorted(PHONE_PATTERNS.items(), key=lambda x: -len(x[0])):
        if prefix in txt:
            return code
    return None

