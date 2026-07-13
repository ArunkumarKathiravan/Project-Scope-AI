import { NextResponse } from "next/server";
import { getProviderStatus } from "@/lib/provider-status";
export async function GET() {
  return NextResponse.json(
    { checkedAt: new Date().toISOString(), ...getProviderStatus() },
    { headers: { "Cache-Control": "private, max-age=60" } }
  );
}
