import { NextResponse } from "next/server";

const API_BASE_URL = process.env.SEENBYAI_API_URL ?? "http://127.0.0.1:8000";

// Public read-only proxy so MCP clients (and the dashboard) can reach the
// FastAPI service without exposing it publicly.
export async function GET(_request: Request, { params }: { params: Promise<{ site_id: string }> }) {
  const { site_id } = await params;
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/${encodeURIComponent(site_id)}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ detail: "Service unavailable" }, { status: 503 });
  }
}
