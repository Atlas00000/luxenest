"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [shippingMethod, setShippingMethod] = useState("standard")

  const shipping = shippingMethod === "standard" ? 0 : 15
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase.",
    })

    clearCart()
    router.push("/checkout/success")

    setIsProcessing(false)
  }

  return (
    <div className="container">
      {/* Checkout page content goes here */}
      <h1>Checkout</h1>
      <form onSubmit={handleSubmitOrder}>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card">Credit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div>
          <Label htmlFor="shippingMethod">Shipping Method</Label>
          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard">Standard Shipping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="express" id="express" />
              <Label htmlFor="express">Express Shipping</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <div>
          <h2>Order Summary</h2>
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Shipping: ${shipping.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <Separator />
        <Button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  )
}
