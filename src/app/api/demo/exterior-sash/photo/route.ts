import { NextResponse } from "next/server";
import { createPhotoReport } from "@/lib/prototype-store";
import { getExteriorSashConfig } from "@/lib/demo/exterior-sash-rules";

const DEFAULT_WORKER = "佐藤さん";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    siteId?: string;
    slotId?: string;
    workerName?: string;
    note?: string;
    /** クライアントの元ファイル名（任意。枠があればサーバで書き換え） */
    fileName?: string;
  };

  const siteId = body.siteId?.trim();
  if (!siteId) {
    return NextResponse.json({ message: "現場を指定してください" }, { status: 400 });
  }
  const slotIdRaw = body.slotId?.trim();
  if (!slotIdRaw) {
    return NextResponse.json({ message: "写真枠を指定してください" }, { status: 400 });
  }

  const cfg = getExteriorSashConfig(siteId);
  if (!cfg) {
    return NextResponse.json({ message: "この現場は外壁サッシデモ対象外です" }, { status: 400 });
  }
  const slot = cfg.slots.find((s) => s.id === slotIdRaw);
  if (!slot) {
    return NextResponse.json({ message: "写真枠IDが不正です" }, { status: 400 });
  }

  const userName = (body.workerName?.trim() || DEFAULT_WORKER) as string;
  const stubFile = body.fileName?.trim() || "upload.jpg";

  const photo = createPhotoReport({
    siteId,
    userName,
    category: "progress",
    fileName: stubFile,
    note: body.note?.trim(),
    photoSlotId: slotIdRaw,
    phaseId: cfg.currentPhase.id,
    phaseLabel: cfg.currentPhase.label,
  });

  return NextResponse.json({ photo });
}
