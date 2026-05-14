import { NextResponse } from "next/server";
import { loginAs } from "@/lib/prototype-store";
import { encodeSession, getDefaultPathForRole, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json()) as { companyCode?: string; name?: string };
  if (!body.companyCode?.trim()) {
    return NextResponse.json({ message: "会社コードを入力してください" }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return NextResponse.json({ message: "氏名を入力してください" }, { status: 400 });
  }
  let user;
  try {
    user = loginAs(body.companyCode.trim().toUpperCase(), body.name.trim());
  } catch {
    return NextResponse.json(
      { message: "仮アカウントが見つかりません（下の一覧から選択してください）" },
      { status: 401 },
    );
  }
  const response = NextResponse.json({ user, target: getDefaultPathForRole(user.role) });
  response.cookies.set(SESSION_COOKIE, encodeSession(user), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
