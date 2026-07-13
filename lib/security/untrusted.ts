export function isolateUntrustedText(value: unknown, maxLength = 6000): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
export function safeExternalText(value: unknown, maxLength = 800): string {
  return isolateUntrustedText(value, maxLength);
}
