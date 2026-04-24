import { Fruit } from "../hooks/useFruits";
import { FruitRow } from "./FruitRow";

type Props = {
  items: Fruit[];
  savingIds: Set<number>;
  onSave: (id: number, nextName: string) => Promise<void>;
};

export function FruitList({ items, savingIds, onSave }: Props) {
  if (items.length === 0) {
    return <p>No fruits found.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((fruit) => (
        <FruitRow
          key={fruit.id}
          fruit={fruit}
          isSaving={savingIds.has(fruit.id)}
          onSave={onSave}
        />
      ))}
    </ul>
  );
}