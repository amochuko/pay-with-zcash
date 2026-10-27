import { MerchantGeo, MerchantRecord } from "../../types/map.types";
import { buildMerchantGeoJSON, groupCategory } from "../build.merchant.geojson";
import { GeocodeError } from "../geocode.error";
import { geocodeMerchant } from "../geocode.merchant";
import { Geocoder } from "../geocoder";

type Call = URLSearchParams;

function mockFetch(handler: (p: Call) => unknown[] | number): {
  fetchImpl: typeof fetch;
  calls: Call[];
  times: number[];
} {
  const calls: Call[] = [];
  const times: number[] = [];

  const fetchImpl = (async (
    url: string | URL | Request,
    init?: RequestInit,
  ) => {
    const u = new URL(String(url));

    expect((init?.headers as Record<string, string>)["User-Agent"]).toBe(
      "test-agent",
    );

    calls.push(u.searchParams);
    times.push(Date.now());

    const out = handler(u.searchParams);

    if (typeof out === "number") {
      return new Response("err", { status: out });
    }

    return new Response(JSON.stringify(out), { status: 200 });
  }) as typeof fetch;

  return { fetchImpl, calls, times };
}

const hit = (lat: number, lon: number) => [
  { lat: String(lat), lon: String(lon) },
];

const mk = (fetchImpl: typeof fetch, minIntervalMs = 0) =>
  new Geocoder({ userAgent: "test-agent", fetchImpl, minIntervalMs });

describe("Geocoder", () => {
  it("city hit returns city precision via structured query", async () => {
    const m = mockFetch(() => hit(6.45, 3.39));

    const r = await mk(m.fetchImpl).geocode({
      country: "Nigeria",
      state: "Lagos",
      city: "Lagos",
    });

    expect(r).toEqual({
      lat: 6.45,
      lng: 3.39,
      precision: "city",
    });

    expect(m.calls).toHaveLength(1);
    expect(m.calls[0]!.get("city")).toBe("Lagos");
    expect(m.calls[0]!.get("state")).toBe("Lagos");
    expect(m.calls[0]!.get("country")).toBe("Nigeria");
  });

  it("falls back to free-text query before degrading", async () => {
    const m = mockFetch((p) => (p.has("q") ? hit(30.27, -97.74) : []));

    const r = await mk(m.fetchImpl).geocode({
      country: "United States",
      state: "TX",
      city: "Austin",
    });

    expect(r?.precision).toBe("city");
    expect(m.calls).toHaveLength(2);
    expect(m.calls[1]!.get("q")).toBe("Austin, TX, United States");
  });

  it("degrades city to state when the city is unknown", async () => {
    const m = mockFetch((p) =>
      p.has("city") || p.has("q")
        ? []
        : p.has("state")
          ? hit(7.5, 5.0)
          : hit(0, 0),
    );

    const r = await mk(m.fetchImpl).geocode({
      country: "Nigeria",
      state: "Ondo",
      city: "Nowhereville",
    });

    expect(r).toEqual({
      lat: 7.5,
      lng: 5.0,
      precision: "state",
    });
  });

  it("degrades all the way to country", async () => {
    const m = mockFetch((p) =>
      p.has("state") || p.has("city") || p.has("q") ? [] : hit(9.08, 8.67),
    );

    const r = await mk(m.fetchImpl).geocode({
      country: "Nigeria",
      state: "Zzz",
      city: "Yyy",
    });

    expect(r?.precision).toBe("country");
  });

  it("country only results in a single country query", async () => {
    const m = mockFetch(() => hit(1, 2));

    const r = await mk(m.fetchImpl).geocode({
      country: "Ghana",
      state: "  ",
      city: null,
    });

    expect(r?.precision).toBe("country");
    expect(m.calls).toHaveLength(1);
  });

  it("blank country returns null without a network request", async () => {
    const m = mockFetch(() => hit(1, 2));

    await expect(
      mk(m.fetchImpl).geocode({ country: "  " }),
    ).resolves.toBeNull();

    expect(m.calls).toHaveLength(0);
  });

  it("returns null when nothing matches", async () => {
    const m = mockFetch(() => []);

    await expect(
      mk(m.fetchImpl).geocode({ country: "Atlantis" }),
    ).resolves.toBeNull();
  });

  it("caches results using a case-insensitive key", async () => {
    const m = mockFetch(() => hit(6.45, 3.39));
    const g = mk(m.fetchImpl);

    await g.geocode({ country: "Nigeria", city: "Lagos" });
    await g.geocode({ country: "nigeria", city: "LAGOS" });

    expect(m.calls).toHaveLength(1);
  });

  it("throws GeocodeError on HTTP failure and does not cache failures", async () => {
    let fail = true;
    const m = mockFetch(() => (fail ? 503 : hit(1, 2)));
    const g = mk(m.fetchImpl);

    await expect(g.geocode({ country: "Kenya" })).rejects.toBeInstanceOf(
      GeocodeError,
    );

    fail = false;

    await expect(g.geocode({ country: "Kenya" })).resolves.toEqual({
      lat: 1,
      lng: 2,
      precision: "country",
    });

    expect(m.calls).toHaveLength(2);
  });

  it("rejects out-of-range or non-numeric coordinates", async () => {
    const m = mockFetch(() => [{ lat: "999", lon: "0" }]);

    await expect(mk(m.fetchImpl).geocode({ country: "X" })).resolves.toBeNull();
  });

  it("enforces the minimum interval between requests", async () => {
    const m = mockFetch(() => []);
    const g = mk(m.fetchImpl, 120);

    await g.geocode({
      country: "Nowhere",
      state: "S",
      city: "C",
    });

    const gaps = m.times.slice(1).map((t, i) => t - m.times[i]!);

    expect(m.times).toHaveLength(4);
    expect(gaps.every((d) => d >= 110)).toBe(true);
  });
});

describe("geocodeMerchant", () => {
  it("saves a successful result and skips saving on a miss", async () => {
    const saved: Array<[string, MerchantGeo]> = [];

    const repo = {
      saveGeo: jest.fn(async (id: string, geo: MerchantGeo) => {
        saved.push([id, geo]);
      }),
    };

    const ok = await geocodeMerchant(
      { id: "m1", country: "Kenya", state: null, city: "Nairobi" },
      mk(mockFetch(() => hit(-1.29, 36.82)).fetchImpl),
      repo,
    );

    expect(ok?.precision).toBe("city");
    expect(repo.saveGeo).toHaveBeenCalledTimes(1);
    expect(repo.saveGeo).toHaveBeenCalledWith("m1", ok);
    expect(saved).toHaveLength(1);
    expect(saved[0]![0]).toBe("m1");

    const miss = await geocodeMerchant(
      { id: "m2", country: "Atlantis" },
      mk(mockFetch(() => []).fetchImpl),
      repo,
    );

    expect(miss).toBeNull();
    expect(repo.saveGeo).toHaveBeenCalledTimes(1);
    expect(saved).toHaveLength(1);
  });
});

describe("buildMerchantGeoJSON", () => {
  const base = (over: Partial<MerchantRecord>): MerchantRecord => ({
    id: "x",
    name: "N",
    category: "Retail",
    website: "https://e.com",
    country: "Nigeria",
    geo: null,
    ...over,
  });

  const geo = (
    lat: number,
    lng: number,
    precision: MerchantGeo["precision"],
  ): MerchantGeo => ({
    lat,
    lng,
    precision,
    geocodedAt: "2026-10-20T00:00:00Z",
  
  });

  it("skips merchants without geo and counts precision", () => {
    const fc = buildMerchantGeoJSON([
      base({ id: "a", geo: geo(6.45, 3.39, "city") }),
      base({ id: "b", geo: geo(7.5, 5, "state") }),
      base({ id: "c", geo: null }),
    ]);

    expect(fc.type).toBe("FeatureCollection");
    expect(fc.features).toHaveLength(2);
    expect(fc.metadata.by_precision).toEqual({
      city: 1,
      state: 1,
      country: 0,
    });
    expect(fc.metadata.total_features).toBe(2);
  });

  it("uses [lng, lat] coordinates and keeps jitter within bounds", () => {
    const fc = buildMerchantGeoJSON(
      Array.from({ length: 200 }, (_, i) =>
        base({
          id: `m${i}`,
          geo: geo(6.45, 3.39, "city"),
        }),
      ),
    );

    for (const f of fc.features) {
      const [lng, lat] = f.geometry.coordinates;

      expect(Math.abs(lng - 3.39)).toBeLessThanOrEqual(0.0101);
      expect(Math.abs(lat - 6.45)).toBeLessThanOrEqual(0.0101);
    }

    expect(
      new Set(fc.features.map((f) => f.geometry.coordinates.join())).size,
    ).toBeGreaterThan(190);
  });

  it("produces deterministic jitter across builds", () => {
    const m = [base({ id: "stable", geo: geo(10, 20, "city") })];

    expect(buildMerchantGeoJSON(m).features[0]!.geometry).toEqual(
      buildMerchantGeoJSON(m).features[0]!.geometry,
    );
  });

  it("clamps latitude and wraps longitude near the edges", () => {
    const f = buildMerchantGeoJSON([
      base({
        id: "edge",
        geo: geo(89.99, 179.999, "country"),
      }),
    ]).features[0]!;

    expect(f.geometry.coordinates[1]).toBeLessThanOrEqual(85);
    expect(Math.abs(f.geometry.coordinates[0])).toBeLessThanOrEqual(180);
  });

  it("truncates descriptions, normalizes blanks and trims state/city", () => {
    const f = buildMerchantGeoJSON([
      base({
        id: "t",
        description: "x".repeat(500),
        state: "  ",
        city: " Lagos ",
        logoUrl: undefined,
        geo: geo(1, 1, "city"),
      }),
    ]).features[0]!;

    expect(f.properties.description).toHaveLength(200);
    expect(f.properties.state).toBeNull();
    expect(f.properties.city).toBe("Lagos");
    expect(f.properties.logoUrl).toBeNull();
  });
});

describe("groupCategory", () => {
  it.each([
    ["Food & Drink", "food_drink"],
    ["Hotel", "travel"],
    ["Online Services", "online_services"],
    ["Fashion", "retail"],
    ["Gaming", "entertainment"],
    ["Plumbing", "other"],
  ])("maps %s to %s", (category, expected) => {
    expect(groupCategory(category)).toBe(expected);
  });
});
