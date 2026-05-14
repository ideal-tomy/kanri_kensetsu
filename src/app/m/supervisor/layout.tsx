import type { ReactNode } from "react";
import { PreviewBanner } from "@/components/layout/preview-banner";
import { getViewSession } from "@/lib/auth/preview";

export default async function SupervisorSegmentLayout({ children }: { children: ReactNode }) {
  const { preview, user } = await getViewSession("supervisor");

  return (
    <>
      <PreviewBanner preview={preview} scope="supervisor" displayName={user?.name ?? ""} />
      {children}
    </>
  );
}
