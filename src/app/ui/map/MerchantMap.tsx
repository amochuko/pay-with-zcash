"use client";

import { clientEnv } from "@/app/lib/client-env";
import type { LayerGroup, Map as LMap, Marker, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GeoPrecision,
  GROUP_ORDER,
  GROUPS,
  MerchantFeatureCollection,
} from "../../lib/types/map.types";
import { useIsDark } from "../hooks/useIsDark";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { DetailCard } from "./DetailCard";
import { FilterProps, Filters } from "./Filters";
import {
  DESIGN_TOKEN,
  esc,
  groupColor,
  haloHTML,
  ParsedMerchants,
  parserMerchants,
  pinHTML,
  placeLabel,
} from "./helpers";
import { MerchantItem } from "./MerchantItem";

const CSS = `
  .zmm-root .leaflet-container { background: var(--color-background-secondary) !important; font-family: inherit; }
  .zmm-root .leaflet-control-zoom a {
    background: var(--color-background-secondary) !important;
    border-color: var(--color-border-secondary) !important;
    color: var(--color-text-secondary) !important;
    line-height: 26px !important;
  }
  .zmm-root .leaflet-control-zoom a:hover {
    background: var(--color-background-primary) !important;
    color: var(--color-text-primary) !important;
  }
  .zmm-root .leaflet-control-attribution {
    background: var(--color-background-secondary) !important;
    font-size: 10px !important;
    color: var(--color-text-tertiary) !important;
  }
  .zmm-root .leaflet-control-attribution a { color: var(--color-text-secondary) !important; }
  .zmm-root .leaflet-tooltip.zmm-tip {
    background: var(--color-background-secondary);
    border: 1px solid var(--color-border-secondary);
    border-radius: 6px;
    padding: 6px 10px;
    box-shadow: none;
    color: var(--color-text-primary);
  }
  .zmm-root .leaflet-tooltip-top.zmm-tip::before { display: none !important; }
  .zmm-root .zmm-pin { transition: transform .12s ease; transform-origin: 50% 100%; }
  .zmm-root .zmm-halo { transition: transform .12s ease; }
  .zmm-list::-webkit-scrollbar { width: 4px; }
  .zmm-list::-webkit-scrollbar-track { background: transparent; }
  .zmm-list::-webkit-scrollbar-thumb { background: var(--color-border-secondary); border-radius: 4px; }
  .zmm-root button:focus-visible, .zmm-root a:focus-visible, .zmm-root input:focus-visible,
  .zmm-root select:focus-visible, .zmm-item:focus-visible { outline: 2px solid ${DESIGN_TOKEN.accent}; outline-offset: 1px; }
  @media (prefers-reduced-motion: reduce) { .zmm-root * { transition: none !important; } }
`;

const WORLD_CENTER: [number, number] = [20, 10];
const WORLD_ZOOM = 2;
const MOBILE_QUERY = "(max-width:767px)";

const ZOOM_BY_PRECISION: Record<GeoPrecision, number> = {
  city: 12,
  state: 7,
  country: 5,
};

export function MerchantMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LMap | null>(null);
  const tileRef = useRef<TileLayer | null>(null);
  const layerRef = useRef<LayerGroup | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const didFitRef = useRef(false);

  const dark = useIsDark();
  const mobile = useMediaQuery(MOBILE_QUERY);

  const [all, setAll] = useState<ParsedMerchants[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState(""); // TODO: use category value as type
  const [showApprox, setShowApprox] = useState(true);
  const [selectId, setSelectedId] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const apiUrl = `/api/map`;

  useEffect(() => {
    const ctrl = new AbortController();

    setStatus("loading");

    fetch(apiUrl, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/geo+json, application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));

        return r.json();
      })
      .then((json: MerchantFeatureCollection) => {
        const result = parserMerchants(json);
        setAll(result);

        setStatus("ready");
      })
      .catch((e) => {
        if (e?.name !== "AbortError") {
          setStatus("ready");
        }
      });

    return () => ctrl.abort();
  }, [attempt]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return all.filter((m) => {
      if (categoryId && m.categoryId !== categoryId) return false;

      if (!showApprox && m.precision !== "city") return false;
      if (!q) return true;

      return [m.name, m.category, m.city, m.state, m.country].some((v) =>
        v?.toLowerCase().includes(q),
      );
    });
  }, [all, search, categoryId, showApprox]);

  const categories = useMemo(() => {
    const byId = new Map<string, { id: string; name: string; count: number }>();
    for (const m of all) {
      const c = byId.get(m.categoryId) ?? {
        id: m.categoryId,
        name: m.category || "Uncategorised",
        count: 0,
      };

      c.count++;
      byId.set(m.categoryId, c);
    }

    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [all]);

  const selected = useMemo(
    () => filtered.find((m) => m.id === selectId) ?? null,
    [filtered, selectId],
  );

  const groupsPresent = useMemo(
    () => GROUP_ORDER.filter((g) => all.some((m) => m.categoryGroup === g)),
    [all],
  );

  const approxCount = useMemo(
    () => all.filter((m) => m.precision !== "city").length,
    [all],
  );

  const countryCount = useMemo(
    () => new Set(all.map((m) => m.country.toLowerCase())).size,
    [all],
  );

  const filtersActive = Boolean(search || categoryId || !showApprox);

  const toggle = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setSheetOpen(false);
  }, []);

  // -- Init Leaflet (once) --------------------------

  useEffect(() => {
    let cancelled = false;
    let map: LMap | null = null;
    let ro: ResizeObserver | null = null;

    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: WORLD_CENTER,
        zoom: WORLD_ZOOM,
        minZoom: 2,
        worldCopyJump: true,
      });

      map.attributionControl.setPrefix(false);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      // The map's box changes when the mobile sheet opens or the window resizes
      ro = new ResizeObserver(() => map?.invalidateSize());
      ro.observe(containerRef.current);
      setMapReady(true);
    });

    return () => {
      cancelled = true;
      ro?.disconnect();
      map?.remove();
      mapRef.current = null;
      layerRef.current = null;
      tileRef.current = null;
      markersRef.current.clear();
      didFitRef.current = false;

      setMapReady(false);
    };
  }, []);

  // -- Basemap follows the site theme -----
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    const map = mapRef.current;
    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled) return;

      tileRef.current?.remove();

      const style = dark ? "dark_all" : "rastertiles/voyager";
      tileRef.current = L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png?key=${process.env.NEXT_PUBLIC_CARTO_MAP_API_KEY}`,
        {
          maxZoom: 19,
          subdomains: "abcd",
          attribution:
            '© <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a> · ' +
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
        },
      ).addTo(map);

      tileRef.current.bringToBack();
    });

    return () => {
      cancelled = true;
    };
  }, [mapReady, dark]);

  // -- Markers follows the filters -------------------------------------
  useEffect(() => {
    if (!mapReady || !layerRef.current || !mapRef.current) return;

    const layer = layerRef.current;
    const map = mapRef.current;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled) return;

      layer.clearLayers();
      markersRef.current.clear();

      for (const m of filtered) {
        const color = groupColor(m.categoryGroup);
        const approx = m.precision !== "city";

        const marker = L.marker([m.lat, m.lng], {
          icon: L.divIcon({
            className: "",
            html: approx ? haloHTML(color, false) : pinHTML(color, false),
            iconSize: approx ? [28, 28] : [22, 28],
            iconAnchor: approx ? [14, 14] : [11, 28],
          }),
          keyboard: false,
          riseOnHover: true,
        });

        marker.on("click", () => toggle(m.id));
        marker.bindTooltip(
          `<div style="background:var(--color-secondary);padding:8px">
            <div style="font-size:12px;font-weight:500;color:var(--color-primary)">${esc(m.name)}</div>` +
            `<div style="font-size:11px;color:var(--color-secondary-foreground);margin-top:2px">` +
            `${esc(placeLabel(m))}${approx ? " · approximate" : ""}</div>
            </div>`,
          {
            direction: "top",
            offset: [0, approx ? -14 : -26],
            className: "zmm-tip",
          },
        );

        layer.addLayer(marker);
        markersRef.current.set(m.id, marker);
      }

      // Frame the data once on first load; later filter changes keep the user's view
      if (!didFitRef.current && filtered.length > 0) {
        didFitRef.current = true;

        if (filtered.length === 1) {
          const only = filtered[0];

          map.setView(
            [only.lat, only.lng],
            ZOOM_BY_PRECISION[only.precision as GeoPrecision],
          );
        } else {
          map.fitBounds(L.latLngBounds(filtered.map((m) => [m.lat, m.lng])), {
            padding: [48, 48],
            maxZoom: 6,
          });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [filtered, mapReady, toggle]);

  // -- Highlight the selected marker without rebuilding all of them -------------
  const prevSelectedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!mapReady) return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled) return;

      const paint = (id: string | null, isSelected: boolean) => {
        const m = id ? all.find((m) => m.id === id) : undefined;
        const marker = id ? markersRef.current.get(id) : undefined;

        if (!m || !marker) return;

        const color = groupColor(m.categoryGroup);
        const approx = m.precision !== "city";

        marker.setIcon(
          L.divIcon({
            className: "",
            html: approx
              ? haloHTML(color, isSelected)
              : pinHTML(color, isSelected),
            iconSize: approx ? [28, 28] : [22, 28],
            iconAnchor: approx ? [14, 14] : [11, 28],
          }),
        );

        marker.setZIndexOffset(isSelected ? 1000 : 0);
      };

      paint(prevSelectedRef.current, false);
      paint(selectId, true);
      prevSelectedRef.current = selectId;
    });

    return () => {
      cancelled = true;
    };
  }, [selectId, mapReady, filtered, all]);

  // --- Fly to the selection; keep the list item in view -------------------------
  useEffect(() => {
    if (!mapRef.current || !selectId) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    mapRef.current.flyTo(
      [selected!.lat, selected!.lng],
      ZOOM_BY_PRECISION[selected!.precision as GeoPrecision],
      {
        duration: reduce ? 0 : 0.85,
      },
    );
  }, [selected]);

  useEffect(() => {
    if (selectId)
      document
        .getElementById(`zmm-${selectId}`)
        ?.scrollIntoView({ block: "nearest" });
  }, [selectId]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategoryId("");
    setSheetOpen(true);
    setSelectedId(null);
  }, []);

  const filterProps: FilterProps = {
    search,
    setSearch: (v) => {
      setSearch(v);
      setSelectedId(null);
    },
    categoryId,
    setCategoryId: (v) => {
      setCategoryId(v);
      setSelectedId(null);
    },
    showApprox,
    setShowApprox: (v) => {
      setShowApprox(v);
      setSelectedId(null);
    },
    categories,
    hasApprox: approxCount > 0,
  };

  // --- Pieces ------------------------------------------------------
  const countRow = (
    <div
      style={{
        padding: "6px 13px",
        borderBottom: `1px solid ${DESIGN_TOKEN.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: DESIGN_TOKEN.textFaint,
        }}
        aria-live="polite"
      >
        {filtered.length} merchant{filtered.length !== 1 ? "s" : ""}
        {filtersActive ? " matching" : ""}
      </span>

      {filtersActive && (
        <button
          onClick={clearFilters}
          style={{
            fontSize: 11,
            color: DESIGN_TOKEN.accentText,
            background: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Clear
        </button>
      )}
    </div>
  );

  const listOfMerchants = (
    <div
      className="zmm-list"
      role="list"
      style={{
        flex: 1,
        minHeight: 0,

        overflowY: "auto",
        overflowX: "hidden",
        overscrollBehavior: "contain",
      }}
    >
      {status === "loading" ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            fontSize: 13,
            color: DESIGN_TOKEN.textMuted,
          }}
        >
          Loading...
        </div>
      ) : status === "error" ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            fontSize: 13,
            color: DESIGN_TOKEN.textMuted,
          }}
        >
          Couldn't load merchants.{" "}
          <button
            onClick={() => setAttempt((n) => n + 1)}
            style={{
              color: DESIGN_TOKEN.accentText,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              padding: 0,
            }}
          >
            Try again
          </button>
        </div>
      ) : all.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            fontSize: 13,
            color: DESIGN_TOKEN.textMuted,
            lineHeight: 1.6,
          }}
        >
          No merchant are on the map yet.{" "}
          <a
            href={clientEnv.NEXT_PUBLIC_LISTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: DESIGN_TOKEN.accentText }}
          >
            List your business
          </a>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: 32,
            textAlign: "center",
            fontSize: 13,
            color: DESIGN_TOKEN.textMuted,
          }}
        >
          No merchant match
        </div>
      ) : (
        filtered.map((m) => (
          <MerchantItem
            key={m.id + m.lat}
            m={m}
            active={m.id === selectId}
            onClick={() => toggle(m.id)}
          />
        ))
      )}
    </div>
  );

  const legend = (
    <div
      style={{
        padding: "9px 13px",
        borderTop: `2px solid ${DESIGN_TOKEN.border}`,
        display: "flex",
        flexWrap: "wrap",
        gap: "5px 10px",
        flexShrink: 0,
        minHeight: 70,
      }}
    >
      {groupsPresent.map((g) => (
        <div
          key={g}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: DESIGN_TOKEN.textMuted,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: GROUPS[g].color,
            }}
          />

          {GROUPS[g].label}
        </div>
      ))}

      {approxCount > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontSize: 10,
            color: DESIGN_TOKEN.textMuted,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              border: `1.5px dashed red`,
              boxSizing: "border-box",
            }}
          />
          Dashed = approximate
        </div>
      )}
    </div>
  );

  const subTitle =
    status === "loading"
      ? "Loading merchants..."
      : status === "error"
        ? "Merchant data is unavailable right now"
        : all.length === 0
          ? "No merchants listed yet"
          : `${all.length} merchant${all.length !== 1 ? "s" : ""} in ${countryCount} countr${countryCount !== 1 ? "ies" : "y"}` +
            (approxCount ? ` · ${approxCount} with approximate location` : "");

  // --- Render ---------------------------------------
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div
        className="zmm-root"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          height: "calc(100dvh - 250px)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: mobile ? "14px 14px 12px" : "24px 24px 18px",
            borderBottom: `1px solid ${DESIGN_TOKEN.border}`,
            background: DESIGN_TOKEN.bg,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: DESIGN_TOKEN.accentBg,
              border: `1px solid ${DESIGN_TOKEN.accentBorder}`,
              borderRadius: 20,
              padding: "3px 11px",
              fontSize: 11,
              fontWeight: 500,
              color: DESIGN_TOKEN.accentText,
              letterSpacing: "0.06em",
              marginBottom: mobile ? 6 : 10,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: DESIGN_TOKEN.accent,
              }}
            />
            PAYWITHZ.CASH · MERCHANTS
          </div>

          <h1
            style={{
              fontSize: "clamp(18px, 3vw, 26px)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              margin: "0 0 4px",
              color: DESIGN_TOKEN.textPrimary,
              lineHeight: 1.2,
            }}
          >
            Business that accept ZEC
          </h1>

          <p
            style={{
              fontSize: 13,
              color: DESIGN_TOKEN.textMuted,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {subTitle}
          </p>
        </div>

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: mobile ? "column" : "row",
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {/* Desktop sidebar */}
          {!mobile && (
            <div
              style={{
                width: 300,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                borderRight: `1px solid ${DESIGN_TOKEN.border}`,
                background: DESIGN_TOKEN.bg,
                minHeight: 0,

                height: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: `1px solid ${DESIGN_TOKEN.border}`,
                  flexShrink: 0,
                }}
              >
                <Filters {...filterProps} />
              </div>

              {countRow}
              {listOfMerchants}
              {legend}
            </div>
          )}

          {/* Map column - position:absolute child gives Leaflet a concrete size */}
          <div
            style={{
              flex: 1,
              position: "relative",
              minHeight: 0,

              minWidth: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <div
              ref={containerRef}
              style={{ position: "absolute", inset: 0 }}
            />

            {status === "loading" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: DESIGN_TOKEN.bgCard,
                  fontSize: 13,
                  color: DESIGN_TOKEN.textMuted,
                }}
              >
                Loading map...
              </div>
            )}

            <DetailCard
              m={selected}
              onClose={() => setSelectedId(null)}
              mobile={mobile}
            />
          </div>

          {/* Mobile bottom sheet: search always visible, list on demand */}
          {mobile && (
            <div
              style={{
                flexShrink: 0,
                height: sheetOpen ? "52%" : "auto",
                display: "flex",
                flexDirection: "column",
                background: DESIGN_TOKEN.bg,
                borderTop: `1px solid ${DESIGN_TOKEN.borderStrong}`,
                minHeight: 0,
              }}
            >
              <div
                style={{
                  padding: "8px 10px",
                  display: "flex",
                  gap: 8,
                  alignItems: "start",
                  justifyContent: "space-between",
                  flexShrink: 0,
                  marginBottom: 10
                }}
              >
                {/* Filters */}
                <div className="w-full">
                  <Filters {...filterProps} />
                </div>
                <button
                  onClick={() => setSheetOpen((o) => !o)}
                  aria-expanded={sheetOpen}
                  style={{
                    flexShrink: 0,
                    padding: "7px 12px",
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 7,
                    cursor: "pointer",
                    border: `1px solid ${DESIGN_TOKEN.borderStrong}`,
                    background: DESIGN_TOKEN.amberBg,
                    color: DESIGN_TOKEN.textPrimary,
                    minWidth: 110
                  }}
                >
                  {sheetOpen ? "Map" : `View List · ${filtered.length}`}
                </button>
              </div>

              {sheetOpen && (
                <>
                  {countRow}
                  {listOfMerchants}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
