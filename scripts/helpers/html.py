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
import tldextract

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
