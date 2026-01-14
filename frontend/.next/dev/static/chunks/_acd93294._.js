(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiDelete",
    ()=>apiDelete,
    "apiGet",
    ()=>apiGet,
    "apiPatch",
    ()=>apiPatch,
    "apiPost",
    ()=>apiPost,
    "apiPut",
    ()=>apiPut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
async function request(path, options = {}) {
    const headers = {
        ...options.headers || {}
    };
    // Only set Content-Type for requests with a body to avoid unnecessary CORS preflight for GET
    if (options.body !== undefined && options.body !== null) {
        headers["Content-Type"] = "application/json";
    }
    const res = await fetch(`${BASE_URL}${path}`, {
        headers,
        ...options
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API ${options.method || "GET"} ${path} failed: ${res.status} ${text}`);
    }
    if (res.status === 204) return undefined;
    return await res.json();
}
function apiGet(path) {
    return request(path, {
        method: "GET"
    });
}
function apiPost(path, body) {
    return request(path, {
        method: "POST",
        body: JSON.stringify(body)
    });
}
function apiPut(path, body) {
    return request(path, {
        method: "PUT",
        body: JSON.stringify(body)
    });
}
function apiPatch(path, body) {
    return request(path, {
        method: "PATCH",
        body: JSON.stringify(body)
    });
}
function apiDelete(path) {
    return request(path, {
        method: "DELETE"
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/employment-orders/[id]/edit/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EmploymentOrderEditPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function EmploymentOrderEditPage() {
    _s();
    const [header, setHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        number: "",
        preparationDate: "",
        organizationId: undefined
    });
    const emptyRow = ()=>({
            worker: "",
            department: "",
            position: "",
            salary: "",
            workDateFrom: "",
            workDateTo: "",
            probationMonths: ""
        });
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        emptyRow()
    ]);
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [orgOptionsLocal, setOrgOptionsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [contractOptionsLocal, setContractOptionsLocal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const toIsoDate = (v)=>{
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EmploymentOrderEditPage.useEffect": ()=>{
            const id = params?.id;
            if (!id) return;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/employment-orders/${id}`).then({
                "EmploymentOrderEditPage.useEffect": (h)=>{
                    if (!h) return;
                    setHeader({
                        number: h.number ?? "",
                        preparationDate: h.preparation_date ?? "",
                        organizationId: h.organization_id ?? undefined
                    });
                }
            }["EmploymentOrderEditPage.useEffect"]).catch({
                "EmploymentOrderEditPage.useEffect": (e)=>console.error("Failed to load header", e)
            }["EmploymentOrderEditPage.useEffect"]);
            // fetch lookups to resolve contracts -> employee/department/position display
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/contracts`).catch({
                    "EmploymentOrderEditPage.useEffect": ()=>[]
                }["EmploymentOrderEditPage.useEffect"]),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/individuals`).catch({
                    "EmploymentOrderEditPage.useEffect": ()=>[]
                }["EmploymentOrderEditPage.useEffect"]),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/departments`).catch({
                    "EmploymentOrderEditPage.useEffect": ()=>[]
                }["EmploymentOrderEditPage.useEffect"]),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/positions`).catch({
                    "EmploymentOrderEditPage.useEffect": ()=>[]
                }["EmploymentOrderEditPage.useEffect"])
            ]).then({
                "EmploymentOrderEditPage.useEffect": ([contracts, individuals, departments, positions])=>{
                    const indivMap = new Map();
                    (individuals ?? []).forEach({
                        "EmploymentOrderEditPage.useEffect": (i)=>indivMap.set(i.id, i)
                    }["EmploymentOrderEditPage.useEffect"]);
                    const deptMap = new Map();
                    (departments ?? []).forEach({
                        "EmploymentOrderEditPage.useEffect": (d)=>deptMap.set(d.id, d)
                    }["EmploymentOrderEditPage.useEffect"]);
                    const posMap = new Map();
                    (positions ?? []).forEach({
                        "EmploymentOrderEditPage.useEffect": (p)=>posMap.set(p.id, p)
                    }["EmploymentOrderEditPage.useEffect"]);
                    // ensure contractOptionsLocal is set
                    setContractOptionsLocal((contracts ?? []).map({
                        "EmploymentOrderEditPage.useEffect": (c)=>({
                                id: c.id,
                                worker: indivMap.get(c.employee_id) ? [
                                    indivMap.get(c.employee_id).last_name,
                                    indivMap.get(c.employee_id).first_name,
                                    indivMap.get(c.employee_id).patronymic
                                ].filter(Boolean).join(' ') : c.employee_name ?? '',
                                departmentId: c.department_id,
                                department: deptMap.get(c.department_id)?.title ?? c.department_title ?? c.department_name ?? "",
                                positionId: c.position_id,
                                position: posMap.get(c.position_id)?.title ?? c.position_title ?? "",
                                salary: c.salary ?? 0,
                                workDateFrom: toIsoDate(c.work_date_from),
                                workDateTo: toIsoDate(c.work_date_to),
                                probationMonths: c.probation_months ?? 0
                            })
                    }["EmploymentOrderEditPage.useEffect"]));
                    // now load bodies and map via contracts map
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/employment-orders/bodies?header_id=${id}`).then({
                        "EmploymentOrderEditPage.useEffect": (b)=>{
                            if (!b) return;
                            const contractById = new Map();
                            (contracts ?? []).forEach({
                                "EmploymentOrderEditPage.useEffect": (c)=>contractById.set(c.id, c)
                            }["EmploymentOrderEditPage.useEffect"]);
                            // deduplicate by employment_contract_id to avoid duplicate rows
                            const seen = new Set();
                            const mapped = b.filter({
                                "EmploymentOrderEditPage.useEffect.mapped": (row)=>{
                                    if (!row.employment_contract_id) return true;
                                    if (seen.has(row.employment_contract_id)) return false;
                                    seen.add(row.employment_contract_id);
                                    return true;
                                }
                            }["EmploymentOrderEditPage.useEffect.mapped"]).map({
                                "EmploymentOrderEditPage.useEffect.mapped": (row)=>{
                                    const c = contractById.get(row.employment_contract_id) || {};
                                    const ind = indivMap.get(c.employee_id) || {};
                                    return {
                                        bodyId: row.id,
                                        contractBodyId: row.employment_contract_id ?? undefined,
                                        departmentId: row.department_id ?? c.department_id,
                                        positionId: row.position_id ?? c.position_id,
                                        worker: [
                                            ind.last_name,
                                            ind.first_name,
                                            ind.patronymic
                                        ].filter(Boolean).join(" ") || (ind.full_name ?? ind.name ?? c.employee_name ?? ""),
                                        department: deptMap.get(c.department_id)?.title ?? c.department_title ?? c.department_name ?? "",
                                        position: posMap.get(c.position_id)?.title ?? c.position_title ?? "",
                                        salary: row.salary ? String(row.salary) : c.salary ? String(c.salary) : "",
                                        workDateFrom: toIsoDate(row.work_date_from ?? c.work_date_from),
                                        workDateTo: toIsoDate(row.work_date_to ?? c.work_date_to),
                                        probationMonths: row.probation_months ? String(row.probation_months) : c.probation_months ? String(c.probation_months) : ""
                                    };
                                }
                            }["EmploymentOrderEditPage.useEffect.mapped"]);
                            setRows(mapped.length ? mapped : [
                                emptyRow()
                            ]);
                        }
                    }["EmploymentOrderEditPage.useEffect"]).catch({
                        "EmploymentOrderEditPage.useEffect": (e)=>console.error("Failed to load bodies", e)
                    }["EmploymentOrderEditPage.useEffect"]);
                }
            }["EmploymentOrderEditPage.useEffect"]).catch({
                "EmploymentOrderEditPage.useEffect": (e)=>console.error("Failed to load lookups", e)
            }["EmploymentOrderEditPage.useEffect"]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/organizations`).then({
                "EmploymentOrderEditPage.useEffect": (d)=>setOrgOptionsLocal((d ?? []).map({
                        "EmploymentOrderEditPage.useEffect": (o)=>({
                                id: o.id,
                                title: o.title
                            })
                    }["EmploymentOrderEditPage.useEffect"]))
            }["EmploymentOrderEditPage.useEffect"]).catch({
                "EmploymentOrderEditPage.useEffect": ()=>setOrgOptionsLocal([])
            }["EmploymentOrderEditPage.useEffect"]);
        }
    }["EmploymentOrderEditPage.useEffect"], [
        params?.id
    ]);
    const contractOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "EmploymentOrderEditPage.useMemo[contractOptions]": ()=>contractOptionsLocal
    }["EmploymentOrderEditPage.useMemo[contractOptions]"], [
        contractOptionsLocal
    ]);
    const handleContractPick = (rowIndex, id)=>{
        const selected = contractOptionsLocal.find((c)=>c.id === id);
        if (!selected) return;
        setRows((prev)=>prev.map((row, idx)=>idx === rowIndex ? {
                    contractBodyId: selected.id,
                    worker: selected.worker,
                    department: selected.department,
                    position: selected.position,
                    salary: String(selected.salary),
                    workDateFrom: selected.workDateFrom,
                    workDateTo: selected.workDateTo,
                    probationMonths: String(selected.probationMonths)
                } : row));
    };
    const handleRowChange = (rowIndex, field, value)=>{
        setRows((prev)=>prev.map((row, idx)=>idx === rowIndex ? {
                    ...row,
                    [field]: value
                } : row));
    };
    const addRow = ()=>setRows((prev)=>[
                ...prev,
                emptyRow()
            ]);
    const removeRow = (rowIndex)=>{
        setRows((prev)=>prev.length === 1 ? prev : prev.filter((_, idx)=>idx !== rowIndex));
    };
    const handleSave = async ()=>{
        setSaving(true);
        try {
            const payload = {
                number: header.number.trim() || null,
                preparation_date: header.preparationDate || null,
                organization_id: header.organizationId ?? null
            };
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPatch"])(`/api/employment-orders/${params?.id}`, payload);
            // Update/create bodies
            // Prevent creating duplicate bodies for the same contract when saving edits
            const existingContractIds = new Set();
            for (const r of rows){
                if (r.contractBodyId) existingContractIds.add(r.contractBodyId);
            }
            const createdFor = new Set();
            for (const row of rows){
                if (!row.worker && !row.contractBodyId) continue;
                const contract = contractOptionsLocal.find((c)=>c.id === row.contractBodyId);
                const workFrom = toIsoDate(row.workDateFrom || contract?.workDateFrom || "");
                const workTo = toIsoDate(row.workDateTo || contract?.workDateTo || "");
                if (!workFrom) continue; // skip invalid row
                const bodyPayload = {
                    employment_order_header_id: Number(params?.id),
                    employment_contract_id: row.contractBodyId ?? 0,
                    department_id: row.departmentId ?? contract?.departmentId ?? 0,
                    position_id: row.positionId ?? contract?.positionId ?? 0,
                    salary: row.salary ? Number(row.salary) : contract?.salary ?? 0,
                    work_date_from: workFrom,
                    work_date_to: workTo,
                    probation_months: row.probationMonths ? Number(row.probationMonths) : contract?.probationMonths ?? 0
                };
                if (row.bodyId) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPatch"])(`/api/employment-orders/bodies/${row.bodyId}`, bodyPayload).catch((e)=>console.error(e));
                } else {
                    // if we've already created a body for this contract in this save cycle, skip
                    if (row.contractBodyId && createdFor.has(row.contractBodyId)) continue;
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiPost"])(`/api/employment-orders/bodies`, bodyPayload).catch((e)=>console.error(e));
                    if (row.contractBodyId) createdFor.add(row.contractBodyId);
                }
            }
            router.push("/employment-orders");
        } catch (err) {
            console.error("Failed to update employment order", err);
            alert("Не удалось сохранить изменения");
        } finally{
            setSaving(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-zinc-950 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-6xl space-y-6 mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-zinc-50",
                                    children: "Редактирование приказа о приёме"
                                }, void 0, false, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-400 mt-2",
                                    children: "Загружаю данные приказа, при сохранении изменения отправляются на сервер."
                                }, void 0, false, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 248,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/employment-orders",
                            className: "text-sm text-emerald-400 hover:text-emerald-300",
                            children: "← К списку"
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                    lineNumber: 247,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-lg font-semibold text-zinc-50",
                            children: "Шапка документа"
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-end gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "space-y-2 text-sm text-zinc-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Номер документа"
                                        }, void 0, false, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 264,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                            value: header.number,
                                            onChange: (e)=>setHeader({
                                                    ...header,
                                                    number: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "space-y-2 text-sm text-zinc-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Дата подготовки"
                                        }, void 0, false, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 272,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                            value: header.preparationDate,
                                            onChange: (e)=>setHeader({
                                                    ...header,
                                                    preparationDate: e.target.value
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "space-y-2 text-sm text-zinc-200 md:col-span-2 lg:col-span-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "Организация"
                                        }, void 0, false, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 283,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                            value: header.organizationId ?? "",
                                            onChange: (e)=>setHeader({
                                                    ...header,
                                                    organizationId: Number(e.target.value)
                                                }),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    disabled: true,
                                                    children: "Выберите организацию"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, this),
                                                orgOptionsLocal.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: org.id,
                                                        children: org.title
                                                    }, org.id, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 284,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 262,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                    lineNumber: 260,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    className: "space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-semibold text-zinc-50",
                                    children: "Табличная часть"
                                }, void 0, false, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 306,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-zinc-400",
                                    children: "Выберите работника в строке — поля заполнятся автоматически"
                                }, void 0, false, {
                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 305,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-hidden rounded-lg border border-zinc-800",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full text-sm text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-zinc-900/70",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Работник"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Подразделение"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Должность"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Оклад"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Работа с"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Работа по"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                    children: "Испыт. срок"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-3 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                            lineNumber: 313,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: rows.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/60",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100 align-top",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.contractBodyId ?? "",
                                                            onChange: (e)=>handleContractPick(idx, Number(e.target.value)),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: "",
                                                                    disabled: true,
                                                                    children: "Выберите работника"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 25
                                                                }, this),
                                                                row.contractBodyId && !contractOptionsLocal.find((c)=>c.id === row.contractBodyId) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: row.contractBodyId,
                                                                    children: row.worker || `#${row.contractBodyId}`
                                                                }, `sel-${row.contractBodyId}`, false, {
                                                                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                                    lineNumber: 338,
                                                                    columnNumber: 27
                                                                }, this) : null,
                                                                contractOptions.map((contract)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: contract.id,
                                                                        children: contract.worker || `#${contract.id}`
                                                                    }, contract.id, false, {
                                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                                        lineNumber: 343,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 328,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 327,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.department,
                                                            onChange: (e)=>handleRowChange(idx, "department", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.position,
                                                            onChange: (e)=>handleRowChange(idx, "position", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 356,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.salary,
                                                            onChange: (e)=>handleRowChange(idx, "salary", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 364,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.workDateFrom,
                                                            onChange: (e)=>handleRowChange(idx, "workDateFrom", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 372,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 371,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.workDateTo,
                                                            onChange: (e)=>handleRowChange(idx, "workDateTo", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 380,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "number",
                                                            className: "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50",
                                                            value: row.probationMonths,
                                                            onChange: (e)=>handleRowChange(idx, "probationMonths", e.target.value)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 388,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-3 py-3 text-zinc-100 align-top",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            className: "rounded-md border border-red-500/60 px-3 py-1 text-xs text-red-200 hover:border-red-400 hover:text-red-100",
                                                            onClick: ()=>removeRow(idx),
                                                            children: "Удалить"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                        lineNumber: 395,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                                lineNumber: 326,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                                lineNumber: 311,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 310,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "mt-3 inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-500",
                            onClick: addRow,
                            children: "Добавить строку"
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 410,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                    lineNumber: 304,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-end gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/employment-orders",
                            className: "rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:border-zinc-500",
                            children: "Отменить"
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 420,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500",
                            onClick: handleSave,
                            disabled: saving,
                            "aria-busy": saving,
                            children: saving ? "Сохранение..." : "Сохранить"
                        }, void 0, false, {
                            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                            lineNumber: 426,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
                    lineNumber: 419,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
            lineNumber: 246,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/employment-orders/[id]/edit/page.tsx",
        lineNumber: 245,
        columnNumber: 5
    }, this);
}
_s(EmploymentOrderEditPage, "bVFPYlTgMnwPD8RDiKrOQFnRznU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = EmploymentOrderEditPage;
var _c;
__turbopack_context__.k.register(_c, "EmploymentOrderEditPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_acd93294._.js.map