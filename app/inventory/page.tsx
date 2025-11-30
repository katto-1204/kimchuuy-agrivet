"use client"

import { useState, useMemo, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreHorizontal, Eye, Edit, Archive, Package, AlertTriangle, Clock } from "lucide-react"
import Link from "next/link"
import { mockCategories } from "@/lib/mock-data"
import type { Product } from "@/lib/types"

// client-side fetched products
type MaybeProduct = Product & { category_name?: string }

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "expiring">("all")
  const [products, setProducts] = useState<MaybeProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        if (mounted) setProducts(data.products || [])
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.is_archived) return false

      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === null || p.category_id === selectedCategory

      let matchesStock = true
      if (stockFilter === "low") {
        matchesStock = p.stock <= p.min_stock && p.stock > 0
      } else if (stockFilter === "out") {
        matchesStock = p.stock === 0
      } else if (stockFilter === "expiring") {
        if (!p.expiry_date) return false
        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
        matchesStock = new Date(p.expiry_date) <= thirtyDaysFromNow
      }

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [products, searchQuery, selectedCategory, stockFilter])

  const stats = {
    total: products.filter((p) => !p.is_archived).length,
    lowStock: products.filter((p) => !p.is_archived && p.stock <= p.min_stock && p.stock > 0).length,
    outOfStock: products.filter((p) => !p.is_archived && p.stock === 0).length,
    expiring: products.filter((p) => {
      if (!p.expiry_date || p.is_archived) return false
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      return new Date(p.expiry_date) <= thirtyDaysFromNow
    }).length,
  }

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    }
    if (product.stock <= product.min_stock) {
      return <Badge className="bg-warning text-white">Low Stock</Badge>
    }
    return <Badge className="bg-success text-white">In Stock</Badge>
  }

  const getExpiryStatus = (product: Product) => {
    if (!product.expiry_date) return null
    const expiryDate = new Date(product.expiry_date)
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    if (expiryDate < today) {
      return <Badge variant="destructive">Expired</Badge>
    }
    if (expiryDate <= thirtyDaysFromNow) {
      return <Badge className="bg-warning text-white">Expiring Soon</Badge>
    }
    return null
  }

  return (
    <ProtectedLayout>
      <Header title="Inventory" subtitle="Manage your product inventory" />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button onClick={() => setStockFilter("all")}>
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer ${stockFilter === "all" ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                  <p className="text-sm text-muted">Total Products</p>
                </div>
              </CardContent>
            </Card>
          </button>
          <button onClick={() => setStockFilter("low")}>
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer ${stockFilter === "low" ? "ring-2 ring-warning" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.lowStock}</p>
                  <p className="text-sm text-muted">Low Stock</p>
                </div>
              </CardContent>
            </Card>
          </button>
          <button onClick={() => setStockFilter("out")}>
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer ${stockFilter === "out" ? "ring-2 ring-danger" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center">
                  <Package className="h-6 w-6 text-danger" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.outOfStock}</p>
                  <p className="text-sm text-muted">Out of Stock</p>
                </div>
              </CardContent>
            </Card>
          </button>
          <button onClick={() => setStockFilter("expiring")}>
            <Card
              className={`hover:shadow-md transition-shadow cursor-pointer ${stockFilter === "expiring" ? "ring-2 ring-warning" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.expiring}</p>
                  <p className="text-sm text-muted">Expiring Soon</p>
                </div>
              </CardContent>
            </Card>
          </button>
        </div>

        {/* Filters & Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                  <Input
                    type="search"
                    placeholder="Search by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Filter className="h-4 w-4" />
                      {selectedCategory
                        ? mockCategories.find((c) => c.category_id === selectedCategory)?.name
                        : "All Categories"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                    {mockCategories.map((cat) => (
                      <DropdownMenuItem key={cat.category_id} onClick={() => setSelectedCategory(cat.category_id)}>
                        {cat.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/inventory/add">
                <Button className="bg-primary hover:bg-primary-dark text-white gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-muted line-clamp-1">{product.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category_name}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱{product.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={product.stock <= product.min_stock ? "text-warning font-semibold" : ""}>
                        {product.stock}
                      </span>
                      <span className="text-muted text-xs"> / min {product.min_stock}</span>
                    </TableCell>
                    <TableCell>{getStockStatus(product)}</TableCell>
                    <TableCell>
                      {product.expiry_date ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {new Date(product.expiry_date).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {getExpiryStatus(product)}
                        </div>
                      ) : (
                        <span className="text-muted">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/inventory/${product.product_id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/inventory/${product.product_id}/edit`} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={async () => {
                              try {
                                await fetch(`/api/products/${product.product_id}`, { method: 'DELETE' })
                                // optimistic remove
                                setProducts((prev) => prev.filter((p) => p.product_id !== product.product_id))
                              } catch (err) {
                                console.error(err)
                              }
                            }}
                            className="text-danger"
                          >
                            <Archive className="h-4 w-4 mr-2" /> Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center text-muted">
                        <Package className="h-12 w-12 mb-2" />
                        <p className="font-medium">No products found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
