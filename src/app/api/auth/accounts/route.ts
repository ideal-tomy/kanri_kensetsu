import { NextResponse } from "next/server";
import { demoAccounts } from "@/lib/prototype-store";

export async function GET() {
  return NextResponse.json({ accounts: demoAccounts });
}
