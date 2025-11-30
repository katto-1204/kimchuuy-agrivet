"use client"

import { useEffect, useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Archive, Package, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams() as { id?: string }
  const id = params?.id || ''
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const data = await res.json()
        if (mounted) setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (id) load()
    return () => {
      mounted = false
    }
  }, [id])

  if (loading) {
    return (
      <ProtectedLayout>
        <Header title="Loading..." />
      </ProtectedLayout>
    )
  }

  if (!product) {
    return (
      <ProtectedLayout>
        <Header title="Product Not Found" />
        <div className="p-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted" />
              <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
              <p className="text-muted mb-4">The product you're looking for doesn't exist.</p>
              <Link href="/inventory">
                <Button className="bg-primary text-white">Back to Inventory</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </ProtectedLayout>
    )
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { text: "Out of Stock", color: "destructive" as const }
    if (product.stock <= product.min_stock) return { text: "Low Stock", color: "default" as const }
    return { text: "In Stock", color: "default" as const }
  }

  const stockStatus = getStockStatus()

  return (
    <ProtectedLayout>
      <Header title="Product Details" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/inventory">
            <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
          <div className="flex gap-2">
            <Link href={`/inventory/${id}/edit`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" className="gap-2 text-danger hover:text-danger bg-transparent">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <p className="text-muted mt-1">SKU: {product.sku || "N/A"}</p>
                </div>
                <Badge
                  variant={stockStatus.color}
                  className={
                    stockStatus.text === "In Stock"
                      ? "bg-success text-white"
                      : stockStatus.text === "Low Stock"
                        ? "bg-warning text-white"
                        : ""
                  }
                >
                  {stockStatus.text}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted mb-2">Description</h3>
                <p className="text-foreground">{product.description || "No description available."}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted">Category</p>
                  <p className="font-semibold text-foreground">{product.category_name}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted">Price</p>
                  <p className="font-semibold text-primary">
                    ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted">Cost Price</p>
                  <p className="font-semibold text-foreground">
                    {product.cost_price
                      ? `₱${product.cost_price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`
                      : "N/A"}
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted">Profit Margin</p>
                  <p className="font-semibold text-success">
                    {product.cost_price
                      ? `${(((product.price - product.cost_price) / product.price) * 100).toFixed(1)}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stock Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                  <div>
                    <p className="text-sm text-muted">Current Stock</p>
                    <p className="text-3xl font-bold text-primary">{product.stock}</p>
                  </div>
                  <Package className="h-10 w-10 text-primary/50" />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-sm text-muted">Minimum Stock Level</span>
                  <span className="font-medium">{product.min_stock}</span>
                </div>
                {product.expiry_date && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm text-muted">Expiry Date</span>
                    <span className="font-medium">
                      {new Date(product.expiry_date).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/suppliers/delivery?product=${id}`} className="block">
                  <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                    <TrendingUp className="h-4 w-4 text-success" />
                    Stock In (Add Delivery)
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" disabled>
                  <TrendingDown className="h-4 w-4 text-danger" />
                  Adjust Stock
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
