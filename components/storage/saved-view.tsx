"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import type { SavedItem } from "@/types";
import { exportStorage, importStorage, savedStorage } from "@/lib/storage/client-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResultCard } from "@/components/results/result-card";
import { useToast } from "@/components/ui/toast";

export function SavedView() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const refresh = () => setItems(savedStorage.list());
  useEffect(() => {
    const timer = window.setTimeout(refresh, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const exportAll = () => {
    const blob = new Blob([exportStorage()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "projectscope-browser-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
    toast("Saved results and history exported.");
  };
  const importAll = async (file?: File) => {
    if (!file) return;
    try {
      importStorage(await file.text());
      refresh();
      toast("ProjectScope browser data imported.");
    } catch {
      toast("Import failed. Choose a valid ProjectScope JSON export.");
    }
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={exportAll}>
          <Download className="h-4 w-4" /> Export browser data
        </Button>
        <Button variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" /> Import browser data
        </Button>
        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="application/json,.json"
          onChange={(event) => importAll(event.target.files?.[0])}
        />
      </div>
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <ResultCard result={item.result} project={item.project} />
          <div className="flex gap-2">
            <Input
              value={item.note}
              placeholder="Add a private note"
              onChange={(event) => {
                savedStorage.updateNote(item.id, event.target.value);
                refresh();
              }}
            />
            <Button
              variant="destructive"
              onClick={() => {
                savedStorage.remove(item.id);
                refresh();
                toast("Saved result deleted.");
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="rounded-xl border p-10 text-center text-muted-foreground">
          Saved repositories, videos and web results will appear here.
        </p>
      )}
    </div>
  );
}
