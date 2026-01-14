"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { apiGet, apiPatch } from "@/lib/api";

type PositionForm = {
  title: string;
};

export default function PositionEditPage() {
  const [form, setForm] = useState<PositionForm>({ title: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!params?.id) return;
    apiGet<PositionForm>(`/api/positions/${params.id}`)
      .then((data) => setForm(data ?? { title: "" }))
      .catch((err) => console.error("Failed to load position", err))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const onChange = (key: keyof PositionForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!params?.id) return;
    setSaving(true);
    try {
      await apiPatch(`/api/positions/${params.id}`, { title: form.title.trim() });
      router.push("/positions");
    } catch (err) {
      console.error("Failed to update position", err);
      setSaving(false);
      alert("Не удалось сохранить должность");
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-4xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Редактирование должности</h1>
            <p className="text-zinc-400 mt-2 text-sm">Измените наименование должности.</p>
          </div>
          <Link href="/positions" className="text-sm text-emerald-400 hover:text-emerald-300">
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Основное</h2>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>Наименование</span>
            <input
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Менеджер"
            />
          </label>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/positions" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500">
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
