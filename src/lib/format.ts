import { DEMO_BRAND } from "@/config/demo-brand";

export const formatYmd = (date = new Date()): string => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}${m}${d}`;
};

export const formatCurrency = (value: number): string =>
  `${Math.round(value / 10000).toLocaleString("ja-JP")}万円`;

export const generateAutoPhotoName = (
  projectName: string,
  contentTag: string,
  date = new Date(),
): string =>
  `${DEMO_BRAND.productCode}_${projectName}_${formatYmd(date)}_${contentTag}.jpg`;
