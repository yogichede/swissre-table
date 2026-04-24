import { useEffect, useState } from "react";

export type Fruit = {
  id: number;
  name: string;
};

const API_URL =
  "https://e6c32db1-2bd8-4bd3-a9c0-f062671702aa.mock.pstmn.io/fruits";

export function useFruits() {
  const [items, setItems] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data: Fruit[] = await res.json();
        if (active) setItems(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { items, setItems, loading, error };
}