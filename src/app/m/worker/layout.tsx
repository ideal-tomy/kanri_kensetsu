import type { ReactNode } from "react";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { getViewSession } from "@/lib/auth/preview";

export default async function WorkerSegmentLayout({ children }: { children: ReactNode }) {
  const { preview, user } = await getViewSession("worker");

  return (
    <>
      <PreviewBanner preview={preview} scope="worker" displayName={user?.name ?? ""} />
      {children}
    </>
  );
}
