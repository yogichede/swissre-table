type SortOrder = "asc" | "desc";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  sortOrder: SortOrder;
  onToggleSort: () => void;
};

export function FruitToolbar({
  search,
  onSearchChange,
  sortOrder,
  onToggleSort,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search fruits..."
        aria-label="Search fruits"
        style={{
          flex: 1,
          minWidth: 220,
          padding: "10px 12px",
          border: "1px solid #cbd5e1",
          borderRadius: 8,
        }}
      />

      <button type="button" onClick={onToggleSort}>
        Sort: {sortOrder === "asc" ? "A->Z" : "Z->A"}
      </button>
    </div>
  );
}