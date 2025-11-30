"use client"

import { use } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Phone, Mail, MapPin, ShoppingCart, Calendar } from "lucide-react"
import Link from "next/link"
import { mockCustomers, mockSales } from "@/lib/mock-data"

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const customer = mockCustomers.find((c) => c.customer_id === Number.parseInt(id))
  const customerSales = mockSales.filter((s) => s.customer_id === Number.parseInt(id))

  if (!customer) {
    return (
      <ProtectedLayout>
        <Header title="Customer Not Found" />
        <div className="p-6 text-center">
          <p>Customer not found.</p>
          <Link href="/customers">
            <Button className="mt-4 bg-primary text-white">Back to Customers</Button>
          </Link>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <Header title="Customer Details" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/customers">
            <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Button>
          </Link>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Customer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{customer.name.charAt(0)}</span>
                </div>
                <div>
                  <CardTitle>{customer.name}</CardTitle>
                  <p className="text-sm text-muted">Customer ID: {customer.customer_id}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted mt-0.5" />
                  <span>{customer.address}</span>
                </div>
              )}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-center">
                    <p className="text-2xl font-bold text-primary">
                      ₱{(customer.total_purchases || 0).toLocaleString("en-PH")}
                    </p>
                    <p className="text-xs text-muted">Total Purchases</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-2xl font-bold text-foreground">{customerSales.length}</p>
                    <p className="text-xs text-muted">Transactions</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted">
                Member since{" "}
                {new Date(customer.created_at).toLocaleDateString("en-PH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>

          {/* Purchase History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              {customerSales.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerSales.map((sale) => (
                      <TableRow key={sale.sale_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted" />
                            {new Date(sale.sale_date).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{sale.sale_id}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.payment_method}</Badge>
                        </TableCell>
                        <TableCell>{sale.user_name}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          ₱{sale.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No purchase history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
