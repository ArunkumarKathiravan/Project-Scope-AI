"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant={theme === "light" ? "default" : "outline"}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" /> Light
      </Button>
      <Button
        size="sm"
        variant={theme === "dark" ? "default" : "outline"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" /> Dark
      </Button>
      <Button
        size="sm"
        variant={theme === "system" ? "default" : "outline"}
        onClick={() => setTheme("system")}
      >
        <Laptop className="h-4 w-4" /> System
      </Button>
    </div>
  );
}
