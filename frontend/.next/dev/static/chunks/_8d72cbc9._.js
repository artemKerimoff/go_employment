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
"[project]/app/dismissal-orders/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DismissalOrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$list$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/list-page.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function DismissalOrdersPage() {
    _s();
    const [rows, setRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [orgs, setOrgs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DismissalOrdersPage.useEffect": ()=>{
            Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])("/api/dismissal-orders"),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])("/api/organizations")
            ]).then({
                "DismissalOrdersPage.useEffect": ([orders, orgs])=>{
                    const orgMap = new Map();
                    (orgs ?? []).forEach({
                        "DismissalOrdersPage.useEffect": (o)=>orgMap.set(o.id, o)
                    }["DismissalOrdersPage.useEffect"]);
                    setOrgs(orgs ?? []);
                    const mapped = (orders ?? []).map({
                        "DismissalOrdersPage.useEffect.mapped": (h)=>({
                                id: h.id,
                                number: h.number ?? "",
                                preparationDate: h.preparation_date ?? "",
                                organization: h.organization_title ?? (h.organization_id ? orgMap.get(h.organization_id)?.title ?? "" : ""),
                                organizationId: h.organization_id,
                                organizationOkpo: h.organization_id ? orgMap.get(h.organization_id)?.okpo ?? "" : ""
                            })
                    }["DismissalOrdersPage.useEffect.mapped"]);
                    setRows(mapped);
                }
            }["DismissalOrdersPage.useEffect"]).catch({
                "DismissalOrdersPage.useEffect": (err)=>{
                    console.error("Failed to load dismissal orders", err);
                    setRows([]);
                }
            }["DismissalOrdersPage.useEffect"]);
        }
    }["DismissalOrdersPage.useEffect"], []);
    const buildPrintHtml = (order, bodyRows)=>{
        const esc = (v)=>v === undefined || v === "" ? "—" : String(v);
        const rowsHtml = (bodyRows.length ? bodyRows : [
            {}
        ]).map((r)=>`
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
    const handlePrint = async (row)=>{
        const parseDate = (value)=>{
            if (value === undefined || value === null || value === "") return "—";
            if (typeof value === "string" && value.includes("-")) return value;
            const num = typeof value === "number" ? value : typeof value === "string" && /^\d+$/.test(value) ? Number(value) : NaN;
            if (Number.isNaN(num)) return String(value);
            const ms = num > 1e12 ? num : num * 1000;
            const d = new Date(ms);
            return Number.isNaN(d.getTime()) ? String(value) : d.toISOString().slice(0, 10);
        };
        try {
            const [header, bodies, contracts, individuals, departments, positions] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/dismissal-orders/${row.id}`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/dismissal-orders/bodies?header_id=${row.id}`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/contracts`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/individuals`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/departments`),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiGet"])(`/api/positions`)
            ]);
            const contractMap = new Map();
            (contracts ?? []).forEach((c)=>contractMap.set(c.id, c));
            const indivMap = new Map();
            (individuals ?? []).forEach((i)=>indivMap.set(i.id, i));
            const deptMap = new Map();
            (departments ?? []).forEach((d)=>deptMap.set(d.id, d));
            const posMap = new Map();
            (positions ?? []).forEach((p)=>posMap.set(p.id, p));
            const bodyRows = (bodies ?? []).map((b)=>{
                const c = b.employment_contract_id ? contractMap.get(b.employment_contract_id) : undefined;
                const ind = c?.employee_id ? indivMap.get(c.employee_id) : undefined;
                const empName = b.employee_name ?? (ind ? [
                    ind.last_name,
                    ind.first_name,
                    ind.patronymic
                ].filter(Boolean).join(" ") : undefined) ?? c?.employee_name ?? "";
                const deptTitle = b.department_title ?? (b.department_id ? deptMap.get(b.department_id)?.title : undefined) ?? (c?.department_id ? deptMap.get(c.department_id)?.title : undefined) ?? c?.department_title ?? "";
                const posTitle = b.position_title ?? (b.position_id ? posMap.get(b.position_id)?.title : undefined) ?? (c?.position_id ? posMap.get(c.position_id)?.title : undefined) ?? c?.position_title ?? "";
                const contractNumber = b.contract_number ?? c?.number ?? "";
                const contractDate = parseDate(b.contract_date ?? c?.conclusion_date);
                const docCombined = [
                    b.doc_number,
                    parseDate(b.doc_date)
                ].filter((v)=>v && v !== "—").join(", ") || "—";
                return {
                    employee: empName,
                    personnelNumber: b.personnel_number ?? c?.personnel_number ?? "",
                    department: deptTitle,
                    position: posTitle,
                    contractNumber,
                    contractDate,
                    terminationDate: parseDate(b.dismissal_date),
                    ground: b.dismissal_ground ?? "",
                    doc: docCombined
                };
            });
            const org = orgs.find((o)=>o.id === (header?.organization_id ?? row.organizationId));
            const printable = {
                ...row,
                number: header?.number ?? row.number,
                preparationDate: header?.preparation_date ?? row.preparationDate,
                organization: header?.organization_title ?? row.organization ?? "",
                organizationId: header?.organization_id ?? row.organizationId,
                organizationOkpo: org?.okpo ?? row.organizationOkpo ?? ""
            };
            const html = buildPrintHtml(printable, bodyRows);
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
            console.error("Failed to prepare print", err);
        }
    };
    const handleDelete = async (row)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiDelete"])(`/api/dismissal-orders/${row.id}`);
        } catch (err) {
            console.error("Failed to delete dismissal order", err);
        }
        setRows((prev)=>prev.filter((item)=>item.id !== row.id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$list$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ListPage"], {
        title: "Приказы об увольнении",
        description: "Список приказов (данные из header)",
        columns: [
            {
                key: "number",
                label: "Номер"
            },
            {
                key: "preparationDate",
                label: "Дата подготовки"
            },
            {
                key: "organization",
                label: "Организация"
            }
        ],
        rows: rows,
        createHref: "/dismissal-orders/new",
        actions: {
            showEdit: true,
            showDelete: true,
            showPrint: true,
            onPrint: (row)=>{
                void handlePrint(row);
            },
            editHref: (row)=>`/dismissal-orders/${row.id}/edit`,
            onDelete: (row)=>handleDelete(row)
        }
    }, void 0, false, {
        fileName: "[project]/app/dismissal-orders/page.tsx",
        lineNumber: 318,
        columnNumber: 5
    }, this);
}
_s(DismissalOrdersPage, "3v2sOSLJ+RWsjUJE+9XEPbaazMM=");
_c = DismissalOrdersPage;
var _c;
__turbopack_context__.k.register(_c, "DismissalOrdersPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_8d72cbc9._.js.map