"use client";

import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Org = { id: number; title: string };
type ContractBody = { id: number; worker: string; department?: string; position?: string; departmentId?: number; positionId?: number };
type ContractProto = {
  id: number;
  number?: string;
  last_name?: string;
  first_name?: string;
  patronymic?: string;
  employee_id?: number;
  employee_name?: string;
  department_title?: string;
  position_title?: string;
  department_id?: number;
  position_id?: number;
};

type Individual = { id: number; first_name?: string; last_name?: string; patronymic?: string };

type DismissalBodySave = {
  dismissal_order_header_id: number;
  employment_contract_id?: number | null;
  department_id?: number | null;
  position_id?: number | null;
  dismissal_date?: string | null;
  dismissal_ground?: string | null;
  doc_number?: number | null;
  doc_date?: string | null;
};
type DismissalBodyProto = {
  id: number;
  employment_contract_id?: number;
  employee_name?: string;
  department_title?: string;
  department_id?: number;
  position_title?: string;
  position_id?: number;
  dismissal_date?: string;
  dismissal_ground?: string;
  doc_number?: string;
  doc_date?: string;
};
type DismissalHeaderProto = {
  id: number;
  number?: string;
  preparation_date?: string;
  organization_id?: number;
  organization_title?: string;
};

type BodyRow = {
  id?: number;
  contractBodyId?: number;
  worker: string;
  department: string;
  position: string;
  dismissalDate: string;
  dismissalGround: string;
  docNumber: string;
  docDate: string;
};

type HeaderState = {
  number: string;
  preparationDate: string;
  organizationId?: number;
};

// loads header and bodies from the BFF

export default function DismissalOrderEditPage() {
  const [header, setHeader] = useState<HeaderState>({
    number: "",
    preparationDate: "",
    organizationId: undefined,
  });

  const emptyRow = (): BodyRow => ({
    worker: "",
    department: "",
    position: "",
    dismissalDate: "",
    dismissalGround: "",
    docNumber: "",
    docDate: "",
  });

  const [rows, setRows] = useState<BodyRow[]>([emptyRow()]);
  const [orgOptions, setOrgOptions] = useState<Org[]>([]);
  const [contractOptions, setContractOptions] = useState<ContractBody[]>([]);
  const [deletedBodyIds, setDeletedBodyIds] = useState<number[]>([]);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<Org[]>("/api/organizations").then((d) => setOrgOptions(d ?? [])).catch(() => setOrgOptions([]));
    // load contracts, individuals, departments and positions and map titles
    const pContracts = apiGet<ContractProto[]>('/api/contracts');
    const pIndividuals = apiGet<Individual[]>('/api/individuals');
    const pDepts = apiGet<{ id: number; title: string }[]>('/api/departments');
    const pPositions = apiGet<{ id: number; title: string }[]>('/api/positions');
    Promise.all([pContracts, pIndividuals, pDepts, pPositions])
      .then(([contracts = [], individuals = [], depts = [], positions = []]) => {
        const byId = new Map<number, Individual>();
        for (const ind of individuals) byId.set(ind.id, ind);
        const deptMap = new Map<number, string>();
        for (const d of depts) deptMap.set(d.id, d.title);
        const posMap = new Map<number, string>();
        for (const p of positions) posMap.set(p.id, p.title);

        const mapped = (contracts ?? []).map((c) => {
          const ind = c.employee_id ? byId.get(c.employee_id) : null;
          const name = ind
            ? [ind.last_name, ind.first_name, ind.patronymic].filter(Boolean).join(' ')
            : (c.employee_name ?? c.number ?? `#${c.id}`);
          const department = c.department_title ?? (c.department_id ? deptMap.get(c.department_id) : undefined);
          const position = c.position_title ?? (c.position_id ? posMap.get(c.position_id) : undefined);
          return {
            id: c.id,
            worker: name,
            department,
            position,
            departmentId: c.department_id,
            positionId: c.position_id,
          };
        });
        setContractOptions(mapped);
        // if editing, also load bodies and map department/position titles
        if (params?.id) {
          apiGet<DismissalBodyProto[]>(`/api/dismissal-orders/bodies?header_id=${params.id}`)
            .then((bodies) => {
              if (!bodies || bodies.length === 0) return setRows([emptyRow()]);
              const mappedBodies = bodies.map((b) => ({
                id: b.id,
                contractBodyId: b.employment_contract_id ?? undefined,
                worker: b.employee_name ?? "",
                department: b.department_title ?? (b.department_id ? deptMap.get(b.department_id) ?? "" : ""),
                position: b.position_title ?? (b.position_id ? posMap.get(b.position_id) ?? "" : ""),
                dismissalDate: b.dismissal_date ?? "",
                dismissalGround: b.dismissal_ground ?? "",
                docNumber: b.doc_number ?? "",
                docDate: b.doc_date ?? "",
              }));
              setRows(mappedBodies);
            })
            .catch(() => setRows([emptyRow()]));
        }
      })
      .catch(() => setContractOptions([]));
    // load header + bodies
    if (!params?.id) return;
    apiGet<DismissalHeaderProto>(`/api/dismissal-orders/${params.id}`)
      .then((h) => {
        setHeader({
          number: h?.number ?? "",
          preparationDate: h?.preparation_date ?? "",
          organizationId: h?.organization_id ?? undefined,
        });
      })
      .catch(() => {});
  }, [params?.id]);

  const handleContractPick = (rowIndex: number, id: number) => {
    const selected = contractOptions.find((c) => c.id === id);
    if (!selected) return;
    setRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex
          ? {
              ...row,
              contractBodyId: selected.id,
              worker: selected.worker,
              department: selected.department ?? "",
              position: selected.position ?? "",
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
    setRows((prev) => {
      if (prev.length === 1) return prev;
      const removed = prev[rowIndex];
      if (removed?.id) setDeletedBodyIds((s) => [...s, removed.id as number]);
      return prev.filter((_, idx) => idx !== rowIndex);
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        number: header.number.trim() || null,
        preparation_date: header.preparationDate || null,
        organization_id: header.organizationId ?? null,
      };
      await apiPatch(`/api/dismissal-orders/${params?.id}`, payload);
      // delete removed bodies
      for (const id of deletedBodyIds) {
        try {
          await apiDelete(`/api/dismissal-orders/bodies/${id}`);
        } catch (err) {
          console.warn("Failed to delete body", id, err);
        }
      }
      // upsert bodies
      for (const row of rows) {
        const isEmpty = !row.contractBodyId && !row.dismissalDate && !row.dismissalGround && !row.docNumber && !row.docDate;
        if (isEmpty) continue;
        const contract = row.contractBodyId ? contractOptions.find((c) => c.id === row.contractBodyId) : undefined;
        const bodyPayload = {
          dismissal_order_header_id: Number(params?.id),
          employment_contract_id: row.contractBodyId ?? null,
          department_id: contract?.departmentId ?? null,
          position_id: contract?.positionId ?? null,
          dismissal_date: row.dismissalDate || null,
          dismissal_ground: row.dismissalGround || null,
          doc_number: row.docNumber && /^\d+$/.test(row.docNumber) ? Number(row.docNumber) : null,
          doc_date: row.docDate || null,
        };
        if (row.id) {
          await apiPatch(`/api/dismissal-orders/bodies/${row.id}`, bodyPayload as DismissalBodySave);
        } else {
          await apiPost(`/api/dismissal-orders/bodies`, bodyPayload as DismissalBodySave);
        }
      }
      router.push("/dismissal-orders");
    } catch (err) {
      console.error("Failed to update dismissal order", err);
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
            <h1 className="text-3xl font-bold text-zinc-50">Редактирование приказа об увольнении</h1>
            <p className="text-zinc-400 mt-2">Данные заглушка — подключите API для загрузки/сохранения.</p>
          </div>
          <Link
            href="/dismissal-orders"
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
                {orgOptions.map((org) => (
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
            <p className="text-xs text-zinc-400">Строки расширяются — один работник = одна строка</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-zinc-900/70">
                <tr>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Работник</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Подразделение</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Должность</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Дата расторжения</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Основание</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">№ документа</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Дата документа</th>
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
                        {row.contractBodyId && !contractOptions.find((c) => c.id === row.contractBodyId) && (
                          <option value={row.contractBodyId}>{row.worker || `#${row.contractBodyId}`}</option>
                        )}
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
                        type="date"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.dismissalDate}
                        onChange={(e) => handleRowChange(idx, "dismissalDate", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.dismissalGround}
                        onChange={(e) => handleRowChange(idx, "dismissalGround", e.target.value)}
                        placeholder="Основание"
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.docNumber}
                        onChange={(e) => handleRowChange(idx, "docNumber", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-3 text-zinc-100">
                      <input
                        type="date"
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
                        value={row.docDate}
                        onChange={(e) => handleRowChange(idx, "docDate", e.target.value)}
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
            href="/dismissal-orders"
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
