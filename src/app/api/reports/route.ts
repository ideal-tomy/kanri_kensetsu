import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import {
  appendPersistedNotification,
  appendPersistedReport,
} from "@/lib/persist/demo-events";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import {
  createReport,
  getCompanyCodeForSite,
  getReportsForUser,
  state,
} from "@/lib/prototype-store";

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;
  await hydrateDemoEvents(user.companyCode);
  return NextResponse.json({ reports: getReportsForUser(user) });
}

export async function POST(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  const body = (await request.json()) as {
    siteId?: string;
    rawText?: string;
  };
  if (!body.siteId) {
    return NextResponse.json({ message: "現場を選んでください" }, { status: 400 });
  }
  if (!body.rawText?.trim()) {
    return NextResponse.json({ message: "話した内容を入れてください" }, { status: 400 });
  }

  await hydrateDemoEvents(user.companyCode);
  const report = createReport(body.siteId, user.name, body.rawText, user.companyCode);
  const company = getCompanyCodeForSite(body.siteId);
  const notification = state.notifications.find((n) => n.reportId === report.id);

  await Promise.all([
    appendPersistedReport(company, report),
    notification ? appendPersistedNotification(company, notification) : Promise.resolve(),
  ]);

  return NextResponse.json({ report });
}
