import type { User } from "@/types/domain";

export const users: User[] = [
  {
    id: "u1",
    name: "冨井 良治",
    email: "ryojitomii@gmail.com",
    role: "admin",
    affiliatedProjectIds: ["p1", "p2", "p3"],
    lastLoginAt: "2026-04-29T07:30:00+09:00",
  },
  {
    id: "u2",
    name: "現場 太郎",
    email: "field@example.com",
    role: "field",
    affiliatedProjectIds: ["p1"],
  },
];
