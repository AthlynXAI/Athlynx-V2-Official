import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "athlynx-platform",
    build: 1,
    timestamp: new Date().toISOString(),
  });
}
