"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Printer, Trash2 } from "lucide-react"
import Link from "next/link"
import type { Sale } from "@/lib/types"

interface SaleDetail extends Sale {
  items: any[]
  user_name: string
  customer_name: string
}

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [sale, setSale] = useState<SaleDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/sales/${id}`)
        if (!response.ok) throw new Error("Failed to fetch sale")

        const data = await response.json()
        setSale(data.sale)
      } catch (error) {
        console.error("Error fetching sale:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSale()
  }, [id])

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12 text-muted">Loading...</div>
      </ProtectedLayout>
    )
  }

  if (!sale) {
    return (
      <ProtectedLayout>
        <div className="text-center py-12 text-muted">Sale not found</div>
      </ProtectedLayout>
    )
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
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/sales">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sale #{sale.sale_id}</h1>
            <p className="text-muted mt-1">
              {new Date(sale.sale_date).toLocaleString("en-PH")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="col-span-2 space-y-6">
            {/* Transaction Info */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted">Customer</p>
                    <p className="font-semibold text-foreground">
                      {sale.customer_name || "Walk-in Customer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Cashier</p>
                    <p className="font-semibold text-foreground">{sale.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Payment Method</p>
                    <Badge className={paymentMethodColor(sale.payment_method)}>
                      {sale.payment_method}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Reference Number</p>
                    <p className="font-mono text-foreground">
                      {sale.reference_number || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
              <CardHeader>
                <CardTitle>Items Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-muted">Product</th>
                        <th className="text-center py-2 px-3 text-muted">Qty</th>
                        <th className="text-right py-2 px-3 text-muted">Unit Price</th>
                        <th className="text-right py-2 px-3 text-muted">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(sale as any).items?.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-3">
                            <div>
                              <p className="font-medium text-foreground">
                                {item.product_name}
                              </p>
                              <p className="text-xs text-muted">{item.sku}</p>
                            </div>
                          </td>
                          <td className="text-center py-3 px-3 text-foreground">
                            {item.quantity}
                          </td>
                          <td className="text-right py-3 px-3 text-foreground">
                            ₱
                            {item.unit_price.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="text-right py-3 px-3 font-semibold text-foreground">
                            ₱
                            {item.subtotal.toLocaleString("en-PH", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-foreground">
                    ₱
                    {sale.subtotal.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">Discount</span>
                    <span className="text-danger">
                      -₱
                      {sale.discount.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted">VAT (12%)</span>
                  <span className="text-foreground">
                    ₱
                    {sale.vat.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ₱
                    {sale.total.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted">Amount Paid</span>
                  <span className="text-foreground">
                    ₱
                    {sale.amount_paid.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Change</span>
                  <span className="text-success font-semibold">
                    ₱
                    {sale.change_amount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
