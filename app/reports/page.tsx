"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
} from "lucide-react"
import { mockSales, mockProducts, mockDeliveries } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const COLORS = ["#5DB7F0", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [reportType, setReportType] = useState("daily")

  // Calculate stats
  const totalSales = mockSales.reduce((sum, s) => sum + s.total, 0)
  const totalTransactions = mockSales.length
  const avgTransaction = totalSales / totalTransactions

  // Sales by payment method
  const salesByPayment = mockSales.reduce(
    (acc, sale) => {
      acc[sale.payment_method] = (acc[sale.payment_method] || 0) + sale.total
      return acc
    },
    {} as Record<string, number>,
  )

  const paymentChartData = Object.entries(salesByPayment).map(([name, value]) => ({ name, value }))

  // Daily sales data (mock)
  const dailySalesData = [
    { day: "Mon", sales: 8500 },
    { day: "Tue", sales: 12300 },
    { day: "Wed", sales: 9800 },
    { day: "Thu", sales: 15600 },
    { day: "Fri", sales: 18200 },
    { day: "Sat", sales: 22500 },
    { day: "Sun", sales: 14800 },
  ]

  // Top selling products (mock)
  const topProducts = mockProducts
    .slice(0, 5)
    .map((p, i) => ({ ...p, sold: Math.floor(Math.random() * 50) + 10 }))
    .sort((a, b) => b.sold - a.sold)

  // Low stock products
  const lowStockProducts = mockProducts.filter((p) => p.stock <= p.min_stock && !p.is_archived)

  return (
    <ProtectedLayout>
      <Header title="Reports" subtitle="View sales and inventory reports" />

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total Sales</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₱{totalSales.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+15.3% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8.2% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Avg. Transaction</p>
                  <p className="text-2xl font-bold text-foreground">
                    ₱{avgTransaction.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-danger">
                    <TrendingDown className="h-3 w-3" />
                    <span>-2.1% vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Low Stock Items</p>
                  <p className="text-2xl font-bold text-foreground">{lowStockProducts.length}</p>
                  <p className="text-xs text-warning mt-1">Needs attention</p>
                </div>
                <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-danger" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="w-40"
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                  className="w-40"
                />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Report</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Sales Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="day" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip
                          formatter={(value: number) => [`₱${value.toLocaleString()}`, "Sales"]}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
                        />
                        <Bar dataKey="sales" fill="#5DB7F0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {paymentChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {paymentChartData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{item.name}</span>
                        </div>
                        <span className="font-medium">₱{item.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sales Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSales.map((sale) => (
                      <TableRow key={sale.sale_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted" />
                            {new Date(sale.sale_date).toLocaleString("en-PH", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{sale.sale_id}</TableCell>
                        <TableCell>{sale.customer_name || "Walk-in"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.payment_method}</Badge>
                        </TableCell>
                        <TableCell>{sale.user_name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ₱{sale.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Selling Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={product.product_id} className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-amber-600"
                                  : "bg-muted"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted">{product.category_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{product.sold} sold</p>
                          <p className="text-xs text-success">₱{(product.sold * product.price).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle>Low Stock Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.product_id}
                        className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted">{product.category_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-warning">{product.stock} left</p>
                          <p className="text-xs text-muted">Min: {product.min_stock}</p>
                        </div>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <p className="text-center text-muted py-8">All products are well stocked</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockDeliveries.map((delivery) => (
                      <TableRow key={delivery.delivery_id}>
                        <TableCell>
                          {new Date(delivery.delivery_date).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="font-mono">{delivery.reference_number}</TableCell>
                        <TableCell>{delivery.supplier_name}</TableCell>
                        <TableCell>{delivery.user_name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ₱{delivery.total_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  )
}
