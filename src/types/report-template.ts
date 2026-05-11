/**
 * 報告書テンプレ fields の JSON 仕様（実装指示書 §1.4）
 */
export type ReportField =
  | { key: string; label: string; type: "text"; required?: boolean; auto_fill?: string }
  | { key: string; label: string; type: "textarea"; required?: boolean }
  | { key: string; label: string; type: "date"; required?: boolean }
  | { key: string; label: string; type: "select"; options: string[] }
  | { key: string; label: string; type: "photo_list"; max?: number; auto_source?: string }
  | { key: string; label: string; type: "auto_aggregate"; source: string }
  | { key: string; label: string; type: "personnel_table" }
  | { key: string; label: string; type: "task_list"; filter?: "completed" | "all" };

export type ReportTemplateRecord = {
  id: string;
  company_id: string;
  name: string;
  category: string | null;
  description: string | null;
  fields: ReportField[];
  layout_html: string | null;
  base_file_url: string | null;
  default_recipient_client_id: string | null;
  default_recipient_emails: string[] | null;
  submission_schedule: string | null;
  submission_day: string | null;
  submission_time: string | null;
  is_active: boolean;
};
