/**
 * Nominatim (OpenStreetMap) geocoder with a precision fallback ladder:
 *
 *   city  → structured query (city + state + country)
 *         → free-text query  ("city, state, country")   — handles abbreviations
 *   state → structured query (state + country)
 *   country → structured query (country)
 *
 * The first level that returns a hit wins, and the result records which level
 * it was so the map can style approximate pins differently.
 *
 * Usage policy (https://operations.osmfoundation.org/policies/nominatim/):
 * max 1 request/second, identifying User-Agent, cache results. All three are
 * handled here. For heavy volume, point `baseUrl` at a self-hosted instance.
 */

import { GeoPrecision } from "../types/map.types";
import { GeocodeError } from "./geocode.error";

export interface GeocodeInput {
  country: string;
  state?: string | null;
  city?: string | null;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  precision: GeoPrecision;
}

export interface GeocoderOptions {
  userAgent: string;
  baseUrl?: string;
  /** Minimum gap between outgoing requests. Nominatim policy is >= 1000ms. */
  minIntervalMs?: number;
  /** Injectable for tests. */
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

interface NominatimHit {
  lat: string;
  lng: string;
}

type Query =
  | { kind: "structured"; params: Record<string, string> }
  | { kind: "free"; q: string };

const clean = (v: string | null | undefined): string | undefined => {
  const t = v?.trim();

  return t ? t : undefined;
};

export class Geocoder {
  private readonly baseUrl: string;
  private readonly minIntervalMs: number;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  private readonly cache = new Map<string, GeocodeResult | null>();
  private queue: Promise<unknown> = Promise.resolve();
  private lastRequestAt = 0;

  constructor(opts: GeocoderOptions) {
    this.userAgent = opts.userAgent;
    this.baseUrl = (
      opts.baseUrl ?? "https://nominatim.openstreetmap.org"
    ).replace(/\/+$/, "");
    this.minIntervalMs = opts.minIntervalMs ?? 1100;
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.timeoutMs = opts.timeoutMs ?? 10_000;
  }

  private async fetchJson(url: string): Promise<unknown> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.timeoutMs);

    try {
      const res = await this.fetchImpl(url, {
        headers: { "User-Agent": this.userAgent, "Accept-Language": "en" },
        signal: ctrl.signal,
      });

      if (!res.ok) throw new GeocodeError(`Nominatim responded ${res.status}`);

      return await res.json();
    } catch (err) {
      if (err instanceof GeocodeError) throw err;
      throw new GeocodeError("Nominatim request failed", err);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Resolve a location. Return null when nothing matched at any level
   * Throws GeocodeError on network/HTTP failure (so callers can retry later
   * instead of permanently recording 'not found')
   */

  async geocode(input: GeocodeInput): Promise<GeocodeResult | null> {
    const country = clean(input.country);
    if (!country) return null;

    const state = clean(input.state);
    const city = clean(input.city);

    const key = [country, state ?? "", city ?? ""].join("|").toLowerCase();
    if (this.cache.has(key)) return this.cache.get(key) ?? null;

    const result = await this.runLadder(country, state, city);
    this.cache.set(key, result);

    return result;
  }

  private async runLadder(
    country: string,
    state: string | undefined,
    city: string | undefined,
  ): Promise<GeocodeResult | null> {
    const ladder: Array<{ precision: GeoPrecision; queries: Query[] }> = [];

    if (city) {
      const structured: Record<string, string> = { city, country };

      if (state) structured.state = state;
      const free = [city, state, country].filter(Boolean).join(", ");

      ladder.push({
        precision: "city",
        queries: [
          { kind: "structured", params: structured },
          { kind: "free", q: free },
        ],
      });
    }

    if (state) {
      ladder.push({
        precision: "state",
        queries: [{ kind: "structured", params: { state, country } }],
      });
    }

    ladder.push({
      precision: "country",
      queries: [{ kind: "structured", params: { country } }],
    });

    for (const level of ladder) {
      for (const query of level.queries) {
        const hit = await this.lookup(query);

        if (hit) {
          return { ...hit, precision: level.precision };
        }
      }
    }

    return null;
  }

  private async lookup(
    query: Query,
  ): Promise<{ lat: number; lng: number } | null> {
    const params = new URLSearchParams({ format: "jsonv2", limit: "1" });

    if (query.kind === "structured") {
      for (const [k, v] of Object.entries(query.params)) {
        params.set(k, v);
      }
    } else {
      params.set("q", query.q);
    }

    const body = await this.throttled(() =>
      this.fetchJson(`${this.baseUrl}/search?${params}`),
    );
    if (!Array.isArray(body) || body.length === 0) return null;

    const first = body[0] as Partial<NominatimHit>;
    const lat = Number(first.lat);
    const lng = Number(first.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

    return { lat, lng };
  }
}
