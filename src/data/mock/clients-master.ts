export type MasterClientRow = {
  id: string;
  name: string;
  shortName: string;
  clientType: "general_contractor" | "dispatcher" | "direct" | "agent";
  contactPerson: string;
  email: string;
  phone: string;
  paymentTerms: string;
  projectCount: number;
  defaultReportTemplateName?: string;
  notes?: string;
};

export type MasterEndCustomerRow = {
  id: string;
  name: string;
  customerType: "individual" | "corporate";
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export const masterClients: MasterClientRow[] = [
  {
    id: "cli-ykk",
    name: "YKK AP株式会社",
    shortName: "YKK AP",
    clientType: "general_contractor",
    contactPerson: "田村 一郎",
    email: "tamura@example-ykk.jp",
    phone: "03-0000-1111",
    paymentTerms: "月末締め翌月末払い",
    projectCount: 23,
    defaultReportTemplateName: "週次報告（標準）",
    notes: "首都圏大型案件の元請パートナー",
  },
  {
    id: "cli-pasona",
    name: "パソナグループ",
    shortName: "パソナ",
    clientType: "dispatcher",
    contactPerson: "山田 裕子",
    email: "yamada@example-pasona.jp",
    phone: "06-2222-3333",
    paymentTerms: "翌月末",
    projectCount: 8,
    defaultReportTemplateName: "日報（標準）",
  },
  {
    id: "cli-direct",
    name: "自社直接受注",
    shortName: "自社元請",
    clientType: "direct",
    contactPerson: "—",
    email: "office@example.jp",
    phone: "011-000-0000",
    paymentTerms: "請求書発行後30日",
    projectCount: 5,
  },
];

export const masterEndCustomers: MasterEndCustomerRow[] = [
  {
    id: "ec-yamamoto",
    name: "山本様（個人）",
    customerType: "individual",
    address: "札幌市豊平区○○",
  },
  {
    id: "ec-suzuki-corp",
    name: "鈴木商事株式会社",
    customerType: "corporate",
    contactPerson: "鈴木 課長",
    email: "suzuki@example.jp",
    phone: "011-444-5555",
    address: "札幌市中央区○○",
  },
];

export const clientTypeLabel: Record<MasterClientRow["clientType"], string> = {
  general_contractor: "元請業者",
  dispatcher: "人材手配",
  direct: "直接受注",
  agent: "仲介・代理店",
};
