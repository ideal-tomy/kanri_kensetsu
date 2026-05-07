import type { ReactNode } from "react";

function PCAccessHint() {
  return (
    <div className="hidden border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 md:block">
      PCでは管理モード（/admin）をご利用ください
    </div>
  );
}

export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100">
      <PCAccessHint />
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white pb-20">{children}</div>
    </div>
  );
}
