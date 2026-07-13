"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, SearchCode, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
const links = [
  ["/", "Search"],
  ["/history", "History"],
  ["/saved", "Saved"],
  ["/compare", "Compare"],
  ["/status", "Status"],
  ["/settings", "Settings"]
];
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <SearchCode className="h-5 w-5" />
          </span>
          <span>ProjectScope AI</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <div className="flex items-center lg:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-label="Open navigation"
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background p-3 lg:hidden">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-sm hover:bg-muted"
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
