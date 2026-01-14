"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiGet, apiPatch } from "@/lib/api";

type OrgForm = {
  title: string;
  address: string;
  okpo: string;
  inn: string;
  kpp: string;
  accountId: string;
};



type Account = { id: string | number; number: string };

export default function OrganizationEditPage() {
  const [form, setForm] = useState<OrgForm>({
    title: "",
    address: "",
    okpo: "",
    inn: "",
    kpp: "",
    accountId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
    fetch(`${baseUrl}/api/accounts`)
      .then((res) => res.json())
      .then((data) => setAccounts(data ?? []))
      .catch(() => setAccounts([]));
  }, [params?.id]);

  useEffect(() => {
    if (!params?.id) return;
    apiGet<any>(`/api/organizations/${params.id}`)
      .then((data) => {
        setForm({
          title: data?.title ?? "",
          address: data?.address ?? "",
          okpo: data?.okpo ?? "",
          inn: data?.inn ?? "",
          kpp: data?.kpp ?? "",
          accountId: data?.account_id !== undefined && data?.account_id !== null ? String(data.account_id) : "",
        });
      })
      .catch((err) => console.error("Failed to load organization", err))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const onChange = (key: keyof OrgForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!params?.id) return;
    setSaving(true);
    try {
      await apiPatch(`/api/organizations/${params.id}`, {
        title: form.title.trim(),
        address: form.address.trim(),
        okpo: form.okpo.trim(),
        inn: form.inn.trim(),
        kpp: form.kpp.trim(),
        accountId: form.accountId || null,
      });
      router.push("/organizations");
    } catch (err) {
      console.error("Failed to update organization", err);
      setSaving(false);
      alert("Не удалось сохранить организацию");
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-5xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Редактирование организации</h1>
            <p className="text-zinc-400 mt-2 text-sm">Измените реквизиты: наименование, адрес, ОКПО и ИНН/КПП.</p>
          </div>
          <Link
            href="/organizations"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Наименование</h2>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>Полное наименование</span>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder='ООО "Пример"'
            />
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Реквизиты</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>ИНН</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.inn}
                onChange={(e) => onChange("inn", e.target.value)}
                placeholder="7701234567"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>КПП</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.kpp}
                onChange={(e) => onChange("kpp", e.target.value)}
                placeholder="770101001"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>ОКПО</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.okpo}
                onChange={(e) => onChange("okpo", e.target.value)}
                placeholder="12345678"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>Адрес</span>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              value={form.address}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="г. Москва, ул. Примерная, д.1"
            />
          </label>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>Расчетный счет</span>
            <select
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              value={form.accountId}
              onChange={(e) => onChange("accountId", e.target.value)}
            >
              <option value="" disabled>
                Выберите счет
              </option>
              {accounts.map((item) => (
                <option key={item.id} value={item.id}>{item.number}</option>
              ))}
            </select>
          </label>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/organizations"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            Отменить
          </Link>
          <button
            type="button"
            className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
