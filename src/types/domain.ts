export type UserRole = "admin" | "field";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  affiliatedProjectIds: string[];
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface Worker {
  id: string;
  name: string;
  employmentType: "full_time" | "contract";
  skillTags: string[];
  status: "available" | "assigned" | "off";
  currentProjectId: string;
  /** 経験年数（一覧カードのタグ用） */
  yearsExperience: number;
  /** 現場責任者経験の要約（例: あり（3現場）・なし） */
  siteLeadExperience: string;
  /** 保有資格タグ（一覧で表示） */
  qualificationTags: string[];
  phone?: string;
  certifications?: string[];
  note?: string;
}

/** 作業員詳細の経歴・トラブル履歴など（デモ用・個人情報なし） */
export interface WorkerPastProject {
  id: string;
  projectName: string;
  period: string;
  role: string;
  wasSiteLead: boolean;
}

export interface WorkerIncidentNote {
  id: string;
  recordedAt: string;
  summary: string;
  /** 配員AIが参照する注意文 */
  aiDispatchHint?: string;
}

export interface WorkerProfileDetail {
  workerId: string;
  resumeExcerpt: string;
  internalCareerLines: string[];
  qualificationDetails: string[];
  pastProjects: WorkerPastProject[];
  incidentNotes: WorkerIncidentNote[];
}

export interface ContractorCompany {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  tradeType: string;
  activeProjectIds: string[];
  email?: string;
  evaluationScore?: number;
  memo?: string;
}

export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  siteAddress: string;
  clientName: string;
  status: "planning" | "active" | "follow_required" | "completed";
  startDate: string;
  endDate: string;
  progressPercent?: number;
  managerUserId?: string;
  contractorCompanyIds?: string[];
  riskFlags?: string[];
}

export interface Assignment {
  id: string;
  projectId: string;
  workerId: string;
  date: string;
  shift: "day" | "night";
  assignedBy: string;
  assignmentStatus: "planned" | "confirmed" | "changed";
  aiScore?: number;
  aiReason?: string;
  manualOverrideReason?: string;
}

export interface DispatchProgress {
  id: string;
  projectId: string;
  category: "material" | "personnel" | "safety";
  status: "todo" | "in_progress" | "done" | "follow_required";
  dueDate: string;
  ownerUserId?: string;
  note?: string;
}

export interface SafetyDocument {
  id: string;
  projectId: string;
  docType: string;
  requiredByDate: string;
  status: "missing" | "submitted" | "approved" | "rejected";
  fileUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ReportPhoto {
  id: string;
  projectId: string;
  uploadedByWorkerId: string;
  capturedAt: string;
  originalFileName: string;
  renamedFileName: string;
  storagePath: string;
  tags: string[];
  aiLabelSummary?: string;
  aiConfidence?: number;
  thumbnailUrl?: string;
}

export interface VoiceReport {
  id: string;
  projectId: string;
  workerId: string;
  recordedAt: string;
  rawTranscript: string;
  formattedDailyReport: string;
  durationSec?: number;
  keywords?: string[];
}

export interface Blueprint {
  id: string;
  projectId: string;
  title: string;
  revision: string;
  updatedAt: string;
  fileUrl: string;
  sheetNo?: string;
  discipline?: string;
  note?: string;
}

export interface DefectReport {
  id: string;
  projectId: string;
  reportedByWorkerId: string;
  reportedAt: string;
  severity: "low" | "medium" | "high";
  description: string;
  status: "open" | "investigating" | "resolved";
  photoIds?: string[];
  assigneeUserId?: string;
  resolutionNote?: string;
}

export interface AiLog {
  id: string;
  timestamp: string;
  type: "rename" | "assignment" | "detection" | "summary";
  message: string;
  relatedEntityType: string;
  relatedEntityId: string;
  meta?: Record<string, string | number>;
}

export interface AlertNotification {
  id: string;
  projectId: string;
  title: string;
  message: string;
  level: "info" | "warning" | "critical";
  createdAt: string;
  isRead: boolean;
  source?: "ai" | "manual";
  linkedDefectReportId?: string;
}

export interface RevenueForecast {
  id: string;
  projectId: string;
  month: string;
  forecastAmount: number;
  confidence: number;
  actualAmount?: number;
  note?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
  summary: string;
  body?: string;
  relatedProjectIds?: string[];
}
