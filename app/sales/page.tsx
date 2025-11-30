"use client"

import { useEffect, useState, useCallback } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Search, Plus, Eye, Trash2, FileText } from "lucide-react"
import type { Sale } from "@/lib/types"

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/sales")
      if (!response.ok) throw new Error("Failed to fetch sales")

      const data = await response.json()
      setSales(data.sales || [])
    } catch (error) {
      console.error("Error fetching sales:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSales()
    // Refresh every 5 seconds for real-time sync
    const interval = setInterval(fetchSales, 5000)
    return () => clearInterval(interval)
  }, [fetchSales])

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSales(sales)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredSales(
        sales.filter(
          (sale) =>
            sale.customer_name?.toLowerCase().includes(query) ||
            sale.user_name?.toLowerCase().includes(query) ||
            sale.reference_number?.toLowerCase().includes(query),
        ),
      )
    }
  }, [searchQuery, sales])

  const handleVoidSale = async () => {
    if (!selectedSaleId) return

    try {
      const response = await fetch(`/api/sales/${selectedSaleId}`, {
        method: "DELETE",
        headers: {
          "X-User-Id": "1", // Replace with actual user ID from auth
        },
      })

      if (!response.ok) throw new Error("Failed to void sale")

      setSales((prev) => prev.filter((s) => s.sale_id !== selectedSaleId))
      setShowDeleteDialog(false)
    } catch (error) {
      console.error("Error voiding sale:", error)
      alert("Failed to void sale")
    }
  }

  const paymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      Cash: "bg-green-100 text-green-800",
      GCash: "bg-blue-100 text-blue-800",
      Maya: "bg-purple-100 text-purple-800",
      "Bank Transfer": "bg-yellow-100 text-yellow-800",
    }
    return colors[method] || "bg-gray-100 text-gray-800"
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sales Records</h1>
            <p className="text-muted mt-1">View and manage all sales transactions</p>
          </div>
          <Button className="bg-primary hover:bg-primary-dark text-white" asChild>
            <a href="/pos">
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </a>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                type="search"
                placeholder="Search by customer, cashier, or reference number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted">Loading sales...</div>
            ) : filteredSales.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No sales found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSales.map((sale) => (
                      <TableRow key={sale.sale_id}>
                        <TableCell className="text-sm">
                          {new Date(sale.sale_date).toLocaleString("en-PH")}
                        </TableCell>
                        <TableCell className="font-mono text-sm">#{sale.sale_id}</TableCell>
                        <TableCell>{sale.customer_name || "Walk-in"}</TableCell>
                        <TableCell className="text-sm">{sale.user_name}</TableCell>
                        <TableCell>
                          <Badge className={paymentMethodColor(sale.payment_method)}>
                            {sale.payment_method}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ₱{sale.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right space-x-2 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-blue-50"
                          >
                            <a href={`/sales/${sale.sale_id}`}>
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50"
                            onClick={() => {
                              setSelectedSaleId(sale.sale_id)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-danger" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Void Sale?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to void this sale? Stock will be restored and the transaction
              will be marked as void.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleVoidSale} className="bg-danger">
            Void Sale
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedLayout>
  )
}
