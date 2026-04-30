import type { AttendanceRecord } from "@/types/domain";

/** 当日分の勤怠デモ（w1 松本 / p1） */
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "att1",
    workerId: "w1",
    projectId: "p1",
    date: "2026-04-29",
    clockIn: "07:42",
    clockOut: undefined,
    breakMin: 60,
  },
  {
    id: "att2",
    workerId: "w4",
    projectId: "p1",
    date: "2026-04-29",
    clockIn: "08:01",
    clockOut: "17:05",
    breakMin: 60,
  },
];
