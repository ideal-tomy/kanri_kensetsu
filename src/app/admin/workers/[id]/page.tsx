import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { DemoDisclaimer } from "@/components/layout/demo-disclaimer";
import { assignments, projects, workerProfiles, workers } from "@/data/mock";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WorkerDetailPage({ params }: Props) {
  const { id } = await params;
  const worker = workers.find((item) => item.id === id);
  if (!worker) return notFound();

  const profile = workerProfiles[id];
  const workerAssignments = assignments.filter((item) => item.workerId === id);
  const project = projects.find((item) => item.id === worker.currentProjectId);
  const hasIncidents =
    profile?.incidentNotes && profile.incidentNotes.length > 0;

  return (
    <PageShell
      mode="admin"
      title={`${worker.name} 詳細`}
      listHref="/admin/workers"
      listLabel="作業員一覧へ"
      breadcrumbs={[
        { label: "管理トップ", href: "/admin" },
        { label: "作業員管理", href: "/admin/workers" },
        { label: `${worker.name} 詳細` },
      ]}
    >
      <div className="space-y-4">
        {hasIncidents ? (
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-semibold">配員AI: 確認推奨</p>
              <p className="mt-1">
                過去の現場トラブルメモがあります。自動配員確定前に担当へ確認通知を出せます（デモ）。
              </p>
            </div>
          </div>
        ) : null}

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">現在の担当現場</p>
          <p className="text-lg font-semibold">{project?.projectName}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
              経歴 {worker.yearsExperience}年
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
              現場責任者経験: {worker.siteLeadExperience}
            </span>
          </div>
        </section>

        {profile ? (
          <>
            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">職務・経歴要約（個人情報なし）</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                {profile.resumeExcerpt}
              </p>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">社内での経歴</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700">
                {profile.internalCareerLines.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">資格・講習（詳細）</h2>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                {profile.qualificationDetails.map((q, idx) => (
                  <li key={idx}>・{q}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">過去の現場経験</h2>
              <ul className="mt-2 space-y-3">
                {profile.pastProjects.map((pp) => (
                  <li
                    key={pp.id}
                    className="border-b border-zinc-100 pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <p className="font-medium text-zinc-900">{pp.projectName}</p>
                    <p className="text-zinc-600">
                      {pp.period} ／ {pp.role}
                    </p>
                    {pp.wasSiteLead ? (
                      <span className="mt-1 inline-block rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-900">
                        現場責任者（または準ずる役割）
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            {profile.incidentNotes.length > 0 ? (
              <section className="rounded-lg border border-red-100 bg-red-50/80 p-4">
                <h2 className="font-semibold text-red-950">
                  現場トラブル・注意メモ（配員AI参照）
                </h2>
                <ul className="mt-3 space-y-4">
                  {profile.incidentNotes.map((note) => (
                    <li key={note.id} className="text-sm">
                      <p className="text-xs text-red-800">{note.recordedAt}</p>
                      <p className="mt-1 text-red-950">{note.summary}</p>
                      {note.aiDispatchHint ? (
                        <p className="mt-2 rounded-md bg-white/80 p-2 text-xs text-zinc-800">
                          <span className="font-semibold">AIヒント: </span>
                          {note.aiDispatchHint}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-zinc-500">詳細プロフィールは準備中です。</p>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="font-semibold">直近の配員履歴（デモ）</h2>
          <ul className="mt-2 space-y-2 text-sm text-zinc-700">
            {workerAssignments.map((item) => (
              <li key={item.id}>
                {item.date} / {item.shift} / AIスコア {item.aiScore ?? "-"}
              </li>
            ))}
          </ul>
        </section>

        <DemoDisclaimer variant="banner" context="data" />
      </div>
    </PageShell>
  );
}
