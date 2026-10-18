import re
import unicodedata
from typing import Optional

REGION_MAP = {
    "NG": "africa",
    "GH": "africa",
    "KE": "africa",
    "ZA": "africa",
    "ET": "africa",
    "TZ": "africa",
    "SN": "africa",
    "CI": "africa",
    "GB": "europe",
    "DE": "europe",
    "FR": "europe",
    "ES": "europe",
    "IT": "europe",
    "NL": "europe",
    "SE": "europe",
    "PL": "europe",
    "TR": "europe",
    "UA": "europe",
    "RU": "europe",
    "CH": "europe",
    "US": "americas",
    "CA": "americas",
    "BR": "americas",
    "MX": "americas",
    "AR": "americas",
    "CO": "americas",
    "CL": "americas",
    "PE": "americas",
    "IN": "asia",
    "CN": "asia",
    "JP": "asia",
    "KR": "asia",
    "AE": "asia",
    "SG": "asia",
    "ID": "asia",
    "PH": "asia",
    "AU": "oceania",
    "NZ": "oceania",
}


def country_to_region(code: Optional[str]) -> Optional[str]:
    """Map region code to country"""
    if not code:
        return None
    return REGION_MAP.get(code.upper())


def normalise_category(raw: str) -> str:
    """
    Map paywithz.cash category strings to schema categories."""

    raw = raw.lower().strip()
    category_mapping = {
        "professional_services": "professional services",
        "Music": "Music",
        "Zcash_Apps": "Zcash Apps",
        "Social_Good": "Social Good",
        "Stickers": "Stickers",
        "OpenBazaar": "OpenBazaar",
        "Advertising": "Advertising",
        "Art": "Art",
        "Clothing": "Clothing",
        "Favorites": "Favorites",
        "Games_Electronics": "Games & Electronics",
        "Gold_Jewelry": "Gold & Jewelry",
        "Web_Design": "Web Design",
        "CBD_Smoking": "CBD & Smoking",
        "Travel": "Travel",
        "Flexa": "Flexa",
        "OPSEC_Security": "OPSEC / Security",
        "Religious_Donations": "Religious Donations",
        "Legal": "Legal",
        "Web_Hosting_Domains": "Web Hosting & Domains",
        "Beauty_Personal Care": "Beauty & Personal Care",
        "Zcash_en_Español": "Zcash en Español",
        "Gift_Cards": "Gift Cards",
        "Blogs & Podcasts": "Blogs & Podcasts",
        "Books": "Books",
        "food": "food_drink",
        "drink": "food_drink",
        "food & drink": "food_drink",
        "restaurant": "food_drink",
        "cafe": "food_drink",
        "retail": "retail",
        "shop": "retail",
        "shopping": "retail",
        "services": "online_services",
        "online": "online_services",
        "digital": "online_services",
        "travel": "travel",
        "hotel": "travel",
        "accommodation": "travel",
        "entertainment": "entertainment",
        "gaming": "entertainment",
        "media": "entertainment",
    }

    for key, value in category_mapping.items():
        if key in raw:
            return value

    return "others"


def make_id(name: str, seq: int) -> str:
    """Generate a deterministic merchant ID from the name."""

    slug = unicodedata.normalize("NFKD", name.lower())
    slug = re.sub(r"^a-z0-9]+", "-", slug).strip("-")[:30]
    return f"merchant_{slug}_{seq:03d}"


def normalise_url(url: str) -> Optional[str]:
    """Ensure URL has a schema"""
    if not url:
        return None

    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    return url
