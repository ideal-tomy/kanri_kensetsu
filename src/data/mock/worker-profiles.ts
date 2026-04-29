import type { WorkerProfileDetail } from "@/types/domain";

/** 作業員IDごとの詳細プロフィール（デモデータ） */
export const workerProfiles: Record<string, WorkerProfileDetail> = {
  w1: {
    workerId: "w1",
    resumeExcerpt:
      "建具工事に従事14年。大型物件の現場代理人・職長を歴任。図面読解・搬入調整・引渡しまで一貫対応可能。",
    internalCareerLines: [
      "2018年〜 主任技術者補佐（社内認定）",
      "2022年〜 大型案件リード担当（大阪エリア）",
    ],
    qualificationDetails: [
      "建築施工管理技士（建築）（※デモ）",
      "職長教育修了",
      "玉掛け・クレーン合図（社内資格）",
    ],
    pastProjects: [
      {
        id: "pp-w1-1",
        projectName: "大阪駅前再開発A棟 建具工事",
        period: "2026-04〜",
        role: "職長（現場監督補佐）",
        wasSiteLead: true,
      },
      {
        id: "pp-w1-2",
        projectName: "京橋オフィスタワー改修",
        period: "2024-09〜2026-03",
        role: "一般担当 → サブリーダー",
        wasSiteLead: false,
      },
      {
        id: "pp-w1-3",
        projectName: "関西空港ラウンジ増築",
        period: "2022-05〜2024-08",
        role: "建具取付リーダー",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [
      {
        id: "inc-w1-1",
        recordedAt: "2025-11-12",
        summary:
          "上請け〇〇建設の佐藤氏との連絡チャネルで温度差。現場での口頭指示と書面指示の齟齬が発生（本人は協力的）。",
        aiDispatchHint:
          "同一現場での〇〇建設案件への同時派遣は確認ダイアログを推奨。別チーム編成なら問題なし（デモ）。",
      },
    ],
  },
  w2: {
    workerId: "w2",
    resumeExcerpt:
      "金属工事・補修を中心に9年。ショートスパンでの是正対応が得意。協力会社との調整経験あり。",
    internalCareerLines: ["2021年〜 補修チーム固定メンバー"],
    qualificationDetails: ["溶接技能講習修了（※デモ）", "足場組立て特別教育"],
    pastProjects: [
      {
        id: "pp-w2-1",
        projectName: "梅田商業ビル改修",
        period: "2026-03〜",
        role: "一般担当",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
  w3: {
    workerId: "w3",
    resumeExcerpt:
      "シャッター・電気錠まわりの調整と安全管理。危険予知実演の社内トレーナー経験。",
    internalCareerLines: ["2020年〜 安全衛生推進リーダー"],
    qualificationDetails: ["危険物取扱者（※デモ）", "特別教育（フォークリフト）"],
    pastProjects: [
      {
        id: "pp-w3-1",
        projectName: "神戸物流センター新築",
        period: "2026-02〜",
        role: "安全管理補佐",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
  w4: {
    workerId: "w4",
    resumeExcerpt:
      "写真記録・是正工程のドキュメント化。顧客立会い・引渡し記録の整備が得意。",
    internalCareerLines: ["2023年〜 品質記録標準化パイロット参加"],
    qualificationDetails: ["一種土木（※デモ表記のみ）"],
    pastProjects: [
      {
        id: "pp-w4-1",
        projectName: "大阪駅前再開発A棟 建具工事",
        period: "2026-01〜",
        role: "記録担当",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
  w5: {
    workerId: "w5",
    resumeExcerpt: "測量・建具取付の両方に対応。土日祝の突発対応可能。",
    internalCareerLines: ["契約社員（常駐パターン多数）"],
    qualificationDetails: ["測量実務講習"],
    pastProjects: [
      {
        id: "pp-w5-1",
        projectName: "京都オフィス棟リニューアル",
        period: "2026-05〜",
        role: "予備要員",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
  w6: {
    workerId: "w6",
    resumeExcerpt:
      "品質確認・検査立会い。仕上げ精度のチェックリスト整備を社内展開。",
    internalCareerLines: ["2019年〜 品質パトロール班"],
    qualificationDetails: ["建築士補（※デモ）", "色合わせ検定（社内）"],
    pastProjects: [
      {
        id: "pp-w6-1",
        projectName: "梅田商業ビル改修",
        period: "2026-02〜",
        role: "品質責任者補佐",
        wasSiteLead: true,
      },
    ],
    incidentNotes: [],
  },
  w7: {
    workerId: "w7",
    resumeExcerpt:
      "検査立会いと安全書類の整備。元請・監督との文書やりとりが丁寧。",
    internalCareerLines: ["2024年〜 書類標準フォーマット改訂メンバー"],
    qualificationDetails: ["安全衛生責任者（※デモ）"],
    pastProjects: [
      {
        id: "pp-w7-1",
        projectName: "神戸物流センター新築",
        period: "2025-11〜",
        role: "書類担当",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
  w8: {
    workerId: "w8",
    resumeExcerpt: "搬入ルート調整・補修作業。夜間施工の経験あり。",
    internalCareerLines: ["夜間班リーダー（2024年Q4）"],
    qualificationDetails: ["高所作業車運転技能講習"],
    pastProjects: [
      {
        id: "pp-w8-1",
        projectName: "大阪駅前再開発A棟 建具工事",
        period: "2025-12〜",
        role: "搬入調整",
        wasSiteLead: false,
      },
    ],
    incidentNotes: [],
  },
};
