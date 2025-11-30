"use client"

import type React from "react"

import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { mockDashboardStats, getLowStockProducts, getExpiringProducts, mockSales } from "@/lib/mock-data"

export default function DashboardPage() {
  const stats = mockDashboardStats
  const lowStockProducts = getLowStockProducts()
  const expiringProducts = getExpiringProducts()
  const recentSales = mockSales.slice(0, 5)

  return (
    <ProtectedLayout>
      <Header title="Dashboard" subtitle="Welcome back! Here's your store overview." />

      <div className="p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Sales"
            value={`₱${stats.todaySales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend="+12.5%"
            trendUp={true}
            color="primary"
          />
          <StatsCard
            title="Transactions"
            value={stats.todayTransactions.toString()}
            icon={ShoppingCart}
            trend="+8.2%"
            trendUp={true}
            color="success"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats.lowStockCount.toString()}
            icon={AlertTriangle}
            color="warning"
            href="/inventory?filter=low-stock"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringCount.toString()}
            icon={Clock}
            color="danger"
            href="/inventory?filter=expiring"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            title="New Sale"
            description="Process a transaction"
            icon={ShoppingCart}
            href="/pos"
            color="primary"
          />
          <QuickActionCard
            title="Add Product"
            description="Add new inventory"
            icon={Package}
            href="/inventory/add"
            color="success"
          />
          <QuickActionCard
            title="Stock In"
            description="Record delivery"
            icon={TrendingUp}
            href="/suppliers/delivery"
            color="warning"
          />
          <QuickActionCard
            title="View Reports"
            description="Sales & inventory"
            icon={DollarSign}
            href="/reports"
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Sales</CardTitle>
              <Link href="/reports/sales">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale.sale_id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {sale.customer_name || "Walk-in Customer"}
                        </p>
                        <p className="text-xs text-muted">
                          {new Date(sale.sale_date).toLocaleString("en-PH", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          • {sale.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">
                        ₱{sale.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted">{sale.user_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Inventory Alerts</CardTitle>
              <Link href="/inventory">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted">Low Stock Alert</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-warning">{product.stock} left</p>
                      <p className="text-xs text-muted">Min: {product.min_stock}</p>
                    </div>
                  </div>
                ))}
                {expiringProducts.slice(0, 2).map((product) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 bg-danger/10 rounded-lg border border-danger/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-danger/20 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-danger" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted">Expiring Soon</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-danger">
                        {new Date(product.expiry_date!).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-xs text-muted">{product.stock} in stock</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary-dark text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Products</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalProducts}</p>
                </div>
                <Package className="h-12 w-12 text-white/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">Total Customers</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalCustomers}</p>
                </div>
                <Users className="h-12 w-12 text-white/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">This Month</p>
                  <p className="text-3xl font-bold mt-1">₱124.5K</p>
                </div>
                <TrendingUp className="h-12 w-12 text-white/30" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color,
  href,
}: {
  title: string
  value: string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  color: "primary" | "success" | "warning" | "danger"
  href?: string
}) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
  }

  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trendUp ? "text-success" : "text-danger"}`}>
                {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{trend} vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color,
}: {
  title: string
  description: string
  icon: React.ElementType
  href: string
  color: "primary" | "success" | "warning"
}) {
  const colorClasses = {
    primary: "bg-primary hover:bg-primary-dark",
    success: "bg-success hover:bg-green-600",
    warning: "bg-warning hover:bg-amber-600",
  }

  return (
    <Link href={href}>
      <Card className={`${colorClasses[color]} text-white transition-colors cursor-pointer`}>
        <CardContent className="p-4 flex items-center gap-3">
          <Icon className="h-8 w-8 text-white/80" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-xs text-white/70">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
