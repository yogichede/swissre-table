import { useCallback, useMemo, useState } from "react";
import { useFruits, Fruit } from "../hooks/useFruits";
import { FruitToolbar } from "./FruitToolbar";
import { FruitList } from "./FruitList";
import { useDebouncedValue } from "../hooks/useDebounceValue";

type SortOrder = "asc" | "desc";

const fakeSave = (item: Fruit): Promise<Fruit> =>
  new Promise((resolve) => setTimeout(() => resolve(item), 1000));

export function FruitPage() {
  const { items, setItems, loading, error } = useFruits();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());

  const toggleSort = useCallback(() => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const handleSave = useCallback(async (id: number, nextName: string) => {
    setSavingIds((prev) => new Set(prev).add(id));

    try {
      const current = items.find((item) => item.id === id);
      if (!current) return;

      await fakeSave({ ...current, name: nextName });

      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: nextName } : item))
      );
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, [items, setItems]);

  const visibleItems = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    const filtered = q
      ? items.filter((item) => item.name.toLowerCase().includes(q))
      : items;

    return [...filtered].sort((a, b) => {
      const result = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
      return sortOrder === "asc" ? result : -result;
    });
  }, [items, debouncedSearch, sortOrder]);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>Error: {error}</div>;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Fruits</h1>

      <FruitToolbar
        search={search}
        onSearchChange={setSearch}
        sortOrder={sortOrder}
        onToggleSort={toggleSort}
      />

      <FruitList items={visibleItems} savingIds={savingIds} onSave={handleSave} />
    </div>
  );
}