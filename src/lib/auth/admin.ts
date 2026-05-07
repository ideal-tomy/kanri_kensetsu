import { redirect } from "next/navigation";
import { getSessionFromCookies, type SessionUser } from "@/lib/auth/session";
import { state } from "@/lib/prototype-store";

const DEMO_ADMIN_FALLBACK: SessionUser = {
  id: "demo-admin",
  name: "中村花子",
  companyCode: "YMD35",
  role: "admin",
};

const DEMO_SUPERVISOR_FALLBACK: SessionUser = {
  id: "demo-supervisor",
  name: "伊藤監督",
  companyCode: "YMD35",
  role: "supervisor",
};

function pickStoredUser(roles: SessionUser["role"][]): SessionUser | null {
  return state.users.find((user) => roles.includes(user.role)) ?? null;
}

/**
 * 管理画面（admin/owner）専用のセッション取得。
 * 開発デモではセッション未設定でも止めず、prototype-store のユーザーまたは固定デモユーザーで動かす。
 */
export async function requireAdminSession(): Promise<SessionUser> {
  const cookieUser = await getSessionFromCookies();
  if (cookieUser) {
    if (cookieUser.role === "admin" || cookieUser.role === "owner") {
      return cookieUser;
    }
    redirect("/m/worker");
  }

  return pickStoredUser(["admin", "owner"]) ?? DEMO_ADMIN_FALLBACK;
}

/**
 * supervisor 以上（supervisor/admin/owner）のセッション取得。
 */
export async function requireSupervisorSession(): Promise<SessionUser> {
  const cookieUser = await getSessionFromCookies();
  if (cookieUser) {
    if (
      cookieUser.role === "supervisor" ||
      cookieUser.role === "admin" ||
      cookieUser.role === "owner"
    ) {
      return cookieUser;
    }
    redirect("/m/worker");
  }

  return pickStoredUser(["supervisor", "admin", "owner"]) ?? DEMO_SUPERVISOR_FALLBACK;
}
