(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock data for development (replace with MySQL API calls)
__turbopack_context__.s([
    "getExpiringProducts",
    ()=>getExpiringProducts,
    "getLowStockProducts",
    ()=>getLowStockProducts,
    "mockCategories",
    ()=>mockCategories,
    "mockCustomers",
    ()=>mockCustomers,
    "mockDashboardStats",
    ()=>mockDashboardStats,
    "mockDeliveries",
    ()=>mockDeliveries,
    "mockProducts",
    ()=>mockProducts,
    "mockSales",
    ()=>mockSales,
    "mockSuppliers",
    ()=>mockSuppliers,
    "mockUsers",
    ()=>mockUsers
]);
const mockUsers = [
    {
        user_id: 1,
        username: "admin",
        full_name: "System Administrator",
        role: "admin",
        is_active: true,
        created_at: "2024-01-01"
    },
    {
        user_id: 2,
        username: "staff1",
        full_name: "Juan Dela Cruz",
        role: "staff",
        is_active: true,
        created_at: "2024-01-15"
    },
    {
        user_id: 3,
        username: "staff2",
        full_name: "Maria Santos",
        role: "staff",
        is_active: true,
        created_at: "2024-02-01"
    }
];
const mockCategories = [
    {
        category_id: 1,
        name: "Feeds",
        description: "Animal feeds and food products"
    },
    {
        category_id: 2,
        name: "Medicine",
        description: "Veterinary medicines and treatments"
    },
    {
        category_id: 3,
        name: "Vitamins",
        description: "Supplements and vitamins"
    },
    {
        category_id: 4,
        name: "Accessories",
        description: "Pet and farm accessories"
    },
    {
        category_id: 5,
        name: "Others",
        description: "Miscellaneous items"
    }
];
const mockProducts = [
    {
        product_id: 1,
        category_id: 1,
        category_name: "Feeds",
        name: "Premium Dog Food 10kg",
        sku: "FD-001",
        price: 850,
        cost_price: 700,
        stock: 45,
        min_stock: 10,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 2,
        category_id: 1,
        category_name: "Feeds",
        name: "Cat Food Premium 5kg",
        sku: "FD-002",
        price: 520,
        cost_price: 420,
        stock: 32,
        min_stock: 10,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 3,
        category_id: 1,
        category_name: "Feeds",
        name: "Chicken Layer Pellets 25kg",
        sku: "FD-003",
        price: 1200,
        cost_price: 980,
        stock: 8,
        min_stock: 15,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 4,
        category_id: 2,
        category_name: "Medicine",
        name: "Dewormer Tablets (10pcs)",
        sku: "MD-001",
        price: 350,
        cost_price: 280,
        stock: 60,
        min_stock: 20,
        expiry_date: "2025-06-15",
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 5,
        category_id: 2,
        category_name: "Medicine",
        name: "Antibiotics Injectable 50ml",
        sku: "MD-002",
        price: 480,
        cost_price: 380,
        stock: 25,
        min_stock: 10,
        expiry_date: "2025-03-20",
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 6,
        category_id: 2,
        category_name: "Medicine",
        name: "Wound Spray 100ml",
        sku: "MD-003",
        price: 220,
        cost_price: 170,
        stock: 5,
        min_stock: 15,
        expiry_date: "2025-12-31",
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 7,
        category_id: 3,
        category_name: "Vitamins",
        name: "Multi-Vitamin Drops 30ml",
        sku: "VT-001",
        price: 280,
        cost_price: 220,
        stock: 40,
        min_stock: 15,
        expiry_date: "2025-08-10",
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 8,
        category_id: 3,
        category_name: "Vitamins",
        name: "Calcium Supplement 100tabs",
        sku: "VT-002",
        price: 450,
        cost_price: 350,
        stock: 28,
        min_stock: 10,
        expiry_date: "2025-11-25",
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 9,
        category_id: 4,
        category_name: "Accessories",
        name: "Dog Collar Medium",
        sku: "AC-001",
        price: 180,
        cost_price: 120,
        stock: 50,
        min_stock: 10,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 10,
        category_id: 4,
        category_name: "Accessories",
        name: "Pet Carrier Small",
        sku: "AC-002",
        price: 650,
        cost_price: 480,
        stock: 12,
        min_stock: 5,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 11,
        category_id: 4,
        category_name: "Accessories",
        name: "Feeding Bowl Stainless",
        sku: "AC-003",
        price: 150,
        cost_price: 95,
        stock: 3,
        min_stock: 10,
        is_archived: false,
        created_at: "2024-01-01"
    },
    {
        product_id: 12,
        category_id: 5,
        category_name: "Others",
        name: "Pet Shampoo 500ml",
        sku: "OT-001",
        price: 320,
        cost_price: 250,
        stock: 35,
        min_stock: 10,
        is_archived: false,
        created_at: "2024-01-01"
    }
];
const mockSuppliers = [
    {
        supplier_id: 1,
        name: "PhilAgri Supplies Inc.",
        contact_person: "Roberto Garcia",
        phone: "09171234567",
        email: "sales@philagri.com",
        address: "Manila, Philippines",
        is_active: true,
        created_at: "2024-01-01"
    },
    {
        supplier_id: 2,
        name: "VetMed Distributors",
        contact_person: "Anna Reyes",
        phone: "09181234567",
        email: "orders@vetmed.ph",
        address: "Quezon City, Philippines",
        is_active: true,
        created_at: "2024-01-01"
    },
    {
        supplier_id: 3,
        name: "PetWorld Trading",
        contact_person: "Mark Santos",
        phone: "09191234567",
        email: "info@petworld.com",
        address: "Cebu City, Philippines",
        is_active: true,
        created_at: "2024-01-01"
    }
];
const mockCustomers = [
    {
        customer_id: 1,
        name: "Pedro Reyes",
        phone: "09171111111",
        email: "pedro@email.com",
        address: "Brgy. San Jose",
        created_at: "2024-01-10",
        total_purchases: 15420
    },
    {
        customer_id: 2,
        name: "Maria Garcia",
        phone: "09172222222",
        email: "maria@email.com",
        address: "Brgy. Poblacion",
        created_at: "2024-01-15",
        total_purchases: 8750
    },
    {
        customer_id: 3,
        name: "Jose Santos Farm",
        phone: "09173333333",
        email: "jsantos@farm.com",
        address: "Brgy. Bagong Bayan",
        created_at: "2024-02-01",
        total_purchases: 45200
    },
    {
        customer_id: 4,
        name: "Ana Cruz",
        phone: "09174444444",
        email: "ana.cruz@email.com",
        address: "Brgy. Mabini",
        created_at: "2024-02-10",
        total_purchases: 3200
    }
];
const mockSales = [
    {
        sale_id: 1,
        user_id: 2,
        user_name: "Juan Dela Cruz",
        customer_id: 1,
        customer_name: "Pedro Reyes",
        sale_date: "2024-11-30T09:30:00",
        subtotal: 1370,
        discount: 0,
        vat: 164.4,
        total: 1534.4,
        amount_paid: 1600,
        change_amount: 65.6,
        payment_method: "Cash"
    },
    {
        sale_id: 2,
        user_id: 2,
        user_name: "Juan Dela Cruz",
        sale_date: "2024-11-30T10:15:00",
        subtotal: 850,
        discount: 50,
        vat: 96,
        total: 896,
        amount_paid: 896,
        change_amount: 0,
        payment_method: "GCash",
        reference_number: "GC-123456"
    },
    {
        sale_id: 3,
        user_id: 3,
        user_name: "Maria Santos",
        customer_id: 3,
        customer_name: "Jose Santos Farm",
        sale_date: "2024-11-30T11:00:00",
        subtotal: 4800,
        discount: 200,
        vat: 552,
        total: 5152,
        amount_paid: 5200,
        change_amount: 48,
        payment_method: "Cash"
    },
    {
        sale_id: 4,
        user_id: 2,
        user_name: "Juan Dela Cruz",
        sale_date: "2024-11-30T14:20:00",
        subtotal: 520,
        discount: 0,
        vat: 62.4,
        total: 582.4,
        amount_paid: 600,
        change_amount: 17.6,
        payment_method: "Cash"
    },
    {
        sale_id: 5,
        user_id: 3,
        user_name: "Maria Santos",
        customer_id: 2,
        customer_name: "Maria Garcia",
        sale_date: "2024-11-29T16:45:00",
        subtotal: 1100,
        discount: 100,
        vat: 120,
        total: 1120,
        amount_paid: 1120,
        change_amount: 0,
        payment_method: "Maya",
        reference_number: "MY-789012"
    }
];
const mockDeliveries = [
    {
        delivery_id: 1,
        supplier_id: 1,
        supplier_name: "PhilAgri Supplies Inc.",
        user_id: 1,
        user_name: "System Administrator",
        delivery_date: "2024-11-28",
        reference_number: "DEL-2024-001",
        total_amount: 25000,
        created_at: "2024-11-28"
    },
    {
        delivery_id: 2,
        supplier_id: 2,
        supplier_name: "VetMed Distributors",
        user_id: 1,
        user_name: "System Administrator",
        delivery_date: "2024-11-25",
        reference_number: "DEL-2024-002",
        total_amount: 18500,
        created_at: "2024-11-25"
    }
];
const mockDashboardStats = {
    todaySales: 8164.8,
    todayTransactions: 4,
    lowStockCount: 4,
    expiringCount: 2,
    totalProducts: 12,
    totalCustomers: 4
};
function getLowStockProducts() {
    return mockProducts.filter((p)=>p.stock <= p.min_stock && !p.is_archived);
}
function getExpiringProducts() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return mockProducts.filter((p)=>{
        if (!p.expiry_date || p.is_archived) return false;
        return new Date(p.expiry_date) <= thirtyDaysFromNow;
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/auth-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Check for stored session
            const storedUser = localStorage.getItem("kimchuyy_user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (username, password)=>{
        // Mock authentication - replace with actual API call to your MySQL backend
        const foundUser = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockUsers"].find((u)=>u.username === username && u.is_active);
        // For demo: any password works with valid username
        // In production: validate against password_hash in MySQL
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem("kimchuyy_user", JSON.stringify(foundUser));
            return true;
        }
        return false;
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("kimchuyy_user");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            logout,
            isLoading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 48,
        columnNumber: 10
    }, this);
}
_s(AuthProvider, "YajQB7LURzRD+QP5gw0+K2TZIWA=");
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_2fdeb4fe._.js.map