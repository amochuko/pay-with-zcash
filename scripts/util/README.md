# Geo-enrichment pipeline for paywithz.cash merchant data

Give a CSV/JSON export of merchants (name, category, website), this script attempts to
resolve coordination for each entry through a four-stage process:

Stage 1 - Schema.org structure data (highest confiidence)
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
