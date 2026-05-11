"use server";

import { revalidatePath } from "next/cache";
import { setPhaseManualPercent, togglePhaseProgressMode } from "@/lib/prototype-store";

export async function togglePhaseAction(formData: FormData) {
  const phaseId = formData.get("phaseId") as string;
  const siteId = formData.get("siteId") as string;
  if (!phaseId || !siteId) return;
  togglePhaseProgressMode(phaseId);
  revalidatePath(`/admin/sites/${encodeURIComponent(siteId)}/phases`);
}

export async function setPhasePercentAction(formData: FormData) {
  const phaseId = formData.get("phaseId") as string;
  const siteId = formData.get("siteId") as string;
  const pct = Number(formData.get("pct"));
  if (!phaseId || !siteId || !Number.isFinite(pct)) return;
  setPhaseManualPercent(phaseId, pct);
  revalidatePath(`/admin/sites/${encodeURIComponent(siteId)}/phases`);
}
