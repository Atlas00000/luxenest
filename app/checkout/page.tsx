"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { CreditCard, Package, Truck, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock shipping rates - replace with actual API call
const shippingRates = {
  standard: {
    name: "Standard Shipping",
    price: 0,
    estimatedDays: "3-5",
    description: "Free shipping on orders over $100",
  },
  express: {
    name: "Express Shipping",
    price: 15,
    estimatedDays: "1-2",
    description: "Priority handling and faster delivery",
  },
  overnight: {
    name: "Overnight Shipping",
    price: 25,
    estimatedDays: "1",
    description: "Next day delivery",
  },
}

// Mock payment methods - replace with actual payment integration
const paymentMethods = [
  {
    id: "credit-card",
    name: "Credit Card",
    icon: CreditCard,
    description: "Pay with your credit card",
    comingSoon: false,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: CreditCard,
    description: "Pay with your PayPal account",
    comingSoon: true,
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    icon: CreditCard,
    description: "Pay with Apple Pay",
    comingSoon: true,
  },
  {
    id: "google-pay",
    name: "Google Pay",
    icon: CreditCard,
    description: "Pay with Google Pay",
    comingSoon: true,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [zipCode, setZipCode] = useState("")
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false)

  const shipping = shippingRates[shippingMethod as keyof typeof shippingRates].price
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCalculateShipping = async () => {
    if (!zipCode) {
      toast({
        title: "Zip code required",
        description: "Please enter a zip code to calculate shipping.",
        variant: "destructive",
      })
      return
    }

    setIsCalculatingShipping(true)

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful calculation
    toast({
      title: "Shipping calculated",
      description: "Shipping rates have been updated based on your location.",
    })

    setIsCalculatingShipping(false)
  }

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
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
            <p className="text-muted-foreground">Complete your purchase</p>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-4 rounded-lg border p-4 ${
                        paymentMethod === method.id ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} disabled={method.comingSoon} />
                      <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">{method.description}</div>
                          </div>
                          {method.comingSoon && (
                            <Badge variant="secondary" className="ml-2">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Shipping Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
                <CardDescription>Calculate shipping costs and select delivery method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="zipCode">Zip Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="Enter zip code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCalculateShipping}
                    disabled={isCalculatingShipping || !zipCode}
                    className="self-end"
                  >
                    Calculate
                  </Button>
                </div>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid gap-4">
                  {Object.entries(shippingRates).map(([id, rate]) => (
                    <div
                      key={id}
                      className={`flex items-center space-x-4 rounded-lg border p-4 ${
                        shippingMethod === id ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem value={id} id={id} />
                      <Label htmlFor={id} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{rate.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {rate.description} • {rate.estimatedDays} days
                            </div>
                          </div>
                          <div className="font-medium">{rate.price === 0 ? "Free" : `$${rate.price.toFixed(2)}`}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
                <CardDescription>Track your order status and delivery progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>Order Placed</span>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <Progress value={25} className="h-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <span>Processing</span>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <span>Shipping</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>Delivery</span>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>{items.length} items in your order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative aspect-square w-20 h-20 rounded-md border overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Taxes and shipping calculated at checkout</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
