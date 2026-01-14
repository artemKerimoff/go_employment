"use client";

import { apiPost } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const getBaseUrl = () => process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";

type Organization = { id: number; title: string };
type Individual = { id: number; name: string };
type Department = { id: number; title: string };
type Position = { id: number; title: string };
type Condition = { id: number; label: string };

const defaultConditions: Condition[] = [
  { id: 1, label: "Обычные условия" },
  { id: 2, label: "Вредные условия" },
  { id: 3, label: "Особые условия" },
];

type ContractForm = {
  number: string;
  personnelNumber: string;
  conclusionDate: string;
  organizationId?: number;
  representativeId?: number;
  employeeId?: number;
  departmentId?: number;
  positionId?: number;
  conditionsClass?: number;
  workDateFrom: string;
  workDateTo: string;
  probationMonths: string;
  salary: string;
  workHoursFrom: string;
  workHoursTo: string;
  breakFrom: string;
  breakTo: string;
  paidLeaveDays: string;
};

export default function ContractCreatePage() {
  const [form, setForm] = useState<ContractForm>({
    number: "",
    personnelNumber: "",
    conclusionDate: "",
    organizationId: undefined,
    representativeId: undefined,
    employeeId: undefined,
    departmentId: undefined,
    positionId: undefined,
    conditionsClass: undefined,
    workDateFrom: "",
    workDateTo: "",
    probationMonths: "",
    salary: "",
    workHoursFrom: "09:00",
    workHoursTo: "18:00",
    breakFrom: "13:00",
    breakTo: "14:00",
    paidLeaveDays: "28",
  });

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [representatives, setRepresentatives] = useState<Individual[]>([]);
  const [employees, setEmployees] = useState<Individual[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [conditions, setConditions] = useState<Condition[]>(defaultConditions);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const baseUrl = getBaseUrl();
    fetch(`${baseUrl}/api/organizations`).then((r) => r.json()).then((d) => setOrganizations(d ?? [])).catch(() => setOrganizations([]));
    fetch(`${baseUrl}/api/individuals`).then((r) => r.json()).then((d) => {
      const list = d ?? [];
      // map to {id, name}
      const mapped = list.map((it: any) => ({ id: it.id, name: [it.last_name, it.first_name, it.patronymic].filter(Boolean).join(' ') }));
      setEmployees(mapped);
      setRepresentatives(mapped.filter((it: any) => {
        // find original by id to check is_authorized_representative
        const orig = list.find((x: any) => x.id === it.id);
        return orig?.is_authorized_representative;
      }));
    }).catch(() => {
      setRepresentatives([]);
      setEmployees([]);
    });
    fetch(`${baseUrl}/api/departments`).then((r) => r.json()).then((d) => setDepartments(d ?? [])).catch(() => setDepartments([]));
    fetch(`${baseUrl}/api/positions`).then((r) => r.json()).then((d) => setPositions(d ?? [])).catch(() => setPositions([]));
  }, []);

  const onChange = (key: keyof ContractForm, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const payload = {
      number: form.number.trim(),
      personnel_number: form.personnelNumber.trim(),
      conclusion_date: form.conclusionDate || null,
      organization_id: form.organizationId ?? null,
      representative_id: form.representativeId ?? null,
      employee_id: form.employeeId ?? null,
      department_id: form.departmentId ?? null,
      position_id: form.positionId ?? null,
      conditions_class: form.conditionsClass ?? null,
      work_date_from: form.workDateFrom || null,
      work_date_to: form.workDateTo || null,
      probation_months: form.probationMonths ? Number(form.probationMonths) : null,
      salary: form.salary ? Number(form.salary) : null,
      work_hours_from: form.workHoursFrom || null,
      work_hours_to: form.workHoursTo || null,
      break_from: form.breakFrom || null,
      break_to: form.breakTo || null,
      paid_leave_days: form.paidLeaveDays ? Number(form.paidLeaveDays) : null,
    };

    setSaving(true);
    try {
      await apiPost("/api/contracts", payload);
      router.push("/contracts");
    } catch (err) {
      console.error("Failed to create contract", err);
      alert("Не удалось сохранить договор");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-6xl space-y-8 mx-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Создание трудового договора</h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Заполните реквизиты договора, участников, условия работы и график. Поля можно скорректировать вручную.
            </p>
          </div>
          <Link
            href="/contracts"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Реквизиты договора</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Номер договора</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.number}
                onChange={(e) => onChange("number", e.target.value)}
                placeholder="TD-001"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Табельный номер</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.personnelNumber}
                onChange={(e) => onChange("personnelNumber", e.target.value)}
                placeholder="12345"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Дата заключения</span>
              <input
                type="date"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.conclusionDate}
                onChange={(e) => onChange("conclusionDate", e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Участники</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200 md:col-span-2 lg:col-span-3">
              <span>Организация</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.organizationId ?? ""}
                onChange={(e) => onChange("organizationId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите организацию
                </option>
                {organizations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Представитель организации</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.representativeId ?? ""}
                onChange={(e) => onChange("representativeId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите представителя
                </option>
                {representatives.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Работник</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.employeeId ?? ""}
                onChange={(e) => onChange("employeeId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите работника
                </option>
                {employees.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Назначение и условия</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Подразделение</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.departmentId ?? ""}
                onChange={(e) => onChange("departmentId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите подразделение
                </option>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Должность</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.positionId ?? ""}
                onChange={(e) => onChange("positionId", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите должность
                </option>
                {positions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Оклад</span>
              <input
                type="number"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.salary}
                onChange={(e) => onChange("salary", e.target.value)}
                placeholder="120000"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Класс условий труда</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.conditionsClass ?? ""}
                onChange={(e) => onChange("conditionsClass", Number(e.target.value))}
              >
                <option value="" disabled>
                  Выберите класс
                </option>
                {conditions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Дата начала работы</span>
              <input
                type="date"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.workDateFrom}
                onChange={(e) => onChange("workDateFrom", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Работа по (если срочный договор)</span>
              <input
                type="date"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.workDateTo}
                onChange={(e) => onChange("workDateTo", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Испытательный срок (мес.)</span>
              <input
                type="number"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.probationMonths}
                onChange={(e) => onChange("probationMonths", e.target.value)}
                placeholder="0"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Оплачиваемый отпуск (дн.)</span>
              <input
                type="number"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.paidLeaveDays}
                onChange={(e) => onChange("paidLeaveDays", e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">График работы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Рабочее время с</span>
              <input
                type="time"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.workHoursFrom}
                onChange={(e) => onChange("workHoursFrom", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Рабочее время до</span>
              <input
                type="time"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.workHoursTo}
                onChange={(e) => onChange("workHoursTo", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Перерыв с</span>
              <input
                type="time"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.breakFrom}
                onChange={(e) => onChange("breakFrom", e.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Перерыв до</span>
              <input
                type="time"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={form.breakTo}
                onChange={(e) => onChange("breakTo", e.target.value)}
              />
            </label>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/contracts"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            Отменить
          </Link>
          <button
            type="button"
            className="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500"
            onClick={handleSave}
            disabled={saving}
            aria-busy={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}
