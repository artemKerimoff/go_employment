"use client";

import { useEffect, useState } from "react"

import { ListPage } from "@/components/list-page"
import { apiDelete, apiGet } from "@/lib/api"

type DismissalOrderRow = {
  id: number;
  number: string;
  preparationDate: string;
  organization?: string;
  organizationId?: number;
  organizationOkpo?: string;
};

type DismissalHeaderProto = {
  id: number;
  number?: string;
  preparation_date?: string;
  organization_id?: number;
  organization_title?: string;
};

type DismissalBodyProto = {
  id: number;
  employment_contract_id?: number;
  department_id?: number;
  position_id?: number;
  employee_name?: string;
  personnel_number?: string;
  department_title?: string;
  position_title?: string;
  dismissal_date?: string;
  dismissal_ground?: string;
  doc_number?: string;
  doc_date?: string;
  contract_number?: string;
  contract_date?: string;
};

type DismissalBodyRow = {
  employee: string;
  personnelNumber: string;
  department: string;
  position: string;
  contractNumber: string;
  contractDate: string;
  terminationDate: string;
  ground: string;
  doc: string;
};

type Org = { id: number; title: string; okpo?: string };

export default function DismissalOrdersPage() {
  const [rows, setRows] = useState<DismissalOrderRow[]>([]);
  const [orgs, setOrgs] = useState<Org[]>([]);

  useEffect(() => {
    Promise.all([
      apiGet<Array<DismissalHeaderProto>>("/api/dismissal-orders"),
      apiGet<Array<Org>>("/api/organizations"),
    ])
      .then(([orders, orgs]) => {
        const orgMap = new Map<number, Org>();
        (orgs ?? []).forEach((o) => orgMap.set(o.id, o));
        setOrgs(orgs ?? []);
        const mapped = (orders ?? []).map((h) => ({
          id: h.id,
          number: h.number ?? "",
          preparationDate: h.preparation_date ?? "",
          organization: h.organization_title ?? (h.organization_id ? orgMap.get(h.organization_id)?.title ?? "" : ""),
          organizationId: h.organization_id,
          organizationOkpo: h.organization_id ? orgMap.get(h.organization_id)?.okpo ?? "" : "",
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("Failed to load dismissal orders", err);
        setRows([]);
      });
  }, []);

  const buildPrintHtml = (order: DismissalOrderRow, bodyRows: DismissalBodyRow[]) => {
    const esc = (v: string | number | undefined) => (v === undefined || v === "" ? "—" : String(v));
    const rowsHtml = (bodyRows.length ? bodyRows : [{} as DismissalBodyRow]).map((r) => `
        <tr style="height:36px;">
          <td>${esc(r.employee)}</td>
          <td class="text-center">${esc(r.personnelNumber)}</td>
          <td>${esc(r.department)}</td>
          <td>${esc(r.position)}</td>
          <td class="text-center">${esc(r.contractNumber)}</td>
          <td class="text-center">${esc(r.contractDate)}</td>
          <td class="text-center">${esc(r.terminationDate)}</td>
          <td>${esc(r.ground)}</td>
          <td class="text-center">${esc(r.doc)}</td>
          <td class="text-center">—</td>
        </tr>
    `).join("\n");

    return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Печать приказа об увольнении</title>
  <style>
    body { margin: 0; padding: 36px 32px; font-family: "Times New Roman", Times, serif; color: #000; }
    .wrap { max-width: 1160px; margin: 0 auto; font-size: 12px; line-height: 1.35; }
    .okud { font-size: 11px; }
    .code-box { border: 1px solid #000; width: 140px; text-align: center; font-size: 11px; }
    .code-box .row { display: flex; border-top: 1px solid #000; }
    .code-box .cell { padding: 2px 4px; border-right: 1px solid #000; flex: 1; }
    .code-box .cell:last-child { border-right: none; width: 70px; flex: 0 0 70px; }
    .org-name { display: inline-block; min-width: 440px; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 12px; }
    .table { width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px; }
    .table th, .table td { border: 1px solid #000; padding: 6px 6px; vertical-align: top; }
    .table th { text-align: center; }
    .table .w16 { width: 16%; }
    .table .w10 { width: 10%; }
    .table .w14 { width: 14%; }
    .table .w12 { width: 12%; }
    .table .w8 { width: 8%; }
    .table .w6 { width: 6%; }
    .small { font-size: 10px; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 28px; font-size: 12px; }
    .sign-block { width: 48%; }
    .line { border-bottom: 1px solid #000; flex: 1; height: 0; }
    .muted { font-size: 10px; white-space: nowrap; }
    .flex { display: flex; align-items: center; gap: 6px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="okud" style="display:flex; justify-content:flex-end; margin-bottom:8px; text-align:right; gap:8px;">
      <div style="line-height:1.25;">
        <div>Унифицированная форма № Т-8а</div>
        <div>Утверждена Постановлением Госкомстата России</div>
        <div>от 05.01.2004 № 1</div>
      </div>
      <div class="code-box">
        <div style="padding:4px 0;">Код</div>
        <div class="row"><div class="cell">Форма по ОКУД</div><div class="cell">0301021</div></div>
        <div class="row"><div class="cell">по ОКПО</div><div class="cell">${esc(order.organizationOkpo)}</div></div>
      </div>
    </div>

    <div style="text-align:center; font-size:11px; margin-bottom:12px;">
      <div class="org-name">${esc(order.organization)}</div>
      <div class="muted" style="margin-top:2px;">(наименование организации)</div>
    </div>

    <div style="display:flex; justify-content:center; margin-bottom:16px; font-size:12px;">
      <table style="border-collapse:collapse; border:1px solid #000; text-align:center; min-width:340px;">
        <tr>
          <td style="border-right:1px solid #000; padding:6px 12px; min-width:170px;">Номер документа</td>
          <td style="padding:6px 12px; min-width:170px;">Дата составления</td>
        </tr>
        <tr>
          <td style="border-top:1px solid #000; border-right:1px solid #000; padding:8px 12px; font-weight:600;">${esc(order.number)}</td>
          <td style="border-top:1px solid #000; padding:8px 12px;">${esc(order.preparationDate)}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center; margin-bottom:10px; line-height:1.3;">
      <div style="font-size:14px; font-weight:700;">ПРИКАЗ</div>
      <div style="font-weight:600;">(распоряжение)</div>
      <div style="font-weight:600;">о прекращении (расторжении) трудового договора с работниками (увольнении)</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th class="w16" rowspan="2">Фамилия, имя, отчество</th>
          <th class="w8" rowspan="2">Табельный номер</th>
          <th class="w14" rowspan="2">Структурное подразделение</th>
          <th class="w14" rowspan="2">Должность (специальность, профессия), разряд, класс (категория) квалификации</th>
          <th class="w12" colspan="2">Трудовой договор</th>
          <th class="w10" rowspan="2">Дата прекращения (расторжения) трудового договора (увольнения)</th>
          <th class="w12" rowspan="2">Основание прекращения (расторжения) трудового договора (увольнения)</th>
          <th class="w8" rowspan="2">Документ, номер, дата</th>
          <th class="w6" rowspan="2">С приказом (распоряжением) работник ознакомлен. Личная подпись. Дата</th>
        </tr>
        <tr class="small">
          <th>номер</th>
          <th>дата его заключения</th>
        </tr>
        <tr class="small">
          <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <div class="sign-row">
      <div class="sign-block">
        <div style="margin-bottom:8px;">Руководитель организации</div>
        <div class="flex"><div class="line"></div><div class="muted">(должность)</div></div>
        <div class="flex" style="margin-top:8px;"><div class="line"></div><div class="muted">(личная подпись, расшифровка подписи)</div></div>
      </div>
      <div class="sign-block text-right">
        <div style="margin-bottom:8px;">С приказом ознакомлен</div>
        <div class="flex" style="justify-content:flex-end;"><div class="muted">(личная подпись работника, дата)</div><div class="line"></div></div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = async (row: DismissalOrderRow) => {
    const parseDate = (value: any) => {
      if (value === undefined || value === null || value === "") return "—";
      if (typeof value === "string" && value.includes("-")) return value;
      const num = typeof value === "number" ? value : (typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN);
      if (Number.isNaN(num)) return String(value);
      const ms = num > 1e12 ? num : num * 1000;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
    };

    try {
      const [header, bodies, contracts, individuals, departments, positions] = await Promise.all([
        apiGet<DismissalHeaderProto>(`/api/dismissal-orders/${row.id}`),
        apiGet<DismissalBodyProto[]>(`/api/dismissal-orders/bodies?header_id=${row.id}`),
        apiGet<any[]>(`/api/contracts`),
        apiGet<any[]>(`/api/individuals`),
        apiGet<any[]>(`/api/departments`),
        apiGet<any[]>(`/api/positions`),
      ]);

      const contractMap = new Map<number, any>();
      (contracts ?? []).forEach((c: any) => contractMap.set(c.id, c));
      const indivMap = new Map<number, any>();
      (individuals ?? []).forEach((i: any) => indivMap.set(i.id, i));
      const deptMap = new Map<number, any>();
      (departments ?? []).forEach((d: any) => deptMap.set(d.id, d));
      const posMap = new Map<number, any>();
      (positions ?? []).forEach((p: any) => posMap.set(p.id, p));

      const bodyRows: DismissalBodyRow[] = (bodies ?? []).map((b) => {
        const c = b.employment_contract_id ? contractMap.get(b.employment_contract_id) : undefined;
        const ind = c?.employee_id ? indivMap.get(c.employee_id) : undefined;
        const empName = b.employee_name
          ?? (ind ? [ind.last_name, ind.first_name, ind.patronymic].filter(Boolean).join(" ") : undefined)
          ?? c?.employee_name
          ?? "";

        const deptTitle = b.department_title
          ?? (b.department_id ? deptMap.get(b.department_id)?.title : undefined)
          ?? (c?.department_id ? deptMap.get(c.department_id)?.title : undefined)
          ?? c?.department_title
          ?? "";
        const posTitle = b.position_title
          ?? (b.position_id ? posMap.get(b.position_id)?.title : undefined)
          ?? (c?.position_id ? posMap.get(c.position_id)?.title : undefined)
          ?? c?.position_title
          ?? "";

        const contractNumber = b.contract_number ?? c?.number ?? "";
        const contractDate = parseDate(b.contract_date ?? c?.conclusion_date);

        const docCombined = [b.doc_number, parseDate(b.doc_date)].filter((v) => v && v !== "—").join(", ") || "—";

        return {
          employee: empName,
          personnelNumber: b.personnel_number ?? c?.personnel_number ?? "",
          department: deptTitle,
          position: posTitle,
          contractNumber,
          contractDate,
          terminationDate: parseDate(b.dismissal_date),
          ground: b.dismissal_ground ?? "",
          doc: docCombined,
        } as DismissalBodyRow;
      });

      const org = orgs.find((o) => o.id === (header?.organization_id ?? row.organizationId));

      const printable: DismissalOrderRow = {
        ...row,
        number: header?.number ?? row.number,
        preparationDate: header?.preparation_date ?? row.preparationDate,
        organization: header?.organization_title ?? row.organization ?? "",
        organizationId: header?.organization_id ?? row.organizationId,
        organizationOkpo: org?.okpo ?? row.organizationOkpo ?? "",
      };

      const html = buildPrintHtml(printable, bodyRows);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank", "noopener,noreferrer,width=1200,height=900");
      if (!win) {
        URL.revokeObjectURL(url);
        return;
      }
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Failed to prepare print", err);
    }
  };

  const handleDelete = async (row: DismissalOrderRow) => {
    try {
      await apiDelete(`/api/dismissal-orders/${row.id}`);
    } catch (err) {
      console.error("Failed to delete dismissal order", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <ListPage
      title="Приказы об увольнении"
      description="Список приказов (данные из header)"
      columns={[
        { key: "number", label: "Номер" },
        { key: "preparationDate", label: "Дата подготовки" },
        { key: "organization", label: "Организация" },
      ]}
      rows={rows}
      createHref="/dismissal-orders/new"
      actions={{
        showEdit: true,
        showDelete: true,
        showPrint: true,
        onPrint: (row) => { void handlePrint(row as DismissalOrderRow); },
        editHref: (row) => `/dismissal-orders/${row.id}/edit`,
        onDelete: (row) => handleDelete(row as DismissalOrderRow),
      }}
    />
  );
}
