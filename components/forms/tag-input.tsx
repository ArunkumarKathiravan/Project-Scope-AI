"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
export function TagInput({
  value,
  onChange,
  placeholder
}: {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const item = draft.trim();
    if (item && value.length < 30 && !value.some((v) => v.toLowerCase() === item.toLowerCase()))
      onChange([...value, item]);
    setDraft("");
  };
  return (
    <div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="rounded-lg border px-3 text-sm" onClick={add}>
          Add
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((item) => (
          <Badge key={item}>
            {item}
            <button
              type="button"
              aria-label={`Remove ${item}`}
              onClick={() => onChange(value.filter((v) => v !== item))}
            >
              <X className="ml-1 h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{value.length}/30</p>
    </div>
  );
}
