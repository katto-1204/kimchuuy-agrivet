"use client"

import { useState, useMemo, useEffect } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  X,
  Printer,
  Check,
} from "lucide-react"
import { mockCategories } from "@/lib/mock-data"
import { useAuth } from "@/lib/auth-context"
import type { CartItem, Product, Customer } from "@/lib/types"

export default function POSPage() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "GCash" | "Maya" | "Bank Transfer">("Cash")
  const [amountPaid, setAmountPaid] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [discount, setDiscount] = useState(0)
  const [lastSaleId, setLastSaleId] = useState<number | null>(null)

  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      if (p.is_archived || p.stock <= 0) return false
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === null || p.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, products])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const vat = (subtotal - discount) * 0.12
  const total = subtotal - discount + vat
  const change = Number.parseFloat(amountPaid || "0") - total

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.product_id === product.product_id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map((item) =>
          item.product.product_id === product.product_id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.product_id !== productId) return item
        const newQty = item.quantity + delta
        if (newQty <= 0) return item
        if (newQty > item.product.stock) return item
        return { ...item, quantity: newQty }
      }),
    )
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.product_id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setSelectedCustomer(null)
  }

  const processPayment = async () => {
    if (paymentMethod === "Cash" && change < 0) return
    if (paymentMethod !== "Cash" && !referenceNumber) return

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.user_id,
          customer_id: selectedCustomer?.customer_id || null,
          items: cart.map((item) => ({
            product_id: item.product.product_id,
            quantity: item.quantity,
          })),
          discount,
          vat,
          total,
          amount_paid: Number.parseFloat(amountPaid || total.toString()),
          change_amount: change,
          payment_method: paymentMethod,
          reference_number: referenceNumber || null,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(`Error: ${error.error}`)
        return
      }

      const data = await response.json()
      setLastSaleId(data.sale_id)
      setShowPayment(false)
      setShowReceipt(true)
      
      // Update local products to reflect stock changes
      const updatedProducts = products.map((p: Product) => {
        const cartItem = cart.find((item) => item.product.product_id === p.product_id)
        if (cartItem) {
          return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) }
        }
        return p
      })
      setProducts(updatedProducts)
    } catch (error) {
      console.error("Payment error:", error)
      alert("Failed to process payment")
    }
  }

  const finishTransaction = () => {
    clearCart()
    setShowReceipt(false)
    setAmountPaid("")
    setReferenceNumber("")
    setPaymentMethod("Cash")
    setLastSaleId(null)
    // Refresh products from database to get latest stock levels
    window.location.reload()
  }

  return (
    <ProtectedLayout>
      <div className="flex h-[calc(100vh-0px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 flex flex-col bg-[#F3F4F6] overflow-hidden">
          {/* Search & Categories */}
          <div className="p-4 bg-card border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                type="search"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-primary text-white" : ""}
              >
                All
              </Button>
              {mockCategories.map((cat) => (
                <Button
                  key={cat.category_id}
                  variant={selectedCategory === cat.category_id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className={selectedCategory === cat.category_id ? "bg-primary text-white" : ""}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted">
                <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-lg font-medium">Loading products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product: Product) => {
                  const inCart = cart.find((item) => item.product.product_id === product.product_id)
                  return (
                    <button
                      key={product.product_id}
                      onClick={() => addToCart(product)}
                      className="bg-card rounded-xl p-3 text-left hover:shadow-lg transition-shadow border border-border hover:border-primary relative group"
                    >
                      {inCart && (
                        <Badge className="absolute -top-2 -right-2 bg-primary text-white">{inCart.quantity}</Badge>
                      )}
                      <div className="w-full aspect-square bg-muted/30 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-3xl text-muted">
                          {product.category_name === "Feeds"
                            ? "🐕"
                            : product.category_name === "Medicine"
                              ? "💊"
                              : product.category_name === "Vitamins"
                                ? "💉"
                                : product.category_name === "Accessories"
                                  ? "🦴"
                                  : "📦"}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">{product.name}</p>
                      <p className="text-xs text-muted mt-1">{product.sku}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-bold text-primary">₱{product.price.toLocaleString("en-PH")}</p>
                        <p className={`text-xs ${product.stock <= product.min_stock ? "text-warning" : "text-muted"}`}>
                          {product.stock} left
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
            {!loading && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-muted">
                <Search className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm">Try a different search term or category</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Cart */}
        <div className="w-96 bg-card border-l border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Current Order
              </h2>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" className="text-danger" onClick={clearCart}>
                  Clear
                </Button>
              )}
            </div>
            {selectedCustomer && (
              <div className="mt-2 flex items-center justify-between p-2 bg-primary/10 rounded-lg">
                <span className="text-sm text-primary">{selectedCustomer.name}</span>
                <button onClick={() => setSelectedCustomer(null)} className="text-primary hover:text-primary-dark">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted">
                <ShoppingCart className="h-16 w-16 mb-4 text-muted/50" />
                <p className="font-medium">Cart is empty</p>
                <p className="text-sm">Add products to start</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.product_id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted">
                        ₱{item.product.price.toLocaleString("en-PH")} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.product_id)}
                      className="text-danger hover:bg-danger/10 p-1 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.product_id, -1)}
                        className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted/50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.product_id, 1)}
                        className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-muted/50"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-semibold text-foreground">
                      ₱
                      {(item.product.price * item.quantity).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-foreground">
                  ₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Discount</span>
                <span className="text-danger">
                  -₱{discount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">VAT (12%)</span>
                <span className="text-foreground">
                  ₱{vat.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-lg font-bold text-primary">
                  ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary-dark text-white text-lg font-semibold"
              disabled={cart.length === 0}
              onClick={() => setShowPayment(true)}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Payment</CardTitle>
              <button onClick={() => setShowPayment(false)} className="text-muted hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 bg-primary/10 rounded-xl">
                <p className="text-sm text-muted">Total Amount</p>
                <p className="text-3xl font-bold text-primary">
                  ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { method: "Cash", icon: Banknote },
                    { method: "GCash", icon: Smartphone },
                    { method: "Maya", icon: Smartphone },
                    { method: "Bank Transfer", icon: CreditCard },
                  ].map(({ method, icon: Icon }) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method as typeof paymentMethod)}
                      className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-colors ${
                        paymentMethod === method
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === "Cash" ? (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount Received</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="h-12 text-lg"
                  />
                  {Number.parseFloat(amountPaid) >= total && (
                    <div className="p-3 bg-success/10 rounded-lg text-center">
                      <p className="text-sm text-muted">Change</p>
                      <p className="text-2xl font-bold text-success">
                        ₱{change.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference Number</Label>
                  <Input
                    id="reference"
                    placeholder="Enter reference number"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="h-12"
                  />
                </div>
              )}

              <Button
                className="w-full h-12 bg-success hover:bg-green-600 text-white text-lg font-semibold"
                onClick={processPayment}
                disabled={(paymentMethod === "Cash" && change < 0) || (paymentMethod !== "Cash" && !referenceNumber)}
              >
                <Check className="mr-2 h-5 w-5" />
                Complete Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm">
            <CardContent className="p-6">
              <div className="text-center border-b border-dashed border-border pb-4 mb-4">
                <h2 className="text-xl font-bold text-foreground">Kimchuyy Agrivet Supply</h2>
                <p className="text-xs text-muted mt-1">Sales Receipt</p>
              </div>

              <div className="text-xs text-muted space-y-1 border-b border-dashed border-border pb-4 mb-4">
                <p>Receipt #: {lastSaleId}</p>
                <p>Date: {new Date().toLocaleString("en-PH")}</p>
                <p>Cashier: {user?.full_name}</p>
                {selectedCustomer && <p>Customer: {selectedCustomer.name}</p>}
              </div>

              <div className="space-y-2 border-b border-dashed border-border pb-4 mb-4">
                {cart.map((item) => (
                  <div key={item.product.product_id} className="flex justify-between text-sm">
                    <div>
                      <p className="text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted">
                        {item.quantity} x ₱{item.product.price.toLocaleString("en-PH")}
                      </p>
                    </div>
                    <p className="text-foreground font-medium">
                      ₱{(item.product.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>₱{subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Discount</span>
                  <span>-₱{discount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">VAT (12%)</span>
                  <span>₱{vat.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed border-border">
                  <span>Total</span>
                  <span className="text-primary">₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted">{paymentMethod}</span>
                  <span>
                    ₱
                    {Number.parseFloat(amountPaid || total.toString()).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {paymentMethod === "Cash" && (
                  <div className="flex justify-between">
                    <span className="text-muted">Change</span>
                    <span>₱{change.toLocaleString("en-PH", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {referenceNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted">Ref #</span>
                    <span>{referenceNumber}</span>
                  </div>
                )}
              </div>

              <div className="text-center mt-6 pt-4 border-t border-dashed border-border">
                <p className="text-xs text-muted">Thank you for your purchase!</p>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.print()}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary-dark text-white" onClick={finishTransaction}>
                  Done
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </ProtectedLayout>
  )
}
