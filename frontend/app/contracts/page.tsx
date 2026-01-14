import ContractsClient from "./ContractsClient";

const BASE_URL = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error("fetchJson error", err);
    return null;
  }
}

type ContractRow = {
  id: number;
  number: string;
  conclusionDate: string;
  city: string;
  organization: string;
  representative: string;
  representativePosition: string;
  basis: string;
  employee: string;
  employeePassport: string;
  department: string;
  position: string;
  place: string;
  personnelNumber: string;
  workDateFrom: string;
  workDateTo: string;
  salary: string;
  conditionsClass: string;
  probationMonths: string;
  paidLeaveDays: string;
  workHoursFrom: string;
  workHoursTo: string;
  breakFrom: string;
  breakTo: string;
};

export default async function ContractsPage() {
  // Server-side fetch of contracts + lookups so initial HTML contains data (no hydration dependency)
  const [contracts, orgs, individuals] = await Promise.all([
    fetchJson<any[]>('/api/contracts'),
    fetchJson<any[]>('/api/organizations'),
    fetchJson<any[]>('/api/individuals'),
  ]);

  const orgMap = new Map<number, any>();
  (orgs ?? []).forEach((o: any) => orgMap.set(o.id, o));
  const indMap = new Map<number, any>();
  (individuals ?? []).forEach((it: any) => indMap.set(it.id, it));

  const mapped = (contracts ?? []).map((c: any) => ({
    id: c.id,
    number: c.number ?? "",
    conclusionDate: c.conclusion_date ?? "",
    city: c.city ?? "",
    organization: orgMap.get(c.organization_id)?.title ?? (c.organization_name ?? String(c.organization_id ?? "")),
    representative: (() => {
      const r = indMap.get(c.representative_id);
      if (r) return [r.last_name, r.first_name, r.patronymic].filter(Boolean).join(' ');
      return "";
    })(),
    representativePosition: c.representative_position ?? "",
    basis: c.basis ?? "",
    employee: (() => {
      const e = indMap.get(c.employee_id);
      if (e) return [e.last_name, e.first_name, e.patronymic].filter(Boolean).join(' ');
      return c.employee_name ?? "";
    })(),
    employeePassport: c.employee_passport_series ? `${c.employee_passport_series} ${c.employee_passport_number}` : (c.passport ? c.passport : ""),
    department: c.department_title ?? c.department_name ?? "",
    position: c.position_title ?? "",
    place: c.place ?? "",
    personnelNumber: c.personnel_number ?? "",
    workDateFrom: c.work_date_from ?? "",
    workDateTo: c.work_date_to ?? "",
    salary: c.salary ? String(c.salary) : "",
    conditionsClass: c.conditions_class ? String(c.conditions_class) : "",
    probationMonths: c.probation_months ? String(c.probation_months) : "",
    paidLeaveDays: c.paid_leave_days ? String(c.paid_leave_days) : "",
    workHoursFrom: c.work_hours_from ?? "",
    workHoursTo: c.work_hours_to ?? "",
    breakFrom: c.break_from ?? "",
    breakTo: c.break_to ?? "",
  } as ContractRow));

  return <ContractsClient initialRows={mapped ?? []} />;
}
