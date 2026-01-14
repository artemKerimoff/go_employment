"use client";

import { apiGet, apiPatch, apiPost } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// loaded options
// orgOptionsLocal and contractOptionsLocal are loaded on mount
// keep these in React state so updates cause re-render


type BodyRow = {
  bodyId?: number;
  contractBodyId?: number;
  departmentId?: number;
  positionId?: number;
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

export default function EmploymentOrderEditPage() {
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
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [orgOptionsLocal, setOrgOptionsLocal] = useState<{ id: number; title: string }[]>([]);
  const [contractOptionsLocal, setContractOptionsLocal] = useState<any[]>([]);

  const toIsoDate = (v: unknown) => {
    if (v === null || v === undefined || v === "") return "";
    if (typeof v === "string") {
      // already looks like YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
      const t = Date.parse(v);
      return Number.isNaN(t) ? "" : new Date(t).toISOString().slice(0, 10);
    }
    if (typeof v === "number") {
      const d = new Date(v > 1e12 ? v : v * 1000);
      return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
    }
    return "";
  };

  useEffect(() => {
    const id = params?.id;
    if (!id) return;
    apiGet<any>(`/api/employment-orders/${id}`)
      .then((h: any) => {
        if (!h) return;
        setHeader({
          number: h.number ?? "",
          preparationDate: h.preparation_date ?? "",
          organizationId: h.organization_id ?? undefined,
        });
      })
      .catch((e) => console.error("Failed to load header", e));

    // fetch lookups to resolve contracts -> employee/department/position display
    Promise.all([
      apiGet<any[]>(`/api/contracts`).catch(() => []),
      apiGet<any[]>(`/api/individuals`).catch(() => []),
      apiGet<any[]>(`/api/departments`).catch(() => []),
      apiGet<any[]>(`/api/positions`).catch(() => []),
    ])
      .then(([contracts, individuals, departments, positions]) => {
        const indivMap = new Map<number, any>();
        (individuals ?? []).forEach((i: any) => indivMap.set(i.id, i));
        const deptMap = new Map<number, any>();
        (departments ?? []).forEach((d: any) => deptMap.set(d.id, d));
        const posMap = new Map<number, any>();
        (positions ?? []).forEach((p: any) => posMap.set(p.id, p));
        // ensure contractOptionsLocal is set
        setContractOptionsLocal((contracts ?? []).map((c: any) => ({
          id: c.id,
          worker: (indivMap.get(c.employee_id) ? [indivMap.get(c.employee_id).last_name, indivMap.get(c.employee_id).first_name, indivMap.get(c.employee_id).patronymic].filter(Boolean).join(' ') : (c.employee_name ?? '')),
          departmentId: c.department_id,
          department: (deptMap.get(c.department_id)?.title) ?? c.department_title ?? c.department_name ?? "",
          positionId: c.position_id,
          position: (posMap.get(c.position_id)?.title) ?? c.position_title ?? "",
          salary: c.salary ?? 0,
          workDateFrom: toIsoDate(c.work_date_from),
          workDateTo: toIsoDate(c.work_date_to),
          probationMonths: c.probation_months ?? 0,
        })));

        // now load bodies and map via contracts map
        apiGet<any[]>(`/api/employment-orders/bodies?header_id=${id}`)
          .then((b: any[]) => {
            if (!b) return;
            const contractById = new Map<number, any>();
            (contracts ?? []).forEach((c: any) => contractById.set(c.id, c));
            // deduplicate by employment_contract_id to avoid duplicate rows
            const seen = new Set<number>();
            const mapped = b
              .filter((row) => {
                if (!row.employment_contract_id) return true;
                if (seen.has(row.employment_contract_id)) return false;
                seen.add(row.employment_contract_id);
                return true;
              })
              .map((row) => {
                const c = contractById.get(row.employment_contract_id) || {};
                const ind = indivMap.get(c.employee_id) || {};
                return {
                  bodyId: row.id,
                  contractBodyId: row.employment_contract_id ?? undefined,
                  departmentId: row.department_id ?? c.department_id,
                  positionId: row.position_id ?? c.position_id,
                  worker: [ind.last_name, ind.first_name, ind.patronymic].filter(Boolean).join(" ") || (ind.full_name ?? ind.name ?? c.employee_name ?? ""),
                  department: deptMap.get(c.department_id)?.title ?? c.department_title ?? c.department_name ?? "",
                  position: posMap.get(c.position_id)?.title ?? c.position_title ?? "",
                  salary: row.salary ? String(row.salary) : (c.salary ? String(c.salary) : ""),
                  workDateFrom: toIsoDate(row.work_date_from ?? c.work_date_from),
                  workDateTo: toIsoDate(row.work_date_to ?? c.work_date_to),
                  probationMonths: row.probation_months ? String(row.probation_months) : (c.probation_months ? String(c.probation_months) : ""),
                } as BodyRow;
              });
            setRows(mapped.length ? mapped : [emptyRow()]);
          })
          .catch((e) => console.error("Failed to load bodies", e));
      })
      .catch((e) => console.error("Failed to load lookups", e));

    apiGet<any[]>(`/api/organizations`).then((d) => setOrgOptionsLocal((d ?? []).map((o: any) => ({ id: o.id, title: o.title })))).catch(() => setOrgOptionsLocal([]));
  }, [params?.id]);

  const contractOptions = useMemo(() => contractOptionsLocal, [contractOptionsLocal]);

  const handleContractPick = (rowIndex: number, id: number) => {
    const selected = contractOptionsLocal.find((c) => c.id === id);
    if (!selected) return;
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              contractBodyId: selected.id,
              worker: selected.worker,
              department: selected.department,
              position: selected.position,
              salary: String(selected.salary),
              workDateFrom: selected.workDateFrom,
              workDateTo: selected.workDateTo,
              probationMonths: String(selected.probationMonths),
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        number: header.number.trim() || null,
        preparation_date: header.preparationDate || null,
        organization_id: header.organizationId ?? null,
      };
      await apiPatch(`/api/employment-orders/${params?.id}`, payload as any);
      // Update/create bodies
      // Prevent creating duplicate bodies for the same contract when saving edits
      const existingContractIds = new Set<number>();
      for (const r of rows) {
        if (r.contractBodyId) existingContractIds.add(r.contractBodyId);
      }
      const createdFor = new Set<number>();
      for (const row of rows) {
        if (!row.worker && !row.contractBodyId) continue;
        const contract = contractOptionsLocal.find((c) => c.id === row.contractBodyId);
        const workFrom = toIsoDate(row.workDateFrom || contract?.workDateFrom || "");
        const workTo = toIsoDate(row.workDateTo || contract?.workDateTo || "");
        if (!workFrom) continue; // skip invalid row
        const bodyPayload = {
          employment_order_header_id: Number(params?.id),
          employment_contract_id: row.contractBodyId ?? 0,
          department_id: row.departmentId ?? contract?.departmentId ?? 0,
          position_id: row.positionId ?? contract?.positionId ?? 0,
          salary: row.salary ? Number(row.salary) : (contract?.salary ?? 0),
          work_date_from: workFrom,
          work_date_to: workTo,
          probation_months: row.probationMonths ? Number(row.probationMonths) : (contract?.probationMonths ?? 0),
        };
        if (row.bodyId) {
          await apiPatch(`/api/employment-orders/bodies/${row.bodyId}`, bodyPayload as any).catch((e) => console.error(e));
        } else {
          // if we've already created a body for this contract in this save cycle, skip
          if (row.contractBodyId && createdFor.has(row.contractBodyId)) continue;
          await apiPost(`/api/employment-orders/bodies`, bodyPayload as any).catch((e: any) => console.error(e));
          if (row.contractBodyId) createdFor.add(row.contractBodyId);
        }
      }
      router.push("/employment-orders");
    } catch (err) {
      console.error("Failed to update employment order", err);
      alert("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 p-8">
      <div className="w-full max-w-6xl space-y-6 mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">Редактирование приказа о приёме</h1>
            <p className="text-zinc-400 mt-2">Загружаю данные приказа, при сохранении изменения отправляются на сервер.</p>
          </div>
          <Link
            href="/employment-orders"
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            ← К списку
          </Link>
        </div>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-zinc-50">Шапка документа</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4">
            <label className="space-y-2 text-sm text-zinc-200">
              <span>Номер документа</span>
              <input
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                value={header.number}
                onChange={(e) => setHeader({ ...header, number: e.target.value })}
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
                {orgOptionsLocal.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-50">Табличная часть</h2>
            <p className="text-xs text-zinc-400">Выберите работника в строке — поля заполнятся автоматически</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-800">
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
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/60"}>
                    <td className="px-3 py-3 text-zinc-100 align-top">
                      <select
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.contractBodyId ?? ""}
                        onChange={(e) => handleContractPick(idx, Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Выберите работника
                        </option>
                        {/* If the current selected contract is not present in options (edge cases), show it as first option */}
                        {row.contractBodyId && !contractOptionsLocal.find((c) => c.id === row.contractBodyId) ? (
                          <option key={`sel-${row.contractBodyId}`} value={row.contractBodyId}>
                            {row.worker || `#${row.contractBodyId}`}
                          </option>
                        ) : null}
                        {contractOptions.map((contract) => (
                          <option key={contract.id} value={contract.id}>
                            {contract.worker || `#${contract.id}`}
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

          <button
            type="button"
            className="mt-3 inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-500"
            onClick={addRow}
          >
            Добавить строку
          </button>
        </section>

        <div className="flex items-center justify-end gap-3">
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
      </div>
    </div>
  );
}
