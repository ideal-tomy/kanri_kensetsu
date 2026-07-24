export type WorkReportSectionKey =
  | "subject"
  | "basic"
  | "today"
  | "notes"
  | "photos"
  | "tomorrow";

export type WorkReportSections = Record<WorkReportSectionKey, string>;

const SECTION_HEADERS: Array<{ key: WorkReportSectionKey; match: RegExp; title: string }> = [
  { key: "basic", match: /■\s*基本情報/, title: "基本情報" },
  { key: "today", match: /■\s*本日の作業内容/, title: "本日の作業内容" },
  { key: "notes", match: /■\s*特記事項/, title: "特記事項・補修箇所・注意点" },
  { key: "photos", match: /■\s*作業写真/, title: "作業写真（添付）" },
  { key: "tomorrow", match: /■\s*明日/, title: "明日（次回）の作業予定" },
];

export const WORK_REPORT_SECTION_TITLES: Record<WorkReportSectionKey, string> = {
  subject: "件名",
  basic: "基本情報",
  today: "本日の作業内容",
  notes: "特記事項・補修箇所・注意点",
  photos: "作業写真（添付）",
  tomorrow: "明日（次回）の作業予定",
};

export function parseWorkReportText(rawText: string, siteName: string): WorkReportSections {
  const text = rawText.trim();
  const empty: WorkReportSections = {
    subject: "",
    basic: "",
    today: "",
    notes: "",
    photos: "",
    tomorrow: "",
  };

  if (!text) {
    empty.subject = `【作業報告】${siteName}`;
    return empty;
  }

  const subjectMatch = text.match(/^件名[：:]\s*(.+)$/m);
  empty.subject = subjectMatch?.[1]?.trim() || `【作業報告】${siteName}`;

  const hasSections = SECTION_HEADERS.some((h) => h.match.test(text));
  if (!hasSections) {
    empty.today = text;
    return empty;
  }

  const indices: Array<{ key: WorkReportSectionKey; index: number }> = [];
  for (const h of SECTION_HEADERS) {
    const m = text.match(h.match);
    if (m && m.index != null) {
      indices.push({ key: h.key, index: m.index });
    }
  }
  indices.sort((a, b) => a.index - b.index);

  for (let i = 0; i < indices.length; i++) {
    const cur = indices[i];
    const next = indices[i + 1];
    const chunk = text.slice(cur.index, next?.index ?? text.length);
    const body = chunk.replace(/^■[^\n]*\n?/, "").trim();
    empty[cur.key] = body;
  }

  return empty;
}

export function buildWorkReportHtml(params: {
  siteName: string;
  rawText: string;
  photos?: Array<{ label: string; imageUrl: string }>;
}): string {
  const sections = parseWorkReportText(params.rawText, params.siteName);
  const photoBlock =
    params.photos && params.photos.length > 0
      ? params.photos
          .map(
            (p) =>
              `<figure style="margin:0 8px 8px 0;display:inline-block;width:140px;vertical-align:top;">
<img src="${p.imageUrl}" alt="${escapeHtml(p.label)}" style="width:140px;height:90px;object-fit:cover;border:1px solid #e4e4e7;border-radius:6px;" />
<figcaption style="font-size:11px;color:#52525b;margin-top:4px;">${escapeHtml(p.label)}</figcaption>
</figure>`,
          )
          .join("")
      : escapeHtml(sections.photos).replace(/\n/g, "<br/>");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body{font-family:system-ui,sans-serif;padding:28px;color:#18181b;background:#fff;max-width:720px;margin:0 auto;}
h1{font-size:18px;border-bottom:2px solid #ea580c;padding-bottom:10px;margin:0 0 16px;}
h2{font-size:14px;margin:20px 0 8px;padding-bottom:4px;border-bottom:1px solid #e4e4e7;}
.section{font-size:13px;line-height:1.6;white-space:pre-wrap;}
.meta{font-size:12px;color:#71717a;margin-bottom:12px;}
</style></head>
<body>
<h1>${escapeHtml(sections.subject)}</h1>
<p class="meta">現場: ${escapeHtml(params.siteName)}</p>
${sectionHtml("基本情報", sections.basic)}
${sectionHtml("本日の作業内容", sections.today)}
${sectionHtml("特記事項・補修箇所・注意点", sections.notes)}
<h2>作業写真（添付）</h2>
<div class="section">${photoBlock || "（写真なし）"}</div>
${sectionHtml("明日（次回）の作業予定", sections.tomorrow)}
</body></html>`;
}

function sectionHtml(title: string, body: string): string {
  if (!body.trim()) return "";
  return `<h2>${escapeHtml(title)}</h2><div class="section">${escapeHtml(body)}</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** デモ用サンプル文（監督画面の初期入力にも使える） */
export const SAMPLE_WORK_REPORT_TEXT = `件名：【作業報告】〇〇ビル 外壁作業（〇月〇日分）

■ 基本情報
・報告日  ：202X年〇月〇日（〇）
・作業場所 ：〇〇ビル（住所：東京都〇〇区〇〇 1-2-3）
・作業箇所 ：[例：東側外壁 3F〜5F部分 / 屋上パラペット 周辺]
・作業時間 ：00:00 〜 00:00（うち準備・片付け 00分）
・天候・風速：晴れ / 風速 0.0m/s（安全基準内）
・作業員数 ：〇名（現場責任者：〇〇 〇〇）
・工法/足場 ：[例：ブランコ工法（ロープアクセス） / 高所作業車 / 仮設足場]

---

■ 本日の作業内容
1. 〇〇工法による外壁打診調査・打診箇所のマーキング
2. 〇〇箇所のシーリング（打替・増打）作業（約〇〇m）
3. ひび割れ（クラック）補修・エポキシ樹脂注入（〇箇所）
4. 作業完了後の自主点検および周辺清掃

---

■ 特記事項・補修箇所・注意点
・[例] 4階東側窓枠右上の打診にて、一部浮き（約30cm四方）を確認。マーキングを施し次回補修予定。
・[例] 施工中、第3者への飛散・落下物事故等は発生しておりません。

---

■ 作業写真（添付）
[写真1] 作業前状況（全体の状況）
[写真2] 施工中（シーリング撤去・充填作業等）
[写真3] 施工後・完了状況
[写真4] 危険箇所・指示事項（確認された変状箇所など）

---

■ 明日（次回）の作業予定
・作業日時：202X年〇月〇日（〇） 00:00〜00:00
・作業内容：[例：北面外壁のシーリング充填および清掃作業]
・現場責任者連絡先：090-XXXX-XXXX（〇〇）`;
