import { NextResponse } from "next/server";

const SESSION_COOKIE = "dashboard_session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
