"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HistoryItem } from "@/types";
import { historyStorage } from "@/lib/storage/client-storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export function HistoryView() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => setItems(historyStorage.list()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const open = (item: HistoryItem) => {
    sessionStorage.setItem("projectscope:latest", JSON.stringify(item.response));
    router.push("/results");
  };
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => {
            historyStorage.clear();
            setItems([]);
          }}
        >
          Clear history
        </Button>
      </div>
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.response.analysis.improvedTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(item.searchedAt).toLocaleString()} · {item.response.results.length} results
            </p>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {item.response.analysis.summary}
            </p>
            <Button className="mt-4" onClick={() => open(item)}>
              Open results
            </Button>
          </CardContent>
        </Card>
      ))}
      {items.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            Your searches will appear here.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
