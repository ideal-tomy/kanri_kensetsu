"use client";

import { useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COPY } from "@/lib/copy";

type DemoAccount = {
  companyCode: string;
  name: string;
  role: "worker" | "supervisor" | "admin" | "owner";
  label: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [companyCode, setCompanyCode] = useState("YMD35");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [accounts, setAccounts] = useState<DemoAccount[]>([]);

  useEffect(() => {
    fetch("/api/auth/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data.accounts ?? []))
      .catch(() => setAccounts([]));
  }, []);

  const submit = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyCode, name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? "うまくいかなかった");
      return;
    }
    setMessage(`${data.user.name}さん、入れました`);
    router.push(data.target ?? "/");
  };

  const loginWith = async (account: DemoAccount) => {
    setCompanyCode(account.companyCode);
    setName(account.name);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ companyCode: account.companyCode, name: account.name }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.message ?? "うまくいかなかった");
      return;
    }
    setMessage(`${data.user.name}さん、入れました`);
    router.push(data.target ?? "/");
  };

  return (
    <main className="mx-auto min-h-screen max-w-md bg-zinc-100 p-4">
      <section className="mt-10 rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">{COPY.auth.login_title}</h1>
        <label className="mt-4 block text-sm font-semibold">
          {COPY.auth.company_code_label}
          <input
            value={companyCode}
            onChange={(e) => setCompanyCode(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold">
          {COPY.auth.name_label}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3"
          />
        </label>
        <button
          type="button"
          onClick={submit}
          className="mt-4 min-h-[60px] w-full rounded-xl bg-orange-500 px-4 text-lg font-bold text-white"
        >
          {COPY.auth.login_button}
        </button>
        <section className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="text-sm font-bold text-zinc-800">仮アカウント（画面確認用）</p>
          <div className="mt-2 space-y-2">
            {accounts.map((account) => (
              <button
                key={`${account.companyCode}-${account.name}`}
                type="button"
                onClick={() => void loginWith(account)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-left text-sm"
              >
                {account.label}：{account.name}（{account.role}）でログイン
              </button>
            ))}
          </div>
        </section>
        <p className="mt-3 text-sm font-semibold text-zinc-700">{message}</p>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-zinc-700 underline">
          ホームへ
        </Link>
      </section>
    </main>
  );
}
