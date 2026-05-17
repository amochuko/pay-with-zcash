"""
- enrich_merchant.py

Geo-enrichment pipeline for paywithz.cash merchant data

Give a CSV/JSON export of merchants (name, category, website), this script attempts to
resolve coordinated for each entry through a four-stage process:

Stage 1 - Schema.org structure date (highest confiidence)
Stage 2 - HTML heuristics           (footer/contact page scrape)
Stage 3 - Nominatim geocoding       (business name + domain signals)
Stage 4 - TLD country fallback      (lowest confidence, country-centroid only)

- Outputs
    merchants.geojson           ->      records with resolved coordinateds (map-ready)
    backfill_queue.json          ->      records that need manual review
    enrichment_report.json      ->      full audit log per merchant

- Usage
    python enrich_merchants.py --input merchants.csv --output ./output/
    python enrich_merchants.py --input merchants.json --output ./output/

- Input format (CSV columns or JSON keys):
    id, name, category, websites

    NB: (id is optional - will be auto generated if missing)

- Dependencies
    pip installl request beatifulsoup4 extruct lxml tldextract

"""

from data_class.merchant import Merchant
from helpers.html import (
    normalise_url,
    GeoResult,
    extract_schema_org,
    GeoStatus,
    GeoRegion,
    GeoConfidence,
    GeoCoordinatesSource,
    _country_to_region,
    extract_html_heuristics,
    geocode_merchant,
    tld_fallback,
    make_id,
    normalise_category,
)
import logging
from datetime import date
from pathlib import Path
import csv
import json
import argparse

# -------------------------------
# Configuration
# -------------------------------

# Regex patterns for extracting location signals from HTML text
PHONE_PATTERNS = {
    # Maps phone prefix → (country_code, country_name, region)
    "+234": ("NG", "NIGERIA", "africa"),
    "+233": ("GH", "Ghana", "africa"),
    "+254": ("KE", "Kenya", "africa"),
    "+27": ("ZA", "South Africa", "africa"),
    "+44": ("GB", "United Kingdom", "europe"),
    "+49": ("DE", "Germany", "europe"),
    "+33": ("FR", "France", "europe"),
    "+1": ("US", "United States", "americas"),
    "+55": ("BR", "Brazil", "americas"),
    "+91": ("IN", "India", "asia"),
    "+82": ("KR", "South Korea", "asia"),
    "+81": ("JP", "Japan", "asia"),
    "+971": ("AE", "UAE", "asia"),
    "+61": ("AU", "Australia", "oceania"),
}

# TLD → (country_code, country_name, region, centroid_lon, centroid_lat)
TOP_LEVEL_DOMAIN_MAP = {
    "ng": ("NG", "Nigeria", "africa", 8.6753, 9.0820),
    "gh": ("GH", "Ghana", "africa", -1.0232, 7.9465),
    "ke": ("KE", "Kenya", "africa", 37.9062, -0.0236),
    "za": ("ZA", "South Africa", "africa", 22.9375, -30.5595),
    "uk": ("GB", "United Kingdom", "europe", -3.4360, 55.3781),
    "co": ("CO", "Colombia", "americas", -74.2973, 4.5709),
    "de": ("DE", "Germany", "europe", 10.4515, 51.1657),
    "fr": ("FR", "France", "europe", 2.2137, 46.2276),
    "in": ("IN", "India", "asia", 78.9629, 20.5937),
    "kr": ("KR", "South Korea", "asia", 127.7669, 35.9078),
    "jp": ("JP", "Japan", "asia", 138.2529, 36.2048),
    "au": ("AU", "Australia", "oceania", 133.7751, -25.2744),
    "br": ("BR", "Brazil", "americas", -51.9253, -14.2350),
    "ca": ("CA", "Canada", "americas", -96.8165, 56.1304),
}

# Country name fragments → (country_code, region, centroid_lon, centroid_lat)
COUNTRY_TEXT_MAP = {
    "nigeria": ("NG", "africa", 8.6753, 9.0820),
    "ghana": ("GH", "africa", -1.0232, 7.9465),
    "kenya": ("KE", "africa", 37.9062, -0.0236),
    "south africa": ("ZA", "africa", 22.9375, -30.5595),
    "united kingdom": ("GB", "europe", -3.4360, 55.3781),
    "united states": ("US", "americas", -95.7129, 37.0902),
    "germany": ("DE", "europe", 10.4515, 51.1657),
    "france": ("FR", "europe", 2.2137, 46.2276),
    "india": ("IN", "asia", 78.9629, 20.5937),
    "brazil": ("BR", "americas", -51.9253, -14.2350),
    "canada": ("CA", "americas", -96.8165, 56.1304),
    "australia": ("AU", "oceania", 133.7751, -25.2744),
    "japan": ("JP", "asia", 138.2529, 36.2048),
    "south korea": ("KR", "asia", 127.7669, 35.9078),
    "korea": ("KR", "asia", 127.7669, 35.9078),
    "uae": ("AE", "asia", 53.8478, 23.4241),
    "dubai": ("AE", "asia", 55.2708, 25.2048),
}

# Valid category values for the merchants schema
VALID_CATEGORIES = {
    "food_drink",
    "retail",
    "online_services",
    "travel",
    "entertainment",
    "other",
}

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


def enrich_merchant(merchant: Merchant) -> Merchant:
    """
    Run a merchant through all four enrichment stages.
    Stops as soon as a 'resolved' result is found.
    """

    website = normalise_url(merchant.website) if merchant.website else None

    logging.info(f"Processing: {merchant.name} | {website or 'no website'}")

    geo = GeoResult()

    # --- Stage 1: Schema.org ---

    if website:
        result = extract_schema_org(website)
        if result:
            logging.info(
                f" Stage 1 hit: {result.geo_status} ({result.coordinates_source})"
            )

            if result.geo_status == GeoStatus.RESOLVED:
                result.region = result.region or _country_to_region(result.country_code)
                merchant.geo = result

                return merchant

            geo = result  # partial - carry forward for later stages

    # --- Stage 2: HTML Heuristics ---

    if website:
        result = extract_html_heuristics(website)
        if result:
            logging.info(
                f" Stage 2 hit: {result.geo_status} ({result.coordinates_source})"
            )

            if result.geo_status == GeoStatus.RESOLVED:
                result.region = result.region or _country_to_region(result.country_code)
                merchant.geo = result

                return merchant

            # Merge: keep whatever country info already found, carry into stage 3
            if result.country_code and not geo.country_code:
                geo.country_code = result.country_code
                geo.notes.extend(result.notes)

    # --- Stage 3: Nominatim ---
    result = geocode_merchant(merchant, country_hint=geo.country_code)
    if result and result.geo_status == GeoStatus.RESOLVED:
        logging.info(f" Stage 3 hit: Nominatim resolved")

        # Prefer any country already determined from HTML over Nominatim's guess
        if geo.country_code:
            result.country_code = geo.country_code
        result.region = result.region or _country_to_region(result.country_code)
        result.notes = geo.notes + result.notes
        merchant.geo = result

        return merchant

    # --- Stage 4: TLD fallback ---
    if website:
        result = tld_fallback(website)
        if result:
            logging.info(f" Stage 4 hit: TLD fallback ({result.country_code})")

            result.notes = geo.notes + result.notes
            merchant.geo = result
            return merchant

    # --- All stages processed
    logging.info(f" No geo data found")
    geo.geo_status = GeoStatus.UNKNOWN
    geo.geo_confidence = GeoConfidence.NONE
    geo.stage_reached = 4
    geo.notes.append("All stages exhausted - needs manual review")
    merchant.geo = geo

    return merchant


# --- Output formatter --


def to_geojson_feature(m: Merchant) -> dict:
    """Convert a resolved/partial merchant to a GeoJSON Feature."""

    g = m.geo
    return {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [g.longitude, g.latitude],
        },
        "properties": {
            "id": m.id,
            "name": m.name,
            "category": m.category,
            "website": m.website or None,
            "accepts_shielded": False,  # default - needs manual update
            "payment_direct": "direct",  # default - update per merchant
            "country_code": g.country_code,
            "country_name": g.country_name,
            "city": g.city,
            "region": g.region,
            "verified": False,  # flagged for community review
            "last_verified": str(date.today()),
            "geo_status": g.geo_status,
            "geo_confidence": g.geo_confidence,
            "coordinates_source": g.coordinates_source,
            "notes": "; ".join(g.notes) if g.notes else None,
        },
    }


def to_backfill_entry(m: Merchant) -> dict:
    """Format a merchant for the backfill queue."""

    return {
        "id": m.id,
        "name": m.name,
        "category": m.category,
        "website": m.website,
        "geo_status": m.geo.geo_status,
        "stage_reached": m.geo.stage_reached,
        "notes": m.geo.notes,
        "action_needed": (
            "manual geocoding required - add country, city, and coordinates"
            if m.geo.geo_status == GeoStatus.UNKNOWN
            else "verify approimate location and important precision"
        ),
    }


# --- Input parser ---


def load_merchants_csv(path: Path) -> list[Merchant]:
    merchants = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            mid = row.get("id") or make_id(row.get("name", f"merchant_{i}"), i)

            m = Merchant(
                id=mid,
                name=row.get("name", "").strip(),
                category=normalise_category(row.get("category", "")),
                website=row.get("website", "").strip() or None,
                raw=dict(row),
            )
            merchants.append(m)

        return merchants


def load_merchants_json(path: Path) -> list[Merchant]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)

        # Accept eith a top-level list {'merchants':[...]}
        items = (
            data
            if isinstance(data, list)
            else data.get("merchanats", data.get("data", []))
        )
        merchants = []

        for i, row in enumerate(items):
            mid = row.get("id") or make_id(row.get("name", f"merchant_{i}"), i)
            merchants.append(
                Merchant(
                    id=mid,
                    name=row.get("name", "").strip(),
                    category=normalise_category(row.get("category", "")),
                    website=row.get("website", ""),
                    raw=row,
                ),
            )

        return merchants


# --------------------
# Enter point
# --------------------


def main():
    parser = argparse.ArgumentParser(
        description="Enrich paywithz.cash merchant with geo data."
    )
    parser.add_argument(
        "--input", required=True, help="Path to merchants.csv or merchant.json"
    )
    parser.add_argument(
        "--output", default="./output", help="Output directory (default: ./output)"
    )
    parser.add_argument(
        "---limit",
        type=int,
        default=None,
        help="Max merchants to process (for testing)",
    )
    parser.add_argument("--verbose", action="store_true", help="Enable debug logging")
    args = parser.parse_args()

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(message)s",
        datefmt="%H:%M:S",
    )

    input_path = Path(args.input)
    output_path = Path(args.output)
    output_path.mkdir(parents=True, exist_ok=True)

    # Load input
    if input_path.suffix == ".csv":
        merchants = load_merchants_csv(input_path)
    elif input_path.suffix == '.json':
        merchants = load_merchants_json(input_path)
    else:
        raise ValueError(f'Unsupported input format: {input_path.suffix}')

    if args.limit:
        merchants = merchants[:args.limit]

    logging.info(f'Loaded {len(merchants)} merchants from {input_path}')

    #  Enrich
    resolved:list[Merchant] = []
    partial: list[Merchant] = []
    unknown:list[Merchant] = []
    audit_log = []

    for merchant in merchants:
        m = enrich_merchant(merchant)
        g = merchant.geo

        entry = {
            'id': m.id,
            'name':m.name,
            'website':m.website,
            'geo_status': g.geo_status,
            'geo_confidence': g.geo_confidence,
            'coordinates_source': g.coordinates_source,
            'stage_reached': g.stage_reached,
            'country_code': g.country_code,
            'city': g.city,
            'coordinates': [g.latitude, g.longitude] if g.longitude else None,
            'notes': g.notes
        }

        audit_log.append(entry)

        if g.geo_status == GeoStatus.RESOLVED:
            resolved.append(m)
        elif g.geo_status == GeoStatus.PARTIAL:
            partial.append(m)
        else:
            unknown.append(m)

    # --- Write merchants.geojson (resolved + partial, as partial still includes coords)
    map_ready = [m for m in resolved + partial if m.geo.longitude is not None]
    geojson = {
        "type": "FeatureCollection",
        "metadata": {
            "schema_version": "1.0",
            "generated": str(date.today()),
            "source": "paywithz.cash + automated geo-enrichment",
            "total_feature": len(map_ready),
            "note": (
                "Records with geo_confidence='approimate' use counrty centriods."
                "Verify and improve before marking veried:true."
            ),
        },
        "features": [to_geojson_feature(m) for m in map_ready],
    }

    geojson_path = output_path / "merchants.geojson"
    with open(geojson_path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, indent=2, ensure_ascii=False)

    logging.info(f"Wrote {len(map_ready)} features -> {geojson_path}")

 