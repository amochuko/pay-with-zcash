import { DESIGN_TOKEN } from "./helpers";
import { fieldStyle } from "./styles";


export // ---------------------------------------------------------------------------
// Filters (shared between the desktop sidebar and the mobile sheet)
// ---------------------------------------------------------------------------

interface FilterProps {
  search: string;
  setSearch: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  showApprox: boolean;
  setShowApprox: (v: boolean) => void;
  categories: Array<{ id: string; name: string; count: number }>;
  hasApprox: boolean;
  /** Mobile already shows the search box in the sheet bar. */
  hideSearch?: boolean;
}

export function Filters(p: FilterProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {!p.hideSearch && (
        <input
          type="search"
          placeholder="Name, category, city, country..."
          value={p.search}
          onChange={(e) => p.setSearch(e.target.value)}
          aria-label="Search merchants"
          style={fieldStyle}
        />
      )}

      <select
        value={p.categoryId}
        onChange={(e) => p.setCategoryId(e.target.value)}
        aria-label="Filter by category"
        style={{ ...fieldStyle, cursor: "pointer" }}
      >
        <option value="">All categories</option>
        {p.categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} {c.count}
          </option>
        ))}
      </select>

      {p.hasApprox && (
        <label
          style={{
            display: "flex",
            gap: 7,
            alignItems: "center",
            fontSize: 12,
            color: DESIGN_TOKEN.textMuted,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={p.showApprox}
            onChange={(e) => p.setShowApprox(e.target.checked)}
          />
          Include approximate locations
        </label>
      )}
    </div>
  );
}
