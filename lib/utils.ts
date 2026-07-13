import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}
export function safeUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}
export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}
export function formatNumber(value?: number) {
  return typeof value === "number" ? new Intl.NumberFormat().format(value) : "—";
}
export function shortDate(value?: string) {
  return value
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value))
    : "—";
}
