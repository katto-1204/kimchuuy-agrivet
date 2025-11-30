"use client"

import { use } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Edit, Phone, Mail, MapPin, Truck, Calendar } from "lucide-react"
import Link from "next/link"
import { mockSuppliers, mockDeliveries } from "@/lib/mock-data"

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supplier = mockSuppliers.find((s) => s.supplier_id === Number.parseInt(id))
  const supplierDeliveries = mockDeliveries.filter((d) => d.supplier_id === Number.parseInt(id))

  if (!supplier) {
    return (
      <ProtectedLayout>
        <Header title="Supplier Not Found" />
        <div className="p-6 text-center">
          <p>Supplier not found.</p>
          <Link href="/suppliers">
            <Button className="mt-4 bg-primary text-white">Back to Suppliers</Button>
          </Link>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <Header title="Supplier Details" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/suppliers">
            <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </Button>
          </Link>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Edit className="h-4 w-4" />
            Edit Supplier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{supplier.name.charAt(0)}</span>
                </div>
                <div>
                  <CardTitle>{supplier.name}</CardTitle>
                  <Badge className={supplier.is_active ? "bg-success text-white mt-1" : "bg-muted mt-1"}>
                    {supplier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {supplier.contact_person && (
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Contact Person</p>
                  <p className="font-medium">{supplier.contact_person}</p>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted" />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted" />
                  <span>{supplier.email}</span>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted mt-0.5" />
                  <span>{supplier.address}</span>
                </div>
              )}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted">
                  Added on{" "}
                  {new Date(supplier.created_at).toLocaleDateString("en-PH", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery History */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Delivery History</CardTitle>
              <Link href={`/suppliers/delivery?supplier=${id}`}>
                <Button size="sm" className="bg-primary text-white gap-2">
                  <Truck className="h-4 w-4" />
                  New Delivery
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {supplierDeliveries.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Recorded By</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supplierDeliveries.map((delivery) => (
                      <TableRow key={delivery.delivery_id}>
                        <TableCell className="font-medium">{delivery.reference_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted" />
                            {new Date(delivery.delivery_date).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{delivery.user_name}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ₱{delivery.total_amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted">
                  <Truck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No deliveries recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
