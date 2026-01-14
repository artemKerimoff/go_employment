"use client";

import { apiGet, apiPost } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

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

type Dept = { id: number; title: string };
type Pos = { id: number; title: string };

type DismissalHeaderCreate = {
  number?: string | null;
  preparation_date?: string | null;
  organization_id?: number | null;
};

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

type BodyRow = {
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

export default function DismissalOrderCreatePage() {
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
  const [contractBodies, setContractBodies] = useState<ContractBody[]>([]);
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet<Org[]>("/api/organizations").then((d) => setOrgOptions(d ?? [])).catch(() => setOrgOptions([]));
    const pContracts = apiGet<ContractProto[]>('/api/contracts');
    const pIndividuals = apiGet<Individual[]>('/api/individuals');
    const pDepts = apiGet<Dept[]>('/api/departments');
    const pPositions = apiGet<Pos[]>('/api/positions');
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
        setContractBodies(mapped);
      })
      .catch(() => setContractBodies([]));
  }, []);

  const contractOptions = useMemo(() => contractBodies, [contractBodies]);

  const fmt = (value: string | number | undefined) =>
    value === undefined || value === "" ? "—" : value;

  const handlePrint = () => {
    window.print();
  };

  const handleContractPick = (rowIndex: number, id: number) => {
    const selected = contractBodies.find((c) => c.id === id);
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
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== rowIndex)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const headerPayload: DismissalHeaderCreate = {
        number: header.number.trim() || null,
        preparation_date: header.preparationDate || null,
        organization_id: header.organizationId ?? null,
      };
      const created = (await apiPost("/api/dismissal-orders", headerPayload)) as { id: number };
      const headerId = created.id;

      for (const row of rows) {
        // skip empty rows
        const isEmpty = !row.contractBodyId && !row.dismissalDate && !row.dismissalGround && !row.docNumber && !row.docDate;
        if (isEmpty) continue;

        const contract = row.contractBodyId ? contractBodies.find((c) => c.id === row.contractBodyId) : undefined;
        const bodyPayload: DismissalBodySave = {
          dismissal_order_header_id: headerId,
          employment_contract_id: row.contractBodyId ?? null,
          department_id: contract?.departmentId ?? null,
          position_id: contract?.positionId ?? null,
          dismissal_date: row.dismissalDate || null,
          dismissal_ground: row.dismissalGround || null,
          doc_number: row.docNumber && /^\d+$/.test(row.docNumber) ? Number(row.docNumber) : null,
          doc_date: row.docDate || null,
        };
        await apiPost("/api/dismissal-orders/bodies", bodyPayload);
      }

      router.push("/dismissal-orders");
    } catch (err) {
      console.error("Failed to save dismissal order", err);
      alert("Не удалось сохранить приказ");
    } finally {
      setSaving(false);
    }
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
            <h1 className="text-3xl font-bold text-zinc-50">Создание приказа об увольнении</h1>
            <p className="text-zinc-400 mt-2 text-sm">Шапка + табличная часть, данные работника подтягиваются из договора.</p>
          </div>
          <Link
            href="/dismissal-orders"
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
                placeholder="DO-001"
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
              <p className="text-xs text-zinc-400 mt-1">Строка = один работник, данные можно подтянуть из договора и отредактировать.</p>
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
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Дата расторжения</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Основание</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">№ документа</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400">Дата документа</th>
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

        </section>

        <div className="flex items-center justify-end gap-3 no-print">
          <Link
            href="/dismissal-orders"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500"
          >
            Отменить
          </Link>
          <button
            type="button"
            className="rounded-lg border border-amber-500 bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-400"
            onClick={handlePrint}
          >
            Печать
          </button>
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
            <div className="text-xs text-gray-500">Приказ об увольнении (law_*_36)</div>
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
                <th className="border border-gray-300 px-2 py-1">Дата расторжения</th>
                <th className="border border-gray-300 px-2 py-1">Основание</th>
                <th className="border border-gray-300 px-2 py-1">№ документа</th>
                <th className="border border-gray-300 px-2 py-1">Дата документа</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.worker)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.department)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.position)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.dismissalDate)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.dismissalGround)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.docNumber)}</td>
                  <td className="border border-gray-300 px-2 py-1">{fmt(row.docDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-sm text-gray-700">Поля без заполнения помечаются знаком —.</div>
        </div>
      </div>
    </div>
  );
}
