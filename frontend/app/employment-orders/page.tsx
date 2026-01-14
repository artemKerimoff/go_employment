"use client";

import { useEffect, useState } from "react";

import { ListPage } from "@/components/list-page";
import { apiDelete, apiGet } from "@/lib/api";

type EmploymentOrderRow = {
  id: number;
  number: string;
  preparationDate: string;
  organizationId?: number;
  organization: string;
  organizationOkpo?: string;
  employee: string;
  personnelNumber: string;
  department: string;
  position: string;
  salary: string;
  workDateFrom: string;
  workDateTo: string;
  contractNumber: string;
  contractDate: string;
  probationMonths: string;
};

type EmploymentBodyRow = {
  employee: string;
  personnelNumber: string;
  department: string;
  position: string;
  salary: string;
  contractNumber: string;
  contractDate: string;
  workDateFrom: string;
  workDateTo: string;
  probationMonths: string;
};

export default function EmploymentOrdersPage() {
  const [rows, setRows] = useState<EmploymentOrderRow[]>([]);
  const [printRow, setPrintRow] = useState<EmploymentOrderRow | null>(null);
  const [orgs, setOrgs] = useState<Array<{ id: number; title: string; okpo?: string }>>([]);

  useEffect(() => {
    // Load orders and organizations to show readable organization titles
    Promise.all([apiGet<any[]>("/api/employment-orders"), apiGet<any[]>("/api/organizations")])
      .then(([orders, orgsData]) => {
        const orgMap = new Map<number, any>();
        (orgsData ?? []).forEach((o: any) => orgMap.set(o.id, o));
        setOrgs(orgsData ?? []);
        const mapped: EmploymentOrderRow[] = (orders ?? []).map((o: any) => ({
          id: o.id,
          number: o.number ?? "",
          preparationDate: o.preparation_date ?? "",
          organizationId: o.organization_id ?? undefined,
          organization: orgMap.get(o.organization_id)?.title ?? "",
          organizationOkpo: orgMap.get(o.organization_id)?.okpo ?? "",
          employee: o.employee_name ?? "",
          personnelNumber: o.personnel_number ?? "",
          department: o.department_title ?? "",
          position: o.position_title ?? "",
          salary: o.salary ? String(o.salary) : "",
          workDateFrom: o.work_date_from ?? "",
          workDateTo: o.work_date_to ?? "",
          contractNumber: o.contract_number ?? "",
          contractDate: o.contract_date ?? "",
          probationMonths: o.probation_months ? String(o.probation_months) : "",
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("Failed to load employment orders", err);
        setRows([]);
      });
  }, []);

  const fmt = (value: string | number | undefined) =>
    value === undefined || value === "" ? "—" : value;

  const printable = printRow ?? rows[0] ?? ({} as EmploymentOrderRow);

  const buildPrintHtml = (order: EmploymentOrderRow, bodyRows: EmploymentBodyRow[]) => {
    const esc = (v: string | number | undefined) => (v === undefined || v === "" ? "—" : String(v));
    const rowsHtml = (bodyRows.length ? bodyRows : [{} as EmploymentBodyRow]).map((r) => `
        <tr style="height:38px;">
          <td>${esc(r.employee)}</td>
          <td class="text-right">${esc(r.personnelNumber)}</td>
          <td>${esc(r.department)}</td>
          <td>${esc(r.position)}</td>
          <td class="text-right">${esc(r.salary)}</td>
          <td class="text-center">${esc(r.contractNumber)}</td>
          <td class="text-center">${esc(r.contractDate)}</td>
          <td class="text-center">${esc(r.workDateFrom)}</td>
          <td class="text-center">${esc(r.workDateTo)}</td>
          <td class="text-center">${esc(r.probationMonths)}</td>
          <td class="text-center">—</td>
        </tr>
    `).join("\n");
    return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Печать приказа о приёме</title>
  <style>
    body { margin: 0; padding: 40px; font-family: "Times New Roman", Times, serif; color: #000; }
    .wrap { max-width: 1120px; margin: 0 auto; font-size: 12px; line-height: 1.35; }
    .okud { font-size: 11px; }
    .code-box { border: 1px solid #000; width: 140px; text-align: center; font-size: 11px; }
    .code-box .row { display: flex; border-top: 1px solid #000; }
    .code-box .cell { padding: 2px 4px; border-right: 1px solid #000; flex: 1; }
    .code-box .cell:last-child { border-right: none; width: 70px; flex: 0 0 70px; }
    .org-name { display: inline-block; min-width: 420px; border-bottom: 1px solid #000; padding-bottom: 2px; font-size: 12px; }
    .table { width: 100%; border-collapse: collapse; border: 1px solid #000; font-size: 11px; }
    .table th, .table td { border: 1px solid #000; padding: 6px 6px; vertical-align: top; }
    .table th { text-align: center; }
    .table .narrow { width: 8%; }
    .table .wide { width: 16%; }
    .table .w18 { width: 18%; }
    .table .w10 { width: 10%; }
    .table .w12 { width: 12%; }
    .table .w6 { width: 6%; }
    .table .w14 { width: 14%; }
    .table .w10p { width: 10%; }
    .small { font-size: 10px; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 28px; font-size: 12px; }
    .sign-block { width: 48%; }
    .line { border-bottom: 1px solid #000; flex: 1; height: 0; }
    .muted { font-size: 10px; white-space: nowrap; }
    .flex { display: flex; align-items: center; gap: 6px; }
    .text-right { text-align: right; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="okud" style="display:flex; justify-content:flex-end; margin-bottom:8px; text-align:right; gap:8px;">
      <div style="line-height:1.25;">
        <div>Унифицированная форма № Т-1а</div>
        <div>Утверждена Постановлением Госкомстата России</div>
        <div>от 05.01.2004 № 1</div>
      </div>
      <div class="code-box">
        <div style="padding:4px 0;">Код</div>
        <div class="row"><div class="cell">Форма по ОКУД</div><div class="cell">0301015</div></div>
        <div class="row"><div class="cell">по ОКПО</div><div class="cell">${esc(order.organizationOkpo)}</div></div>
      </div>
    </div>

    <div style="text-align:center; font-size:11px;">
      <div class="org-name">${esc(order.organization)}</div>
      <div class="muted" style="margin-top:2px;">(наименование организации)</div>
    </div>

    <div style="display:flex; justify-content:center; margin-top:20px; margin-bottom:16px; font-size:12px;">
      <table style="border-collapse:collapse; border:1px solid #000; text-align:center; min-width:320px;">
        <tr>
          <td style="border-right:1px solid #000; padding:6px 12px; min-width:160px;">Номер документа</td>
          <td style="padding:6px 12px; min-width:160px;">Дата составления</td>
        </tr>
        <tr>
          <td style="border-top:1px solid #000; border-right:1px solid #000; padding:8px 12px; font-weight:600;">${esc(order.number)}</td>
          <td style="border-top:1px solid #000; padding:8px 12px;">${esc(order.preparationDate)}</td>
        </tr>
      </table>
    </div>

    <div style="text-align:center; margin-bottom:16px; line-height:1.25;">
      <div style="font-size:13px; font-weight:700;">ПРИКАЗ</div>
      <div style="font-weight:600;">(распоряжение)</div>
      <div style="font-weight:600;">о приеме работников на работу</div>
    </div>

    <div style="font-size:13px; font-weight:600; margin-bottom:8px;">Принять на работу:</div>

    <table class="table">
      <thead>
        <tr>
          <th class="wide" rowspan="2">Фамилия, имя, отчество</th>
          <th class="narrow" rowspan="2">Табельный номер</th>
          <th class="w12" rowspan="2">Структурное подразделение</th>
          <th class="w18" rowspan="2">Должность (специальность, профессия), разряд, класс (категория) квалификации</th>
          <th class="w10" rowspan="2">Тарифная ставка (оклад), надбавка, руб.</th>
          <th class="w14" colspan="2">Основание: трудовой договор</th>
          <th class="w10p" colspan="2">Период работы</th>
          <th class="w6" rowspan="2">Испытание на срок, месяцев</th>
          <th class="w6" rowspan="2">С приказом (распоряжением) работник ознакомлен. Личная подпись. Дата</th>
        </tr>
        <tr class="small">
          <th>номер</th>
          <th>дата</th>
          <th>с</th>
          <th>по</th>
        </tr>
        <tr class="small">
          <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th>
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
      </div>
      <div class="sign-block text-right">
        <div style="margin-bottom:8px;">С приказом ознакомлен</div>
        <div class="flex" style="justify-content:flex-end;"><div class="muted">(личная подпись)</div><div class="line"></div><div class="muted">(расшифровка подписи)</div></div>
      </div>
    </div>
    <div style="margin-top:16px; text-align:right;">
      <button onclick="window.print()" style="padding:6px 12px; font-size:12px;">Печать</button>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrint = async (row: EmploymentOrderRow) => {
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
        apiGet<any>(`/api/employment-orders/${row.id}`),
        apiGet<any[]>(`/api/employment-orders/bodies?header_id=${row.id}`),
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

      const bodyRows: EmploymentBodyRow[] = (bodies ?? []).map((b: any) => {
        const c = contractMap.get(b.employment_contract_id);
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
        return {
          employee: empName,
          personnelNumber: b.personnel_number ?? c?.personnel_number ?? "",
          department: deptTitle,
          position: posTitle,
          salary: b.salary ? String(b.salary) : (c?.salary ? String(c.salary) : ""),
          contractNumber: b.contract_number ?? c?.number ?? "",
          contractDate: parseDate(b.contract_date ?? c?.conclusion_date),
          workDateFrom: parseDate(b.work_date_from ?? c?.work_date_from),
          workDateTo: parseDate(b.work_date_to ?? c?.work_date_to),
          probationMonths: b.probation_months ? String(b.probation_months) : (c?.probation_months ? String(c.probation_months) : ""),
        } as EmploymentBodyRow;
      });

      const org = orgs.find((o) => o.id === (header?.organization_id ?? row.organizationId));

      const printableData: EmploymentOrderRow = {
        ...row,
        number: header?.number ?? row.number,
        preparationDate: header?.preparation_date ?? row.preparationDate,
        organization: header?.organization_title ?? row.organization,
        organizationId: header?.organization_id ?? row.organizationId,
        organizationOkpo: org?.okpo ?? row.organizationOkpo ?? "",
        // fallback values in case нет строк
        employee: bodyRows[0]?.employee ?? row.employee,
        personnelNumber: bodyRows[0]?.personnelNumber ?? row.personnelNumber,
        department: bodyRows[0]?.department ?? row.department,
        position: bodyRows[0]?.position ?? row.position,
        salary: bodyRows[0]?.salary ?? row.salary,
        workDateFrom: bodyRows[0]?.workDateFrom ?? parseDate(row.workDateFrom),
        workDateTo: bodyRows[0]?.workDateTo ?? parseDate(row.workDateTo),
        contractNumber: bodyRows[0]?.contractNumber ?? row.contractNumber,
        contractDate: bodyRows[0]?.contractDate ?? parseDate(row.contractDate),
        probationMonths: bodyRows[0]?.probationMonths ?? row.probationMonths,
      };

      const html = buildPrintHtml(printableData, bodyRows);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank", "noopener,noreferrer,width=1200,height=900");
      if (!win) {
        URL.revokeObjectURL(url);
        return;
      }
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Failed to open print window", err);
    }
  };

  const handleDelete = async (row: EmploymentOrderRow) => {
    try {
      await apiDelete(`/api/employment-orders/${row.id}`);
    } catch (err) {
      console.error("Failed to delete employment order", err);
    }
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  };

  return (
    <div className="relative">
      <div className="no-print">
        <ListPage
          title="Приказы о приёме"
          description="Список приказов (данные из header)"
          columns={[
            { key: "number", label: "Номер" },
            { key: "preparationDate", label: "Дата подготовки" },
            { key: "organization", label: "Организация" },
          ]}
          rows={rows}
          createHref="/employment-orders/new"
          actions={{
            showEdit: true,
            showDelete: true,
            showPrint: true,
            onPrint: (row) => { void handlePrint(row as EmploymentOrderRow); },
            editHref: (row) => `/employment-orders/${row.id}/edit`,
            onDelete: (row) => handleDelete(row as EmploymentOrderRow),
          }}
        />
      </div>

      <style jsx global>{`
        @media print {
          body { background: #fff; }
          .no-print { display: none !important; }
          .print-area { display: block !important; }
        }
        .print-area { display: none; }
      `}</style>

      <div className="print-area absolute inset-0 p-10 text-black bg-white">
        <div
          className="max-w-6xl mx-auto text-[12px] leading-[1.35]"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <div className="flex justify-end text-[11px] mb-2">
            <div className="text-right" style={{ lineHeight: 1.25 }}>
              <div>Унифицированная форма № Т-1а</div>
              <div>Утверждена Постановлением Госкомстата России</div>
              <div>от 05.01.2004 № 1</div>
            </div>
          </div>

          <div className="flex justify-end items-center text-[11px] mb-2">
            <div className="border border-black text-center" style={{ padding: "4px 8px", width: 120 }}>
              <div>Код</div>
              <div className="flex border-t border-black text-[11px]">
                <div className="flex-1 border-r border-black" style={{ padding: "2px 0" }}>Форма по ОКУД</div>
                <div style={{ width: 70, padding: "2px 0" }}>0301015</div>
              </div>
              <div className="flex border-t border-black text-[11px]">
                <div className="flex-1 border-r border-black" style={{ padding: "2px 0" }}>по ОКПО</div>
                <div style={{ width: 70, padding: "2px 0" }}>{fmt(printable.organizationOkpo)}</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px]">
            <div className="border-b border-black inline-block text-[12px]" style={{ paddingBottom: 2, minWidth: 420 }}>{fmt(printable.organization)}</div>
            <div className="text-[10px]" style={{ marginTop: 2 }}>(наименование организации)</div>
          </div>

          <div className="flex justify-center mt-4 mb-1 text-[12px]">
            <div className="flex border border-black text-center">
              <div className="border-r border-black px-3 py-1" style={{ minWidth: 140 }}>Номер документа</div>
              <div className="px-3 py-1" style={{ minWidth: 140 }}>Дата составления</div>
            </div>
          </div>
          <div className="flex justify-center mb-4 text-[12px]">
            <div className="flex border border-black text-center">
              <div className="border-r border-black px-3 py-2 font-semibold" style={{ minWidth: 140 }}>{fmt(printable.number)}</div>
              <div className="px-3 py-2" style={{ minWidth: 140 }}>{fmt(printable.preparationDate)}</div>
            </div>
          </div>

          <div className="text-center mb-4" style={{ lineHeight: 1.35 }}>
            <div className="text-[13px] font-bold">ПРИКАЗ</div>
            <div className="font-semibold">(распоряжение)</div>
            <div className="font-semibold">о приеме работников на работу</div>
          </div>

          <div className="font-semibold text-[13px] mb-2">Принять на работу:</div>

          <table className="w-full border border-black text-[11px]" cellPadding={0} cellSpacing={0}>
            <thead>
              <tr>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[16%]" rowSpan={2}>Фамилия, имя, отчество</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[8%]" rowSpan={2}>Табельный номер</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[12%]" rowSpan={2}>Структурное подразделение</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[18%]" rowSpan={2}>Должность (специальность, профессия), разряд, класс (категория) квалификации</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[10%]" rowSpan={2}>Тарифная ставка (оклад), надбавка, руб.</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[14%]" colSpan={2}>
                  Основание: трудовой договор
                </th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[10%]" colSpan={2}>Период работы</th>
                <th className="border-r border-b border-black align-bottom text-center px-2 py-2 w-[6%]" rowSpan={2}>Испытание на срок, месяцев</th>
                <th className="border-b border-black align-bottom text-center px-2 py-2 w-[6%]" rowSpan={2}>С приказом (распоряжением) работник ознакомлен. Личная подпись. Дата</th>
              </tr>
              <tr className="text-[10px] text-center">
                <th className="border-r border-b border-black py-1">номер</th>
                <th className="border-r border-b border-black py-1">дата</th>
                <th className="border-r border-b border-black py-1">с</th>
                <th className="border-r border-b border-black py-1">по</th>
              </tr>
              <tr className="text-[10px] text-center">
                <th className="border-r border-b border-black py-1">1</th>
                <th className="border-r border-b border-black py-1">2</th>
                <th className="border-r border-b border-black py-1">3</th>
                <th className="border-r border-b border-black py-1">4</th>
                <th className="border-r border-b border-black py-1">5</th>
                <th className="border-r border-b border-black py-1">6</th>
                <th className="border-r border-b border-black py-1">7</th>
                <th className="border-r border-b border-black py-1">8</th>
                <th className="border-r border-b border-black py-1">9</th>
                <th className="border-r border-b border-black py-1">10</th>
                <th className="border-b border-black py-1">11</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-[11px]" style={{ height: 36 }}>
                <td className="border-r border-black px-2 align-top">{fmt(printable.employee)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.personnelNumber)}</td>
                <td className="border-r border-black px-2 align-top">{fmt(printable.department)}</td>
                <td className="border-r border-black px-2 align-top">{fmt(printable.position)}</td>
                <td className="border-r border-black px-2 text-right align-top">{fmt(printable.salary)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.contractNumber)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.contractDate)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.workDateFrom)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.workDateTo)}</td>
                <td className="border-r border-black px-2 text-center align-top">{fmt(printable.probationMonths)}</td>
                <td className="px-2 text-center align-top">—</td>
              </tr>
              {[...Array(4)].map((_, idx) => (
                <tr key={idx} style={{ height: 32 }}>
                  <td className="border-r border-t border-black" colSpan={11}></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center text-[12px] mt-6">
            <div className="w-1/2">
              <div className="mb-2">Руководитель организации</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 border-b border-black" style={{ height: 0 }}></div>
                <div className="text-[10px] whitespace-nowrap">(должность)</div>
              </div>
            </div>
            <div className="w-1/2 text-right">
              <div className="mb-2">С приказом ознакомлен</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="text-[10px] whitespace-nowrap">(личная подпись)</div>
                <div className="flex-1 border-b border-black" style={{ height: 0 }}></div>
                <div className="text-[10px] whitespace-nowrap">(расшифровка подписи)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
