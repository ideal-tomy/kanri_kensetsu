import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";
import {
  appendPersistedNotification,
  appendPersistedPhoto,
} from "@/lib/persist/demo-events";
import { hydrateDemoEvents } from "@/lib/persist/hydrate";
import { isAllowedImageUrl } from "@/lib/persist/image-url";
import {
  createPhotoReport,
  getCompanyCodeForSite,
  getPhotoReportsForUser,
  state,
  type PhotoCategory,
} from "@/lib/prototype-store";
import { shadowInsertPhotoReport } from "@/lib/db/photo-reports";

const VALID_CATEGORIES: PhotoCategory[] = ["regular", "progress"];

export async function GET(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  await hydrateDemoEvents(user.companyCode);

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as PhotoCategory | null;
  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ message: "カテゴリが不正です" }, { status: 400 });
  }
  return NextResponse.json({ photos: getPhotoReportsForUser(user, category ?? undefined) });
}

export async function POST(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  const body = (await request.json()) as {
    siteId?: string;
    category?: PhotoCategory;
    fileName?: string;
    title?: string;
    note?: string;
    imageUrl?: string;
  };

  if (!body.siteId) {
    return NextResponse.json({ message: "現場を選んでください" }, { status: 400 });
  }
  if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
    return NextResponse.json({ message: "写真カテゴリを選んでください" }, { status: 400 });
  }
  if (!body.fileName?.trim()) {
    return NextResponse.json({ message: "写真ファイルを選んでください" }, { status: 400 });
  }
  if (body.category === "progress" && !body.title?.trim()) {
    return NextResponse.json({ message: "進捗報告では画像タイトルが必要です" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim();
  if (!imageUrl || !isAllowedImageUrl(imageUrl)) {
    return NextResponse.json(
      {
        message:
          "画像はサンプルから選ぶか、Blob アップロード後の URL を指定してください（/images/...）",
      },
      { status: 400 },
    );
  }

  await hydrateDemoEvents(user.companyCode);

  const photo = createPhotoReport({
    siteId: body.siteId,
    userName: user.name,
    category: body.category,
    fileName: body.fileName.trim(),
    title: body.title?.trim(),
    note: body.note?.trim(),
    imageUrl,
  });

  const company = getCompanyCodeForSite(body.siteId);
  const notification = state.notifications.find((n) => n.photoId === photo.id);

  await Promise.all([
    appendPersistedPhoto(company, photo),
    notification ? appendPersistedNotification(company, notification) : Promise.resolve(),
  ]);

  shadowInsertPhotoReport(photo).catch((error) => {
    console.error("shadowInsertPhotoReport failed", error);
  });

  return NextResponse.json({ photo });
}
