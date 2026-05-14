import type { AppRole, SessionUser } from "@/lib/auth/session";
import { getSessionFromCookies } from "@/lib/auth/session";
import { demoAccounts } from "@/lib/prototype-store";

/** 経営者プレビュー時に worker 画面へ投影するデモ職人 */
const PREVIEW_WORKER_NAME = "田中さん";
/** 経営者プレビュー時に supervisor 画面へ投影するデモ監督 */
const PREVIEW_SUPERVISOR_NAME = "伊藤監督";

export type ViewSession = {
  user: SessionUser | null;
  preview: boolean;
  realRole: AppRole | null;
};

function demoUserToSession(name: string, role: SessionUser["role"]): SessionUser {
  const acc = demoAccounts.find((a) => a.name === name && a.role === role);
  if (!acc) {
    throw new Error(`preview account not found: ${name} (${role})`);
  }
  return {
    id: `preview-${role}-${acc.name}`,
    name: acc.name,
    companyCode: acc.companyCode,
    role: acc.role,
  };
}

export function toPreviewWorkerSession(): SessionUser {
  return demoUserToSession(PREVIEW_WORKER_NAME, "worker");
}

export function toPreviewSupervisorSession(): SessionUser {
  return demoUserToSession(PREVIEW_SUPERVISOR_NAME, "supervisor");
}

/**
 * admin/owner が /m/worker または /m/supervisor を見るとき、デモ用の職人・監督としてデータを解決する。
 */
export async function getViewSession(scope: "worker" | "supervisor"): Promise<ViewSession> {
  const real = await getSessionFromCookies();
  if (!real) {
    return { user: null, preview: false, realRole: null };
  }

  if (real.role === "admin" || real.role === "owner") {
    if (scope === "worker") {
      return {
        user: toPreviewWorkerSession(),
        preview: true,
        realRole: real.role,
      };
    }
    return {
      user: toPreviewSupervisorSession(),
      preview: true,
      realRole: real.role,
    };
  }

  return { user: real, preview: false, realRole: null };
}

/**
 * Route Handlers 用。Referer が /m/worker または /m/supervisor のとき、
 * admin/owner の Cookie でも現場プレビュー用ユーザーとして振る舞う。
 */
export function resolveApiUserFromRequest(request: Request, cookieUser: SessionUser): SessionUser {
  if (cookieUser.role !== "admin" && cookieUser.role !== "owner") {
    return cookieUser;
  }
  const referer = request.headers.get("referer") ?? "";
  try {
    if (referer.includes("/m/worker")) {
      return toPreviewWorkerSession();
    }
    if (referer.includes("/m/supervisor")) {
      return toPreviewSupervisorSession();
    }
  } catch {
    return cookieUser;
  }
  return cookieUser;
}
