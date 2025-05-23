"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [discount, setDiscount] = useState(0)

  const handleApplyPromo = async () => {
    if (!promoCode) return

    setIsApplyingPromo(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful promo code
    if (promoCode.toLowerCase() === "discount20") {
      setDiscount(subtotal * 0.2)
    }

    setIsApplyingPromo(false)
  }

  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal - discount + shipping

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {items.length > 0 ? (
          <>
            {/* Cart Items */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
                <span className="text-muted-foreground">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 border-b pb-6"
                  >
                    <Link href={`/products/${item.product.id}`} className="shrink-0">
                      <div className="relative aspect-square w-24 h-24 rounded-md border overflow-hidden">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            {item.product.colors && <span>Color: {item.product.colors[0]}</span>}
                            {item.product.sizes && item.product.colors && <span> / </span>}
                            {item.product.sizes && <span>Size: {item.product.sizes[0]}</span>}
                          </div>
                        </div>

                        <div className="font-medium">
                          {item.product.sale ? (
                            <div className="flex items-center gap-2">
                              <span className="text-destructive">
                                ${((item.product.price * (100 - item.product.discount!)) / 100).toFixed(2)}
                              </span>
                              <span className="text-muted-foreground line-through text-sm">
                                ${item.product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span>${item.product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8">
                <Button variant="ghost" asChild className="gap-1">
                  <Link href="/products">
                    <ChevronLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>

                <Button variant="outline" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full md:w-96 shrink-0">
              <div className="border rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between text-base font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline" onClick={handleApplyPromo} disabled={isApplyingPromo || !promoCode}>
                      Apply
                    </Button>
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">Taxes calculated at checkout</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full py-12 text-center">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted mb-6">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our products and find something you'll
              love.
            </p>

            <Button asChild size="lg">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
