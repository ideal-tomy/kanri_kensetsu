import { redirect } from "next/navigation";
import { getDefaultPathForRole, getSessionFromCookies } from "@/lib/auth/session";

export default async function RootPage() {
  const user = await getSessionFromCookies();
  if (!user) {
    redirect("/login");
  }
  redirect(getDefaultPathForRole(user.role));
}
