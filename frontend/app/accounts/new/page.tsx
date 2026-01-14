"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { apiPost } from "@/lib/api";

type AccountForm = {
  number: string;
  bank: string;
  bic: string;
};

export default function AccountCreatePage() {
  const [form, setForm] = useState<AccountForm>({
    number: "",
    bank: "",
    bic: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onChange = (key: keyof AccountForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/api/accounts", {
        number: form.number.trim(),
        bank: form.bank.trim(),
        bic: form.bic.trim(),
      });
      router.push("/accounts");
    } catch (err) {
      console.error("Failed to create account", err);
      setSaving(false);
      alert("Не удалось сохранить счёт");
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-4xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Создание счёта</h1>
            <p className="text-zinc-400 mt-2 text-sm">Номер, банк и БИК расчётного счёта.</p>
          </div>
          <Link href="/accounts" className="text-sm text-emerald-400 hover:text-emerald-300">
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Реквизиты счета</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Номер счета</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.number}
                onChange={(e) => onChange("number", e.target.value)}
                placeholder="4070xxxxxxxxxxxxxx"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Банк</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.bank}
                onChange={(e) => onChange("bank", e.target.value)}
                placeholder="ПАО Банк"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>БИК</span>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              value={form.bic}
              onChange={(e) => onChange("bic", e.target.value)}
              placeholder="044525225"
            />
          </label>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/accounts" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500">
            Отменить
          </Link>
          <button
            type="button"
            className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
