import {
  parseWorkReportText,
  WORK_REPORT_SECTION_TITLES,
  type WorkReportSectionKey,
} from "@/lib/report/work-report-template";

const ORDER: WorkReportSectionKey[] = [
  "basic",
  "today",
  "notes",
  "photos",
  "tomorrow",
];

export function WorkReportPreview({
  siteName,
  rawText,
  photos,
}: {
  siteName: string;
  rawText: string;
  photos?: Array<{ label: string; imageUrl: string }>;
}) {
  const sections = parseWorkReportText(rawText, siteName);

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm print:border-0 print:shadow-none">
      <h2 className="border-b-2 border-primary pb-2 text-lg font-bold text-zinc-900">
        {sections.subject || `【作業報告】${siteName}`}
      </h2>
      <p className="mt-2 text-xs text-zinc-500">現場: {siteName}</p>

      {ORDER.map((key) => {
        if (key === "photos") {
          return (
            <section key={key} className="mt-5">
              <h3 className="border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900">
                {WORK_REPORT_SECTION_TITLES.photos}
              </h3>
              {photos && photos.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-3">
                  {photos.map((p) => (
                    <figure key={p.imageUrl + p.label} className="w-[140px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.imageUrl}
                        alt={p.label}
                        className="h-[90px] w-[140px] rounded-md border border-zinc-200 object-cover"
                      />
                      <figcaption className="mt-1 text-[11px] text-zinc-600">{p.label}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : sections.photos ? (
                <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
                  {sections.photos}
                </pre>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">（写真なし）</p>
              )}
            </section>
          );
        }

        const body = sections[key];
        if (!body.trim()) return null;
        return (
          <section key={key} className="mt-5">
            <h3 className="border-b border-zinc-200 pb-1 text-sm font-bold text-zinc-900">
              {WORK_REPORT_SECTION_TITLES[key]}
            </h3>
            <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
              {body}
            </pre>
          </section>
        );
      })}
    </article>
  );
}
