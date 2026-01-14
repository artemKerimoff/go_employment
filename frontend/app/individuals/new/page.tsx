"use client";

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { apiPost } from "@/lib/api"

type IndividualForm = {
  lastName: string;
  firstName: string;
  patronymic: string;
  registrationAddress: string;
  passportSeries: string;
  passportNumber: string;
  passportIssuedDate: string;
  passportIssuedBy: string;
  passportDepartmentCode: string;
  isAuthorizedRepresentative: boolean;
};

export default function IndividualCreatePage() {
  const [form, setForm] = useState<IndividualForm>({
    lastName: "",
    firstName: "",
    patronymic: "",
    registrationAddress: "",
    passportSeries: "",
    passportNumber: "",
    passportIssuedDate: "",
    passportIssuedBy: "",
    passportDepartmentCode: "",
    isAuthorizedRepresentative: false,
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onChange = (key: keyof IndividualForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPost("/api/individuals", {
        last_name: form.lastName.trim(),
        first_name: form.firstName.trim(),
        patronymic: form.patronymic.trim(),
        registration_address: form.registrationAddress.trim(),
        passport_series: form.passportSeries.trim(),
        passport_number: form.passportNumber.trim(),
        passport_issued_date: form.passportIssuedDate,
        passport_issued_by: form.passportIssuedBy.trim(),
        passport_issued_department_code: form.passportDepartmentCode.trim(),
        is_authorized_representative: form.isAuthorizedRepresentative,
      });
      router.push("/individuals");
    } catch (err) {
      console.error("Failed to create individual", err);
      setSaving(false);
      alert("Не удалось сохранить сотрудника");
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-5xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Создание сотрудника</h1>
            <p className="text-zinc-400 mt-2 text-sm">ФИО, адрес регистрации и паспортные данные.</p>
          </div>
          <Link href="/individuals" className="text-sm text-emerald-400 hover:text-emerald-300">
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-50">Основное</h2>
              <p className="text-xs text-zinc-400">Используем в договорах и приказах.</p>
            </div>
            <label className="flex items-center gap-2 text-sm text-zinc-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-emerald-500"
                checked={form.isAuthorizedRepresentative}
                onChange={(e) => onChange("isAuthorizedRepresentative", e.target.checked)}
              />
              <span>Уполномоченный представитель</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Фамилия</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.lastName}
                onChange={(e) => onChange("lastName", e.target.value)}
                placeholder="Иванов"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Имя</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.firstName}
                onChange={(e) => onChange("firstName", e.target.value)}
                placeholder="Иван"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Отчество (если есть)</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.patronymic}
                onChange={(e) => onChange("patronymic", e.target.value)}
                placeholder="Иванович"
              />
            </label>
          </div>
          <label className="space-y-2 text-sm text-zinc-200">
            <span>Адрес регистрации</span>
            <textarea
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
              rows={3}
              value={form.registrationAddress}
              onChange={(e) => onChange("registrationAddress", e.target.value)}
              placeholder="г. Москва, ул. Примерная, д.5"
            />
          </label>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Паспорт</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Серия</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.passportSeries}
                onChange={(e) => onChange("passportSeries", e.target.value)}
                placeholder="4510"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Номер</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.passportNumber}
                onChange={(e) => onChange("passportNumber", e.target.value)}
                placeholder="123456"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Код подразделения</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.passportDepartmentCode}
                onChange={(e) => onChange("passportDepartmentCode", e.target.value)}
                placeholder="770-001"
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Дата выдачи</span>
              <input
                type="date"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.passportIssuedDate}
                onChange={(e) => onChange("passportIssuedDate", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Кем выдан</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.passportIssuedBy}
                onChange={(e) => onChange("passportIssuedBy", e.target.value)}
                placeholder="УФМС России по г. Москве"
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link href="/individuals" className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500">
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
