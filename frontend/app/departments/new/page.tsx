"use client";

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { apiPost } from "@/lib/api"

type DepartmentForm = {
  title: string;
};

export default function DepartmentCreatePage() {
  const [form, setForm] = useState<DepartmentForm>({
    title: "",
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onChange = (key: keyof DepartmentForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/api/departments", { title: form.title.trim() });
      router.push("/departments");
    } catch (err) {
      console.error("Failed to create department", err);
      setSaving(false);
      alert("Не удалось сохранить отдел");
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-4xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Создание отдела</h1>
            <p className="text-zinc-400 mt-2 text-sm">Ввод наименования отдела.</p>
          </div>
          <Link href="/departments" className="text-sm text-emerald-400 hover:text-emerald-300">
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
              placeholder="Отдел продаж"
            />
          </label>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/departments" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500">
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
