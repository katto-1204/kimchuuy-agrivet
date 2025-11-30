"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Plus, Trash2, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { mockSuppliers, mockProducts } from "@/lib/mock-data"

interface DeliveryItem {
  id: string
  product_id: string
  quantity: number
  unit_cost: number
}

export default function RecordDeliveryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    supplier_id: "",
    delivery_date: new Date().toISOString().split("T")[0],
    reference_number: "",
    notes: "",
  })
  const [items, setItems] = useState<DeliveryItem[]>([{ id: "1", product_id: "", quantity: 1, unit_cost: 0 }])

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        product_id: "",
        quantity: 1,
        unit_cost: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof DeliveryItem, value: string | number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unit_cost, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Delivery data:", { ...formData, items, totalAmount })

    setIsLoading(false)
    router.push("/suppliers")
  }

  return (
    <ProtectedLayout>
      <Header title="Record Delivery" subtitle="Record a new stock-in delivery" />

      <div className="p-6">
        <div className="mb-6">
          <Link href="/suppliers">
            <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Supplier *</Label>
                  <Select
                    value={formData.supplier_id}
                    onValueChange={(v) => setFormData((prev) => ({ ...prev, supplier_id: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers
                        .filter((s) => s.is_active)
                        .map((supplier) => (
                          <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Delivery Date *</Label>
                  <Input
                    id="delivery_date"
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, delivery_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference_number">Reference / Invoice Number</Label>
                  <Input
                    id="reference_number"
                    placeholder="e.g., INV-2024-001"
                    value={formData.reference_number}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reference_number: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Items */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Delivery Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Cost (₱)</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const subtotal = item.quantity * item.unit_cost
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Select value={item.product_id} onValueChange={(v) => updateItem(item.id, "product_id", v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockProducts
                                  .filter((p) => !p.is_archived)
                                  .map((product) => (
                                    <SelectItem key={product.product_id} value={product.product_id.toString()}>
                                      {product.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unit_cost}
                              onChange={(e) => updateItem(item.id, "unit_cost", Number.parseFloat(e.target.value) || 0)}
                              className="w-28"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              disabled={items.length === 1}
                              className="text-danger hover:text-danger"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4 pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm text-muted">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Link href="/suppliers">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white gap-2"
              disabled={isLoading || !formData.supplier_id || items.some((i) => !i.product_id)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Delivery
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  )
}
