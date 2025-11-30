// Type definitions for Kimchuyy Agrivet Supply System

export interface User {
  user_id: number
  username: string
  full_name: string
  role: "admin" | "staff"
  is_active: boolean
  created_at: string
}

export interface Category {
  category_id: number
  name: string
  description?: string
}

export interface Product {
  product_id: number
  category_id: number
  category_name?: string
  name: string
  description?: string
  sku?: string
  price: number
  cost_price?: number
  stock: number
  min_stock: number
  expiry_date?: string
  is_archived: boolean
  created_at: string
}

export interface Supplier {
  supplier_id: number
  name: string
  contact_person?: string
  phone?: string
  email?: string
  address?: string
  is_active: boolean
  created_at: string
}

export interface Delivery {
  delivery_id: number
  supplier_id: number
  supplier_name?: string
  user_id: number
  user_name?: string
  delivery_date: string
  reference_number?: string
  notes?: string
  total_amount: number
  items?: DeliveryItem[]
  created_at: string
}

export interface DeliveryItem {
  item_id: number
  delivery_id: number
  product_id: number
  product_name?: string
  quantity: number
  unit_cost: number
}

export interface Customer {
  customer_id: number
  name: string
  phone?: string
  email?: string
  address?: string
  created_at: string
  total_purchases?: number
}

export interface Sale {
  sale_id: number
  user_id: number
  user_name?: string
  customer_id?: number
  customer_name?: string
  sale_date: string
  subtotal: number
  discount: number
  vat: number
  total: number
  amount_paid: number
  change_amount: number
  payment_method: "Cash" | "GCash" | "Maya" | "Bank Transfer"
  reference_number?: string
  items?: SaleItem[]
}

export interface SaleItem {
  sale_item_id: number
  sale_id: number
  product_id: number
  product_name?: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface DashboardStats {
  todaySales: number
  todayTransactions: number
  lowStockCount: number
  expiringCount: number
  totalProducts: number
  totalCustomers: number
}

export interface AuditLog {
  log_id: number
  user_id: number
  user_name?: string
  action: string
  table_name: string
  record_id: number
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  created_at: string
}
