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
