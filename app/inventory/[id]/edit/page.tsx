"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { mockCategories } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { useParams } from 'next/navigation'

export default function EditProductPage() {
  const params = useParams() as { id?: string }
  const id = params?.id || ''
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        const data = await res.json()
        if (mounted) setProduct(data)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoadingProduct(false)
      }
    }
    if (id) load()
    return () => {
      mounted = false
    }
  }, [id])
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category_id: "",
    description: "",
    price: "",
    cost_price: "",
    min_stock: "10",
    expiry_date: "",
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category_id: product.category_id?.toString() || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        cost_price: product.cost_price?.toString() || "",
        min_stock: product.min_stock?.toString() || "10",
        expiry_date: product.expiry_date || "",
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        category_id: Number.parseInt(formData.category_id || '0') || null,
        description: formData.description,
        price: Number.parseFloat(formData.price || '0') || 0,
        cost_price: formData.cost_price ? Number.parseFloat(formData.cost_price) : null,
        min_stock: formData.min_stock ? Number.parseInt(formData.min_stock) : 0,
        expiry_date: formData.expiry_date || null,
      }

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update')
      await res.json()
      router.push(`/inventory/${id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loadingProduct) {
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
        <div className="p-6 text-center">
          <p>Product not found.</p>
          <Link href="/inventory">
            <Button className="mt-4 bg-primary text-white">Back to Inventory</Button>
          </Link>
        </div>
      </ProtectedLayout>
    )
  }

  return (
    <ProtectedLayout>
      <Header title="Edit Product" subtitle={product.name} />

      <div className="p-6">
        <div className="mb-6">
          <Link href={`/inventory/${id}`}>
            <Button variant="ghost" className="gap-2 text-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Product
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" value={formData.sku} onChange={(e) => updateField("sku", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category_id} onValueChange={(v) => updateField("category_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCategories.map((cat) => (
                        <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Selling Price (₱) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost_price">Cost Price (₱)</Label>
                    <Input
                      id="cost_price"
                      type="number"
                      value={formData.cost_price}
                      onChange={(e) => updateField("cost_price", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stock Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_stock">Minimum Stock Level</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={formData.min_stock}
                      onChange={(e) => updateField("min_stock", e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry Date</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => updateField("expiry_date", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link href={`/inventory/${id}`}>
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedLayout>
  )
}
