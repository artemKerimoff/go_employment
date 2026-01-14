"use client";

import { apiGet, apiPost } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const getBaseUrl = () => process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";

type Org = { id: number; title: string };
type ContractBody = {
  id: number;
  worker: string;
  departmentId?: number;
  department?: string;
  positionId?: number;
  position?: string;
  salary?: number;
  workDateFrom?: string;
  workDateTo?: string;
  probationMonths?: number;
};

type BodyRow = {
  contractBodyId?: number;
  worker: string;
  department: string;
  position: string;
  salary: string;
  workDateFrom: string;
  workDateTo: string;
  probationMonths: string;
};

type HeaderState = {
  number: string;
  preparationDate: string;
  organizationId?: number;
};

export default function EmploymentOrderCreatePage() {
  const [header, setHeader] = useState<HeaderState>({
    number: "",
    preparationDate: "",
    organizationId: undefined,
  });
  const emptyRow = (): BodyRow => ({
    worker: "",
    department: "",
    position: "",
    salary: "",
    workDateFrom: "",
    workDateTo: "",
    probationMonths: "",
  });
  const [rows, setRows] = useState<BodyRow[]>([emptyRow()]);

  const [orgOptions, setOrgOptions] = useState<Org[]>([]);
  const [contractBodies, setContractBodies] = useState<ContractBody[]>([]);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const unixFromDate = (s?: string | null) => {
    if (!s) return 0;
    const t = Date.parse(s);
    if (Number.isNaN(t)) return 0;
    return Math.floor(t / 1000);
  };

  useEffect(() => {
    // load supporting lookups and contracts then map display values
    Promise.all([
      apiGet<any[]>(`/api/organizations`).catch(() => []),
      apiGet<any[]>(`/api/contracts`).catch(() => []),
      apiGet<any[]>(`/api/individuals`).catch(() => []),
      apiGet<any[]>(`/api/departments`).catch(() => []),
      apiGet<any[]>(`/api/positions`).catch(() => []),
    ])
      .then(([orgs, contracts, individuals, departments, positions]) => {
        setOrgOptions(orgs ?? []);
        const indivMap = new Map<number, any>();
        (individuals ?? []).forEach((i: any) => indivMap.set(i.id, i));
        const deptMap = new Map<number, any>();
        (departments ?? []).forEach((d: any) => deptMap.set(d.id, d));
        const posMap = new Map<number, any>();
        (positions ?? []).forEach((p: any) => posMap.set(p.id, p));

        const mapped = (contracts ?? []).map((c: any) => {
          const ind = indivMap.get(c.employee_id) || {};
          const worker = [ind.last_name, ind.first_name, ind.patronymic].filter(Boolean).join(" ") || (ind.full_name ?? ind.name ?? c.employee_name ?? "");
          const dept = deptMap.get(c.department_id);
          const pos = posMap.get(c.position_id);
          return {
            id: c.id,
            worker,
            departmentId: c.department_id ?? dept?.id,
            department: dept ? dept.title : (c.department_title ?? c.department_name ?? ""),
            positionId: c.position_id ?? pos?.id,
            position: pos ? pos.title : (c.position_title ?? ""),
            salary: c.salary ?? undefined,
            workDateFrom: c.work_date_from ?? undefined,
            workDateTo: c.work_date_to ?? undefined,
            probationMonths: c.probation_months ?? undefined,
          } as ContractBody;
        });
        setContractBodies(mapped);
      })
      .catch(() => {
        setOrgOptions([]);
        setContractBodies([]);
      });
  }, []);

  const contractOptions = useMemo(() => contractBodies, [contractBodies]);

  const fmt = (value: string | number | undefined) =>
    value === undefined || value === "" ? "—" : value;

  const handleSave = async () => {
    setSaving(true);
    try {
      // create header
      const headerPayload = {
        number: header.number.trim() || null,
        preparation_date: header.preparationDate || null,
        organization_id: header.organizationId ?? null,
      };
      const created = await apiPost<any>("/api/employment-orders", headerPayload as any);
      const headerId = (created && (created as any).id) ?? null;

      // create bodies for rows that have contract selected
      const createdFor = new Set<number>();
      for (const row of rows) {
        // skip rows without a selected contract
        if (!row.contractBodyId) continue;
        // avoid creating duplicate bodies for the same contract within this header
        if (createdFor.has(row.contractBodyId)) continue;
        const contract = contractBodies.find((c) => c.id === row.contractBodyId);
        const workFrom = row.workDateFrom || contract?.workDateFrom || "";
        const workTo = row.workDateTo || contract?.workDateTo || "";
        if (!workFrom) continue; // protect backend: date is required
        const bodyPayload = {
          employment_order_header_id: headerId,
          employment_contract_id: contract?.id ?? 0,
          department_id: contract?.departmentId ?? 0,
          position_id: contract?.positionId ?? 0,
          salary: row.salary ? Number(row.salary) : (contract?.salary ?? 0),
          work_date_from: workFrom,
          work_date_to: workTo,
          probation_months: row.probationMonths ? Number(row.probationMonths) : (contract?.probationMonths ?? 0),
        };
        await apiPost("/api/employment-orders/bodies", bodyPayload);
        if (row.contractBodyId) createdFor.add(row.contractBodyId);
      }

      router.push("/employment-orders");
    } catch (err) {
      console.error("Failed to save employment order", err);
      alert("Не удалось сохранить приказ");
    } finally {
      setSaving(false);
    }
  };

  const handleContractPick = (rowIndex: number, id: number) => {
    const selected = contractBodies.find((c) => c.id === id);
    if (!selected) return;
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              contractBodyId: selected.id,
              worker: selected.worker,
              department: selected.department ?? "",
              position: selected.position ?? "",
              salary: selected.salary ? String(selected.salary) : "",
              workDateFrom: selected.workDateFrom ?? "",
              workDateTo: selected.workDateTo ?? "",
              probationMonths: selected.probationMonths ? String(selected.probationMonths) : "",
            }
          : row,
      ),
    );
  };

  const handleRowChange = (
    rowIndex: number,
    field: keyof BodyRow,
    value: string,
  ) => {
    setRows((prev) =>
      prev.map((row, idx) => (idx === rowIndex ? { ...row, [field]: value } : row)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (rowIndex: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== rowIndex)));
  };

  return (
    <div className="flex min-h-screen bg-linear-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-8">
      <div className="w-full max-w-6xl space-y-8 mx-auto">
        <style jsx global>{`
          @media print {
            body { background: #fff; }
            .no-print { display: none !important; }
            .print-area { display: block !important; }
          }
          .print-area { display: none; }
        `}</style>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Создание приказа о приёме</h1>
            <p className="text-zinc-400 mt-2 text-sm">
              Сначала заполните шапку (header), затем табличную часть (body). При выборе работника данные строки заполняются автоматически.
            </p>
          </div>
          <Link
            href="/employment-orders"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-zinc-50">Шапка документа</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Номер документа</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={header.number}
                onChange={(e) => setHeader({ ...header, number: e.target.value })}
                placeholder="EO-001"
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Дата подготовки</span>
              <input
                type="date"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={header.preparationDate}
                onChange={(e) =>
                  setHeader({ ...header, preparationDate: e.target.value })
                }
              />
            </label>
            <label className="space-y-2 text-sm text-zinc-200 md:col-span-2 lg:col-span-3">
              <span>Организация</span>
              <select
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={header.organizationId ?? ""}
                onChange={(e) =>
                  setHeader({ ...header, organizationId: Number(e.target.value) })
                }
              >
                <option value="" disabled>
                  Выберите организацию
                </option>
                {orgOptions.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-zinc-50">Табличная часть</h2>
              <p className="text-xs text-zinc-400 mt-1">Выберите работника — подставим данные, остальное можно поправить вручную.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-500"
              onClick={addRow}
            >
              Добавить строку
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-zinc-900/70">
                <tr>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Работник</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Подразделение</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Должность</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Оклад</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Работа с</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Работа по</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Испыт. срок</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`hover:bg-zinc-800/40 transition-colors ${
                      idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/60"
                    }`}
                  >
                    <td className="px-3 py-3 text-zinc-100 align-top">
                      <select
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.contractBodyId ?? ""}
                        onChange={(e) => handleContractPick(idx, Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Выберите работника
                        </option>
                        {contractOptions.map((contract) => (
                          <option key={contract.id} value={contract.id}>
                            {contract.worker}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.department}
                        onChange={(e) => handleRowChange(idx, "department", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.position}
                        onChange={(e) => handleRowChange(idx, "position", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        type="number"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.salary}
                        onChange={(e) => handleRowChange(idx, "salary", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        type="date"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.workDateFrom}
                        onChange={(e) => handleRowChange(idx, "workDateFrom", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        type="date"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.workDateTo}
                        onChange={(e) => handleRowChange(idx, "workDateTo", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        type="number"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.probationMonths}
                        onChange={(e) => handleRowChange(idx, "probationMonths", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100 align-top">
                      <button
                        type="button"
                        className="rounded-md border border-red-500/60 px-3 py-1 text-xs text-red-200 hover:border-red-400 hover:text-red-100"
                        onClick={() => removeRow(idx)}
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>

        <div className="flex items-center justify-end gap-3 no-print">
          <Link
            href="/employment-orders"
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

        <div className="print-area bg-white text-black p-8 rounded-lg space-y-6">
          <div className="text-center space-y-1">
            <div className="text-xs text-gray-500">Приказ о приёме (law_*_31)</div>
            <div className="text-2xl font-semibold">№ {fmt(header.number)}</div>
            <div className="text-sm text-gray-600">Дата: {fmt(header.preparationDate)}</div>
            <div className="text-sm text-gray-600">Организация: {fmt(header.organizationId)}</div>
          </div>

          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1">Работник</th>
                <th className="border border-gray-300 px-2 py-1">Подразделение</th>
                <th className="border border-gray-300 px-2 py-1">Должность</th>
                <th className="border border-gray-300 px-2 py-1">Оклад</th>
                <th className="border border-gray-300 px-2 py-1">Работа с</th>
                <th className="border border-gray-300 px-2 py-1">Работа по</th>
                <th className="border border-gray-300 px-2 py-1">Испыт. срок</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.worker)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.department)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.position)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.salary)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.workDateFrom)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.workDateTo)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.probationMonths)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-gray-700">Поля без заполнения помечаются знаком "—".</div>
        </div>
      </div>
    </div>
  );
}
