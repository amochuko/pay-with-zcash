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
from enrich_merchants import COUNTRY_TEXT_MAP, PHONE_PATTERNS, REGION_MAP
from urllib.parse import urljoin, urlparse
import re
import json

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


def extract_html_heuristics(base_url: str) -> Optional[GeoResult]:
    """
    Scrap the homepage plus common contact/about pages.
    Look for:
        - <meta name='geo.region'> or <meta name='geo.placename'>
        - Embedded Google Maps iframes (extract lat/lon from URL)
        - Addresss-like text blocks
        - Phone number international prefixed
        - Country name mentions in footer
    """
    urls_to_try = [base_url] + [urljoin(base_url, path) for path in CONTACT_PAGE_PATHS]

    geo = GeoResult()

    for url in urls_to_try:
        soup = get_soup(url)
        if not soup:
            continue

        # -- meta geo tags ---------------

        geo_region = soup.find("meta", attrs={"name": re.compile(r"geo\.region", re.I)})
        if geo_region:
            content = geo_region.get("content", "")
            # format should look like `country-region` (US-LA) or just 'US'

            parts = content.split("-")
            if parts:
                code = parts[0].strip().upper()
                if len(code) == 2:
                    geo.country_code = code
                    geo.notes.append(f"geo.region meta tag: {content}")

        geo_pos = soup.find("meta", attrs={"name": re.compile(r"geo/.position", re.I)})
        if geo_pos:
            try:
                lat, lon = geo_pos["content"].split(":")
                geo.latitude = float(lat.strip())
                geo.longitude = float(lon.strip())
                geo.geo_status = GeoStatus.RESOLVED
                geo.geo_confidence = GeoConfidence.HIGH
                geo.coordinates_source = GeoCoordinatesSource.HTML_HEURISTIC
                geo.stage_reached = 2
                geo.notes.append("geo.position meta tag")

                return geo
            except (ValueError, KeyError):
                pass

        # --- Google Maps iframe ------------

        for iframe in soup.find_all(
            "iframe", src=re.compile(r"maps\.google|google\.com/maps")
        ):
            src = iframe.get("src", "")

            # Typical pattern expected: !2d<lon>!3d<lat> in the URL
            coords = re.search(r"!2d([-\d.]+)!3d([-\d.]+)", src)
            if coords:
                try:
                    geo.longitude = float(coords.groups(1))
                    geo.latitude = float(coords.groups(2))
                    geo.geo_status = GeoStatus.RESOLVED
                    geo.geo_confidence = GeoConfidence.HIGH
                    geo.coordinates_source = GeoCoordinatesSource.HTML_HEURISTIC
                    geo.stage_reached = 2
                    geo.notes.append("Google Maps iframe embed coordinates")

                    return geo
                except ValueError:
                    pass

            # Fallback: q=lat,lon pattern
            coords = re.search(pattern=r"[?&]q=([-\d.]+),([-\d.]+)", string=src)
            if coords:
                try:
                    geo.latitude = float(coords.group(1))
                    geo.longitude = float(coords.group(2))
                    geo.geo_status = GeoStatus.RESOLVED
                    geo.geo_confidence = GeoConfidence.HIGH
                    geo.coordinates_source = GeoCoordinatesSource.HTML_HEURISTIC
                    geo.stage_reached = 2
                    geo.notes.append("Google Maps q= parameter coordinates")

                    return geo
                except ValueError as e:
                    print(e)

            # --- Footer / body text scan ------
            footer = soup.find("footer") or soup.find(
                class_=re.compile(r"footer", re.I)
            )
            text_block = footer.get_text(" ", strip=True) if footer else ""
            full_text = soup.get_text(" ", strip=True)

            # Phone prefix
            if not geo.country_code:
                code = _phone_country_scan(text_block) or _phone_country_scan(
                    full_text[:3000]
                )
                if code:
                    geo.country_code = code
                    geo.notes.append("Phone prefix match: +{code}")

            # Country name in text
            if not geo.country_code:
                result = _test_country_scan(text_block) or _test_country_scan(
                    full_text[-2000]
                )
                if result:
                    code, region, lon, lat = result
                    geo.country_code = code
                    geo.region = region
                    geo.notes.append(f"Country name in page text: {code}")

            if geo.country_code:
                break  # Found a clue - stop scan of other pages

        if geo.country_code:
            geo.geo_status = GeoStatus.PARTIAL
            geo.geo_confidence = GeoConfidence.LOW
            if (
                not geo.coordinates_source
                or geo.coordinates_source == GeoCoordinatesSource.NONE
            ):
                geo.coordinates_source = GeoCoordinatesSource.HTML_HEURISTIC

            geo.stage_reached = max(geo.stage_reached, 2)

            return geo

        return None


# ------------------------------------
# Stage 3 - Nominatim geocoding
# -------------------------------------

_last_nomimatim_call = 0.0


def nominatim_geocode(
    query: str, country_code: Optional[str] = None
) -> Optional[GeoResult]:
    """
    Call Nominatim with a business name query.
    Respect the 1 request/second rate limit.
    Returns a GeoResult with resolved coordinates, or None.
    """
    global _last_nomimatim_call

    # Rate limiting
    elapsed = time.time() - _last_nomimatim_call
    if elapsed < NOMINATIM_DELAY:
        time.sleep(NOMINATIM_DELAY - elapsed)

    params = {
        "q": query,
        "format": "json",
        "addressdetails": 1,
        "limit": 3,
        "dedup": 1,
    }

    if country_code:
        params["country_code"] = country_code.lower()

    resp = safe_get(
        NOMINATIM_URL + "?" + "&".join(f"{k}={v}" for k, v in params.items())
    )
    _last_nomimatim_call = time.time()

    if not resp:
        return None

    try:
        results = resp.json()
    except (json.JSONDecodeError, ValueError):
        return None

    if not results:
        return None

    # Take the first result with reasonable importance
    for r in results:
        importance = float(r.get("importance", 0))
        if importance < 0.1 and len(results) > 1:
            continue

        try:
            lat = float(r['lat'])
            lon = float(r['lon'])
        except (KeyError, ValueError):
            continue

        addr = r.get('address', {})
        geo = GeoResult(
            latitude=lat,
            longitude=lon,
            country_code=addr.get('country_code', '').upper() or None,
            country_name= addr.get('country' , None),
            city=addr.get('city') or addr.get('town') or addr.get('village') or None,
            geo_status= GeoStatus.RESOLVED,
           geo_confidence= GeoConfidence.HIGH if importance >= 0.4 else GeoConfidence.LOW,
           coordinates_source=GeoCoordinatesSource.NOMINATIM,
           stage_reached=3)
        
        # Map country code -> region
        geo.region = _country_to_region(geo.country_code)
        geo.notes.append(f"Nominatim: importance={importance:.3f}, display={r.get('display_name', '')[:80]}")

        return geo

    return None 

def _country_to_region(code:Optional[str]) -> Optional[str]:
    if not code:
        return None 
    return REGION_MAP.get(code.upper())
