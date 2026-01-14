(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/list-page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ListPage",
    ()=>ListPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
;
;
function ListPage({ title, description, columns, rows, createLabel = "Создать", createHref, actions }) {
    const hasActions = Boolean(actions);
    const data = rows ?? [];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-zinc-950 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "mb-6 flex items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold text-zinc-50",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/list-page.tsx",
                                    lineNumber: 46,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-zinc-400 mt-2",
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/list-page.tsx",
                                    lineNumber: 47,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/list-page.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: createHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: createHref,
                                className: "inline-flex items-center rounded-lg border  bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 shadow hover:bg-zinc-200",
                                children: createLabel
                            }, void 0, false, {
                                fileName: "[project]/components/list-page.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "inline-flex items-center rounded-lg border bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 shadow hover:bg-zinc-200",
                                disabled: true,
                                children: createLabel
                            }, void 0, false, {
                                fileName: "[project]/components/list-page.tsx",
                                lineNumber: 58,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/list-page.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/list-page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full text-sm text-left",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-zinc-900/70",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                                children: col.label
                                            }, col.key, false, {
                                                fileName: "[project]/components/list-page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 19
                                            }, this)),
                                        hasActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-400",
                                            children: "Действия"
                                        }, void 0, false, {
                                            fileName: "[project]/components/list-page.tsx",
                                            lineNumber: 82,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/list-page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/list-page.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: [
                                    data.map((row, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: idx % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/60",
                                            children: [
                                                columns.map((col)=>{
                                                    const value = row[col.key];
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-3 text-zinc-100",
                                                        children: col.render ? col.render(value, row) : String(value ?? "—")
                                                    }, col.key, false, {
                                                        fileName: "[project]/components/list-page.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 23
                                                    }, this);
                                                }),
                                                hasActions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-3 text-zinc-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 text-xs",
                                                        children: [
                                                            actions?.showEdit && (actions?.editHref ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: actions.editHref(row),
                                                                className: "rounded-md border border-zinc-700 px-3 py-1 text-zinc-100 hover:border-zinc-500 hover:text-white",
                                                                children: "Редактировать"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/list-page.tsx",
                                                                lineNumber: 108,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                className: "rounded-md border border-zinc-800 px-3 py-1 text-zinc-400",
                                                                disabled: true,
                                                                children: "Редактировать"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/list-page.tsx",
                                                                lineNumber: 115,
                                                                columnNumber: 29
                                                            }, this)),
                                                            actions?.showDelete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                className: "rounded-md border border-red-500/60 px-3 py-1 text-red-200 hover:border-red-400 hover:text-red-100",
                                                                onClick: ()=>actions?.onDelete?.(row),
                                                                children: "Удалить"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/list-page.tsx",
                                                                lineNumber: 125,
                                                                columnNumber: 27
                                                            }, this),
                                                            actions?.showPrint && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                className: "rounded-md border border-blue-500/60 px-3 py-1 text-blue-200 hover:border-blue-400 hover:text-blue-100",
                                                                onClick: ()=>actions?.onPrint?.(row),
                                                                children: "Печать"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/list-page.tsx",
                                                                lineNumber: 134,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/list-page.tsx",
                                                        lineNumber: 105,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/list-page.tsx",
                                                    lineNumber: 104,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, idx, true, {
                                            fileName: "[project]/components/list-page.tsx",
                                            lineNumber: 90,
                                            columnNumber: 17
                                        }, this)),
                                    data.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: columns.length + (hasActions ? 1 : 0),
                                            className: "px-4 py-6 text-center text-zinc-500",
                                            children: "Данные отсутствуют"
                                        }, void 0, false, {
                                            fileName: "[project]/components/list-page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/list-page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/list-page.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/list-page.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/list-page.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/list-page.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/list-page.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c = ListPage;
var _c;
__turbopack_context__.k.register(_c, "ListPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/app/contracts/ContractsClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContractsClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$list$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/list-page.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ContractsClient({ initialRows }) {
    _s();
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialRows ?? []);
    const asIso = (value)=>{
        if (value === undefined || value === null || value === "") return "—";
        if (typeof value === "string" && value.includes("-")) return value;
        const num = typeof value === "number" ? value : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
        if (Number.isNaN(num)) return String(value);
        const ms = num > 1e12 ? num : num * 1000;
        const d = new Date(ms);
        return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
    };
    const asHumanDate = (value)=>{
        const iso = asIso(value);
        if (iso === "—") return iso;
        // if value is non-date text (e.g., already in human format), return as is
        if (typeof value === "string" && /[a-zA-Zа-яА-Я]/.test(value) && !/\d{4}-\d{2}-\d{2}/.test(value)) {
            return value;
        }
        const d = new Date(iso);
        return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).replace(" г.", "") + " г.";
    };
    const initials = (fullName)=>{
        if (!fullName) return "";
        const parts = fullName.trim().split(/\s+/);
        if (!parts.length) return "";
        const [last, first, middle] = parts;
        const f = first ? `${first[0]}.` : "";
        const m = middle ? `${middle[0]}.` : "";
        return [
            last,
            f,
            m
        ].filter(Boolean).join(" ");
    };
    const buildPrintHtml = (data)=>{
        const esc = (v)=>v === undefined || v === "" ? "—" : String(v);
        const p = (text)=>`<p style="margin: 6px 0;">${text}</p>`;
        return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>Трудовой договор № ${esc(data.contractNumber)}</title>
  <style>
    body { margin: 0; padding: 36px 40px; font-family: "Times New Roman", Times, serif; color: #000; }
    .wrap { max-width: 1160px; margin: 0 auto; font-size: 12px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; }
    .title { text-align: center; font-size: 16px; font-weight: 700; margin: 10px 0 4px; }
    .subtitle { text-align: center; font-size: 12px; margin-bottom: 16px; }
    .section-title { font-weight: 700; margin: 12px 0 6px; font-size: 13px; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 18px; font-size: 12px; gap: 12px; }
    .line { border-bottom: 1px solid #000; min-width: 220px; display: inline-block; }
    .muted { font-size: 10px; color: #555; }
    .indent { margin-left: 18px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div>Трудовой договор № <strong>${esc(data.contractNumber)}</strong></div>
      <div>${esc(data.city)} ${esc(data.contractDate)}</div>
    </div>

    <div class="title">ТРУДОВОЙ ДОГОВОР</div>
    <div class="subtitle">(общие условия заключения, права и обязанности сторон)</div>

    ${p(`${esc(data.employerName)} именуем в дальнейшем "Работодатель", в лице ${esc(data.representative)} (должность: ${esc(data.representativePosition)}), действующего на основании ${esc(data.representativeBasis || "устава")}, с одной стороны, и ${esc(data.employee)} ${esc(data.employeePassport)} именуемый в дальнейшем "Работник", с другой стороны, совместно именуемые "Стороны", заключили настоящий Трудовой договор о нижеследующем.`)}

    <div class="section-title">1. Предмет Трудового договора</div>
    ${p(`1.1 Работодатель обязуется предоставить Работнику работу согласно штатному расписанию в должности ${esc(data.position)}, обеспечить условия труда предусмотренные трудовым законодательством РФ и иными нормативными правовыми актами, содержащими нормы трудового права, соглашениями, локальными нормативными актами и настоящим Трудовым договором, своевременно и в полном объеме выплачивать Работнику заработную плату, Работник обязуется лично выполнять трудовые функции, соблюдать Правила внутреннего трудового распорядка, действующие у Работодателя.`)}
    ${p(`1.2 Работа по настоящему Трудовому договору является для Работника основной работой.`)}
    ${p(`1.3 Адресом места работы Работника является ${esc(data.workPlace || data.employerAddress)}`)}
    ${p(`1.4 Работнику установлены следующие условия труда на рабочем месте: ${esc(data.conditionsClass)}`)}
    ${p(`1.5 Условия труда на рабочем месте соответствуют требованиям действующего законодательства РФ в сфере охраны труда с учетом специфики трудовых функций Работника.`)}

    <div class="section-title">2. Срок действия Трудового договора</div>
    ${p(`2.1 Трудовой договор вступает в силу со дня его заключения Работником и Работодателем`)}
    ${p(`2.2 Дата начала работы: ${esc(data.workStart)}`)}
    ${p(`2.3 Дата окончания действия Трудового договора: ${esc(data.workEnd || "-")}`)}
    ${p(`2.4 В целях проверки соответствия квалификации Работника занимаемой должности, его отношения к поручаемой работе Работнику устанавливается испытательный срок продолжительностью ${esc(data.probationMonths)} месяц(а/ев) с момента начала работы.`)}

    <div class="section-title">3. Условия оплаты труда Работника</div>
    ${p(`3.1 За выполнение трудовых обязанностей Работнику устанавливается должностной оклад в размере ${esc(data.salary)} рублей в месяц.`)}
    ${p(`3.2 Работодателем устанавливаются стимулирующие и компенсационные выплаты (доплаты, надбавки, премии и т.п.). Размеры и условия таких выплат определены в Положении о премировании работников, с которым Работник ознакомлен при подписании настоящего Трудового договора.`)}
    ${p(`3.3 Заработная плата Работнику выплачивается путем перечисления на счет Работника в банк каждые полмесяца в день, установленный Правилами внутреннего трудового распорядка.`)}

    <div class="section-title">4. Режим рабочего времени и времени отдыха. Отпуск</div>
    ${p(`4.1 Работнику устанавливается пятидневная рабочая неделя с двумя выходными днями.`)}
    ${p(`4.2 Время начала работы: ${esc(data.workHoursFrom)} Время окончания работы: ${esc(data.workHoursTo)}`)}
    ${p(`4.3 В течение рабочего дня Работнику устанавливается перерыв для отдыха и питания с ${esc(data.breakFrom)} ч. до ${esc(data.breakTo)} ч., который в рабочее время не включается.`)}
    ${p(`4.4 Работнику предоставляется ежегодный оплачиваемый отпуск продолжительностью ${esc(data.paidLeaveDays)} календарных дней.`)}

    <div class="section-title">5. Права и обязанности Работника</div>
    ${p(`5.1 Работник обязан:`)}
    <div class="indent">
      ${p(`5.1.1 Добросовестно исполнять свои трудовые обязанности, определяемые в Должностной инструкции, являющейся Приложением к настоящему Договору.`)}
      ${p(`5.1.2 Соблюдать Правила внутреннего трудового распорядка и иные локальные нормативные акты Работодателя.`)}
      ${p(`5.1.3 Соблюдать трудовую дисциплину, требования по охране труда и обеспечению безопасности труда.`)}
    </div>
    ${p(`5.2 Работник имеет право:`)}
    <div class="indent">
      ${p(`5.2.1 На предоставление ему работы, обусловленной настоящим Трудовым договором.`)}
      ${p(`5.2.2 Своевременную и полную выплату заработной платы в соответствии со своей квалификацией, сложностью труда, количеством и качеством выполненной работы.`)}
      ${p(`5.2.3 Обязательное социальное страхование в случаях, предусмотренных федеральными законами.`)}
    </div>

    <div class="section-title">6. Права и обязанности Работодателя</div>
    ${p(`6.1 Работодатель обязан:`)}
    <div class="indent">
      ${p(`6.1.1 Соблюдать трудовое законодательство и иные нормативные правовые акты, содержащие нормы трудового права, локальные нормативные акты.`)}
      ${p(`6.1.2 Предоставлять Работнику работу, обусловленную настоящим Трудовым договором.`)}
      ${p(`6.1.3 Обеспечивать Работника оборудованием, инструментами, технической документацией и иными средствами, необходимыми для исполнения им трудовых обязанностей.`)}
      ${p(`6.1.4 Выплачивать своевременно и в полном размере причитающуюся Работнику заработную плату, а также осуществлять иные выплаты в сроки, установленные в соответствии с Трудовым кодексом РФ, Правилами внутреннего трудового распорядка.`)}
      ${p(`6.1.5 Осуществлять обязательное социальное страхование Работника в порядке, установленном федеральными законами.`)}
      ${p(`6.1.6 Исполнять иные обязанности, предусмотренные трудовым законодательством.`)}
    </div>
    ${p(`6.2 Работодатель имеет право:`)}
    <div class="indent">
      ${p(`6.2.1 Поощрять Работника за добросовестный и эффективный труд.`)}
      ${p(`6.2.2 Требовать от Работника исполнения трудовых обязанностей, определенных в настоящем Договоре и Должностной инструкции, бережного отношения к имуществу Работодателя и других работников, соблюдения Правил внутреннего трудового распорядка.`)}
      ${p(`6.2.3 Привлекать Работника к дисциплинарной и материальной ответственности в порядке установленном действующим законодательством Российской Федерации.`)}
      ${p(`6.2.4 Принимать локальные нормативные акты.`)}
    </div>

    <div class="section-title">7. Социальное страхование Работника</div>
    ${p(`7.1 Работник подлежит обязательному социальному страхованию от несчастных случаев на производстве и профессиональных заболеваний в порядке и на условиях, которые установлены действующим законодательством Российской Федерации.`)}

    <div class="section-title">8. Ответственность Сторон</div>
    ${p(`8.1 Сторона Трудового договора, виновная в нарушении трудового законодательства и иных нормативных правовых актов, содержащих нормы трудового права, несет ответственность в случаях и порядке, которые установлены Трудовым кодексом Российской Федерации и иными федеральными законами.`)}

    <div class="section-title">9. Прекращение Трудового договора</div>
    ${p(`9.1 Настоящий Трудовой договор может быть расторгнут по основаниям, предусмотренным действующим законодательством Российской Федерации.`)}
    ${p(`9.2 Днем прекращения Трудового договора во всех случаях является последний день работы Работника, за исключением случаев, когда Работник фактически не работал, но за ним сохранялось место работы (должность).`)}

    <div class="section-title">10. Заключительные положения</div>
    ${p(`10.1 Условия настоящего Трудового договора имеют обязательную юридическую силу для Сторон с момента его подписания. Все изменения и дополнения к настоящему Трудовому договору оформляются двусторонним письменным соглашением.`)}
    ${p(`10.2 Споры между Сторонами, возникающие при исполнении настоящего Трудового договора, рассматриваются в порядке, установленном законодательством Российской Федерации.`)}
    ${p(`10.3 Трудовой договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, один из которых хранится у Работодателя, а другой - у Работника.`)}

    <div class="section-title">11. Адреса, реквизиты и подписи Сторон</div>
    ${p(`Работодатель: ${esc(data.employerName)}`)}
    ${p(`Адрес: ${esc(data.employerAddress)}`)}
    ${p(`ИНН: ${esc(data.employerInn)}\u00a0\u00a0КПП: ${esc(data.employerKpp)}`)}
    ${p(`Р/С: ${esc(data.employerAccount)}`)}
    ${p(`БИК: ${esc(data.employerBic)}`)}

    ${p(`Работник: ${esc(data.employee)}`)}
    ${p(`Паспорт: серия ${esc(data.employeePassport.split(" ")[0] || "")} № ${esc(data.employeePassport.split(" ")[1] || "")} выдан ${esc(data.employeePassportIssuedBy)}`)}
    ${p(`${esc(data.employeePassportIssuedAt)} код подразделения ${esc(data.employeePassportCode)}`)}
    ${p(`Адрес регистрации: ${esc(data.employeeRegistration)}`)}

    <div class="sign-row">
      <div>
        <div>Работодатель: <span class="line"></span> / ${esc(data.representativeInitials)}</div>
        <div class="muted">(место для подписи / инициалы уполномоченного лица)</div>
      </div>
      <div>
        <div>Работник: <span class="line"></span> / ${esc(data.employeeInitials)}</div>
        <div class="muted">(место для подписи / инициалы работника)</div>
      </div>
    </div>

    <div class="sign-row" style="margin-top:12px;">
      <div class="muted">С Должностной инструкцией, Правилами внутреннего трудового распорядка Работник ознакомлен:</div>
      <div><span class="line"></span> / ${esc(data.employeeInitials)}</div>
    </div>
    <div class="sign-row" style="margin-top:8px;">
      <div class="muted">Экземпляр Трудового договора получил</div>
      <div><span class="line"></span> / ${esc(data.employeeInitials)}</div>
    </div>
    <div class="muted" style="margin-top:4px;">Подпись Работника: <span class="line"></span></div>
  </div>
</body>
</html>`;
    };
    const handlePrint = async (row)=>{
        try {
            const [contract, orgs, individuals, accounts] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/contracts/${row.id}`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])("/api/organizations"),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])("/api/individuals"),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])("/api/accounts")
            ]);
            const orgMap = new Map();
            (orgs ?? []).forEach((o)=>orgMap.set(o.id, o));
            const indMap = new Map();
            (individuals ?? []).forEach((i)=>indMap.set(i.id, i));
            const accMap = new Map();
            (accounts ?? []).forEach((a)=>accMap.set(a.id, a));
            const org = contract?.organization_id ? orgMap.get(contract.organization_id) : undefined;
            const repr = contract?.representative_id ? indMap.get(contract.representative_id) : undefined;
            const employee = contract?.employee_id ? indMap.get(contract.employee_id) : undefined;
            const accountIdRaw = org?.account_id ?? contract?.organization_account_id;
            const accountId = accountIdRaw !== undefined && accountIdRaw !== null ? typeof accountIdRaw === "string" ? accountIdRaw.trim() ? Number(accountIdRaw) : undefined : accountIdRaw : undefined;
            const account = accountId ? accMap.get(accountId) : undefined;
            const reprName = repr ? [
                repr.last_name,
                repr.first_name,
                repr.patronymic
            ].filter(Boolean).join(" ") : contract?.representative_name ?? row.representative ?? "";
            const employeeName = employee ? [
                employee.last_name,
                employee.first_name,
                employee.patronymic
            ].filter(Boolean).join(" ") : contract?.employee_name ?? row.employee ?? "";
            const employeePassport = employee ? [
                employee.passport_series,
                employee.passport_number
            ].filter(Boolean).join(" ") : contract?.employee_passport_series && contract?.employee_passport_number ? `${contract.employee_passport_series} ${contract.employee_passport_number}` : row.employeePassport ?? "";
            const pickIssuedDate = (src)=>src?.passport_issued_date ?? src?.passport_issued_at ?? src?.passport_issue_date ?? src?.passport_issued ?? src?.employee_passport_issued_date ?? src?.employee_passport_issued_at ?? src?.employee_passport_issue_date ?? "";
            const pickIssuedCode = (src)=>src?.passport_issued_department_code ?? src?.passport_division_code ?? src?.passport_department_code ?? src?.passport_code ?? src?.employee_passport_issued_department_code ?? src?.employee_passport_division_code ?? "";
            const passportIssuedAt = pickIssuedDate(employee) || pickIssuedDate(contract) || pickIssuedDate(row);
            const passportIssuedBy = employee?.passport_issued_by ?? contract?.employee_passport_issued_by ?? "";
            const passportCode = pickIssuedCode(employee) || pickIssuedCode(contract) || pickIssuedCode(row);
            const printable = {
                contractNumber: contract?.number ?? row.number,
                contractDate: asHumanDate(contract?.conclusion_date ?? row.conclusionDate),
                city: contract?.city ?? row.city ?? "",
                employerName: org?.title ?? contract?.organization_name ?? row.organization ?? "",
                employerAddress: org?.address ?? contract?.organization_address ?? "",
                employerInn: org?.inn ?? contract?.organization_inn ?? "",
                employerKpp: org?.kpp ?? contract?.organization_kpp ?? "",
                employerOkpo: org?.okpo ?? "",
                employerAccount: account?.number ?? "",
                employerBank: account?.bank ?? "",
                employerBic: account?.bic ?? "",
                representative: reprName,
                representativePosition: contract?.representative_position ?? row.representativePosition ?? "",
                representativeBasis: contract?.basis ?? row.basis ?? "",
                representativeInitials: initials(reprName),
                employee: employeeName,
                employeeInitials: initials(employeeName),
                employeePassport,
                employeePassportIssuedBy: passportIssuedBy,
                employeePassportIssuedAt: asHumanDate(passportIssuedAt),
                employeePassportCode: passportCode,
                employeeRegistration: employee?.registration_address ?? contract?.employee_registration_address ?? "",
                position: contract?.position_title ?? row.position ?? "",
                department: contract?.department_title ?? row.department ?? "",
                workPlace: contract?.place ?? row.place ?? "",
                workStart: asIso(contract?.work_date_from ?? row.workDateFrom),
                workEnd: asIso(contract?.work_date_to ?? row.workDateTo),
                conditionsClass: contract?.conditions_class ? String(contract.conditions_class) : row.conditionsClass ?? "",
                salary: contract?.salary ? String(contract.salary) : row.salary ?? "",
                probationMonths: contract?.probation_months ? String(contract.probation_months) : row.probationMonths ?? "",
                paidLeaveDays: contract?.paid_leave_days ? String(contract.paid_leave_days) : row.paidLeaveDays ?? "",
                workHoursFrom: contract?.work_hours_from ?? row.workHoursFrom ?? "",
                workHoursTo: contract?.work_hours_to ?? row.workHoursTo ?? "",
                breakFrom: contract?.break_from ?? row.breakFrom ?? "",
                breakTo: contract?.break_to ?? row.breakTo ?? ""
            };
            const html = buildPrintHtml(printable);
            const blob = new Blob([
                html
            ], {
                type: "text/html"
            });
            const url = URL.createObjectURL(blob);
            const win = window.open(url, "_blank", "noopener,noreferrer,width=1200,height=900");
            if (!win) {
                URL.revokeObjectURL(url);
                return;
            }
            setTimeout(()=>URL.revokeObjectURL(url), 1000);
        } catch (err) {
            console.error("Failed to prepare contract print", err);
        }
    };
    const handleDelete = async (row)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/contracts/${row.id}`);
        } catch (err) {
            console.error("Failed to delete contract", err);
        }
        setRows((prev)=>prev.filter((item)=>item.id !== row.id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$list$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListPage"], {
        title: "Трудовые договоры",
        description: "Номера договоров, даты заключения, организация и сотрудник",
        columns: [
            {
                key: "number",
                label: "Номер"
            },
            {
                key: "conclusionDate",
                label: "Дата заключения"
            },
            {
                key: "organization",
                label: "Организация"
            },
            {
                key: "employee",
                label: "Сотрудник"
            }
        ],
        rows: rows,
        createHref: "/contracts/new",
        actions: {
            showEdit: true,
            showDelete: true,
            showPrint: true,
            onPrint: handlePrint,
            editHref: (row)=>`/contracts/${row.id}/edit`,
            onDelete: (row)=>handleDelete(row)
        }
    }, void 0, false, {
        fileName: "[project]/app/contracts/ContractsClient.tsx",
        lineNumber: 385,
        columnNumber: 5
    }, this);
}
_s(ContractsClient, "NZcN2aij2DACfxixDXkVCwsEswI=");
_c = ContractsClient;
var _c;
__turbopack_context__.k.register(_c, "ContractsClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_b81583db._.js.map