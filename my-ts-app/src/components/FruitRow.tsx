import React, { useCallback, useEffect, useRef, useState } from "react";

type Fruit = {
  id: number;
  name: string;
};

type FruitRowProps = {
  fruit: Fruit;
  isSaving: boolean;
  onSave: (id: number, nextName: string) => Promise<void>;
};

export const FruitRow = React.memo(function FruitRow({
  fruit,
  isSaving,
  onSave,
}: FruitRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(fruit.name);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setDraftName(fruit.name);
  }, [fruit.name]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = useCallback(() => {
    setDraftName(fruit.name);
    setIsEditing(true);
  }, [fruit.name]);

  const cancelEditing = useCallback(() => {
    setDraftName(fruit.name);
    setIsEditing(false);
  }, [fruit.name]);

  const handleSave = useCallback(async () => {
    const trimmed = draftName.trim();

    if (!trimmed || trimmed === fruit.name) {
      setIsEditing(false);
      setDraftName(fruit.name);
      return;
    }

    await onSave(fruit.id, trimmed);
    setIsEditing(false);
  }, [draftName, fruit.id, fruit.name, onSave]);

  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        await handleSave();
      } else if (e.key === "Escape") {
        cancelEditing();
      }
    },
    [handleSave, cancelEditing]
  );

  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <span style={{ minWidth: 40, color: "#6b7280" }}>{fruit.id}</span>

      <div style={{ flex: 1 }}>
        {isEditing ? (
          <input
            ref={inputRef}
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            aria-label={`Edit ${fruit.name}`}
            style={{
              width: "100%",
              padding: "8px 10px",
              border: "1px solid #cbd5e1",
              borderRadius: 8,
            }}
          />
        ) : (
          <button
            type="button"
            onClick={startEditing}
            disabled={isSaving}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 16,
              textAlign: "left",
            }}
            aria-label={`Rename ${fruit.name}`}
          >
            {fruit.name}
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {isSaving && (
          <span style={{ fontSize: 14, color: "#2563eb" }}>Saving...</span>
        )}

        {isEditing && (
          <>
            <button type="button" onClick={handleSave} disabled={isSaving}>
              Save
            </button>
            <button type="button" onClick={cancelEditing} disabled={isSaving}>
              Cancel
            </button>
          </>
        )}
      </div>
    </li>
  );
});