/**
 * 許可する画像 URL（静的サンプル or Vercel Blob）。
 * data URL はデプロイ時ペイロード肥大・失敗の原因になるため不可。
 */
export function isAllowedImageUrl(url: string): boolean {
  if (url.startsWith("/images/")) return true;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return (
      u.hostname.endsWith(".public.blob.vercel-storage.com") ||
      u.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export const DEMO_SAMPLE_IMAGES = [
  {
    id: "morning_briefing",
    fileName: "morning_briefing.png",
    imageUrl: "/images/morning_briefing.png",
    label: "朝礼",
  },
  {
    id: "site_morning",
    fileName: "site_morning.png",
    imageUrl: "/images/site_morning.png",
    label: "朝礼（高所）",
  },
  {
    id: "scaffold_check",
    fileName: "scaffold_check.png",
    imageUrl: "/images/scaffold_check.png",
    label: "足場固定確認",
  },
  {
    id: "wall_boards_8",
    fileName: "wall_boards_8.png",
    imageUrl: "/images/wall_boards_8.png",
    label: "外壁ボード 8枚",
  },
  {
    id: "floor_finish_2",
    fileName: "floor_finish_2.png",
    imageUrl: "/images/floor_finish_2.png",
    label: "床仕上げ 2区画",
  },
  {
    id: "north_wall",
    fileName: "north_wall.png",
    imageUrl: "/images/north_wall.png",
    label: "北壁外壁",
  },
] as const;
