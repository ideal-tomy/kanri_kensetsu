import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/api";

export async function POST(request: Request) {
  const user = requireSession(request);
  if (user instanceof NextResponse) return user;

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json(
      { message: "ファイルアップロードは未設定です。サンプル画像から選んでください。" },
      { status: 503 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "ファイルを選んでください" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "画像ファイルのみアップロードできます" }, { status: 400 });
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ message: "画像は 4MB 以下にしてください" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) ? ext : "jpg";
  const pathname = `kanri-photos/${Date.now()}-${Math.random().toString(36).slice(2)}.${safeExt}`;

  const blob = await put(pathname, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return NextResponse.json({
    imageUrl: blob.url,
    fileName: file.name,
  });
}
