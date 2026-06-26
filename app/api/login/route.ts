import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "dashboard_session";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = typeof body?.password === "string" ? body.password : "";

  if (!process.env.DASHBOARD_PASSWORD || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "サーバー側の設定が未完了です" }, { status: 500 });
  }

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, process.env.SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return response;
}
