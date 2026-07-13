"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark, History } from "lucide-react";
import type { HistoryItem, SavedItem } from "@/types";
import { historyStorage, savedStorage } from "@/lib/storage/client-storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function HomeStorageSummary() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [saved, setSaved] = useState<SavedItem[]>([]);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setHistory(historyStorage.list().slice(0, 3));
      setSaved(savedStorage.list().slice(0, 3));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" /> Recent searches
          </CardTitle>
          <Link href="/history">
            <Button size="sm" variant="ghost">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <p className="font-medium">{item.response.analysis.improvedTitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(item.searchedAt).toLocaleString()} · {item.response.results.length}{" "}
                results
              </p>
            </div>
          ))}
          {!history.length && (
            <p className="text-sm text-muted-foreground">
              Your latest searches will be listed here.
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" /> Saved projects
          </CardTitle>
          <Link href="/saved">
            <Button size="sm" variant="ghost">
              View all
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {saved.map((item) => (
            <div key={item.id} className="rounded-lg border p-3">
              <p className="font-medium">{item.result.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {item.result.source} · {item.result.similarity.total}% similarity
              </p>
            </div>
          ))}
          {!saved.length && (
            <p className="text-sm text-muted-foreground">
              Saved repositories, videos and web pages will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
