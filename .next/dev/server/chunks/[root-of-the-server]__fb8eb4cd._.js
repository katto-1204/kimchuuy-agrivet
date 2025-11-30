module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/timers [external] (timers, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("timers", () => require("timers"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/string_decoder [external] (string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("string_decoder", () => require("string_decoder"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "query",
    ()=>query
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mysql2/promise.js [app-route] (ecmascript)");
;
const pool = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mysql2$2f$promise$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'kimchuyy_agrivet',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
async function query(sql, params) {
    const [rows] = await pool.query(sql, params);
    return rows;
}
const __TURBOPACK__default__export__ = pool;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/sales/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const sql = `
      SELECT 
        s.*,
        u.full_name as user_name,
        c.name as customer_name,
        GROUP_CONCAT(
          JSON_OBJECT(
            'sale_item_id', si.sale_item_id,
            'product_id', si.product_id,
            'quantity', si.quantity,
            'unit_price', si.unit_price,
            'subtotal', si.subtotal,
            'product_name', p.name,
            'sku', p.sku
          ) SEPARATOR ','
        ) as items_json
      FROM sales s
      LEFT JOIN users u ON s.user_id = u.user_id
      LEFT JOIN customers c ON s.customer_id = c.customer_id
      LEFT JOIN sale_items si ON s.sale_id = si.sale_id
      LEFT JOIN products p ON si.product_id = p.product_id
      GROUP BY s.sale_id
      ORDER BY s.sale_date DESC
      LIMIT 100
    `;
        const results = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])(sql, []);
        // Parse items_json back to array
        const sales = results.map((sale)=>{
            const parsed = {
                ...sale,
                items: sale.items_json ? JSON.parse(`[${sale.items_json}]`) : []
            };
            delete parsed.items_json;
            return parsed;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            sales
        });
    } catch (error) {
        console.error("GET /api/sales error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch sales"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { user_id, customer_id, items, discount = 0, vat, total, amount_paid, change_amount, payment_method, reference_number } = body;
        if (!items || items.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Cart cannot be empty"
            }, {
                status: 400
            });
        }
        if (!user_id || !payment_method) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        // Calculate subtotal from items
        let subtotal = 0;
        const itemsWithPrice = [];
        for (const item of items){
            const productResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])("SELECT * FROM products WHERE product_id = ?", [
                item.product_id
            ]);
            const products = productResult;
            if (products.length === 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Product ${item.product_id} not found`
                }, {
                    status: 404
                });
            }
            const product = products[0];
            // Check stock
            if (item.quantity > product.stock) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Insufficient stock for ${product.name}`
                }, {
                    status: 400
                });
            }
            const itemSubtotal = product.price * item.quantity;
            subtotal += itemSubtotal;
            itemsWithPrice.push({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: product.price,
                subtotal: itemSubtotal
            });
        }
        // Use a dedicated connection and transaction to ensure consistency
        const conn = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getConnection();
        try {
            await conn.beginTransaction();
            const [saleResult] = await conn.query(`INSERT INTO sales 
          (user_id, customer_id, sale_date, subtotal, discount, vat, total, amount_paid, change_amount, payment_method, reference_number)
          VALUES (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`, [
                user_id,
                customer_id || null,
                subtotal,
                discount,
                vat || (subtotal - discount) * 0.12,
                total || subtotal - discount + (vat || (subtotal - discount) * 0.12),
                amount_paid,
                change_amount,
                payment_method,
                reference_number || null
            ]);
            const saleId = saleResult.insertId;
            // Insert sale items and deduct stock
            for (const item of itemsWithPrice){
                await conn.query(`INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?)`, [
                    saleId,
                    item.product_id,
                    item.quantity,
                    item.unit_price,
                    item.subtotal
                ]);
                // Deduct stock
                const [updateResult] = await conn.query(`UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?`, [
                    item.quantity,
                    item.product_id,
                    item.quantity
                ]);
                // If stock update affected 0 rows, rollback and return error
                if (updateResult.affectedRows === 0) {
                    await conn.rollback();
                    conn.release();
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: `Insufficient stock for product ${item.product_id}`
                    }, {
                        status: 400
                    });
                }
            }
            // Audit log (created_at column exists; don't use non-existent `timestamp`)
            await conn.query(`INSERT INTO audit_logs (user_id, action, table_name, record_id, created_at)
         VALUES (?, 'CREATE', 'sales', ?, NOW())`, [
                user_id,
                saleId
            ]);
            await conn.commit();
            conn.release();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                sale_id: saleId,
                message: "Sale recorded successfully"
            });
        } catch (txErr) {
            try {
                await conn.rollback();
            } catch (rbErr) {
                console.error("Rollback failed:", rbErr);
            }
            conn.release();
            console.error("Transaction error in POST /api/sales:", txErr);
            const errMessage = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : String(txErr?.message || txErr);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: errMessage
            }, {
                status: 500
            });
        }
    } catch (error) {
        console.error("POST /api/sales error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to record sale"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fb8eb4cd._.js.map