"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Share2, ShoppingBag, Star, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Calculate final price
  const finalPrice = product.sale ? (product.price * (100 - product.discount!)) / 100 : product.price

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {product.sale && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                Sale {product.discount}%
              </Badge>
            )}
            {product.new && <Badge className="absolute top-4 left-4">New Arrival</Badge>}

            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm"
              onClick={() => {}}
            >
              <Heart className="h-5 w-5" />
            </Button>

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    index === currentImageIndex ? "bg-primary w-8" : "bg-primary/30",
                  )}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-4 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={cn(
                  "relative aspect-square w-20 shrink-0 rounded-md border overflow-hidden",
                  index === currentImageIndex && "ring-2 ring-primary",
                )}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Link
              href="/products"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to products
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mt-2">{product.name}</h1>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground",
                    )}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>

              <Separator orientation="vertical" className="h-5" />

              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            {product.sale ? (
              <>
                <span className="text-3xl font-bold text-destructive">${finalPrice.toFixed(2)}</span>
                <span className="text-xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="space-y-6">
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <Label>Color</Label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center">
                      <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                      <Label
                        htmlFor={`color-${color}`}
                        className="px-4 py-2 border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary"
                      >
                        {color}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <Label>Size</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="px-4 py-2 border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:border-primary"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center">
                <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= 10}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button variant="outline" size="lg" className="flex-1">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Free shipping on orders over $100</span>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3"
            >
              Reviews ({product.reviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="pt-6">
            <div className="prose max-w-none dark:prose-invert">
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              <p>
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="details" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Product Details</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Material</span>
                    <span className="font-medium">{product.materials?.join(", ")}</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Colors</span>
                    <span className="font-medium">{product.colors?.join(", ")}</span>
                  </li>
                  {product.sizes && (
                    <li className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Sizes</span>
                      <span className="font-medium">{product.sizes?.join(", ")}</span>
                    </li>
                  )}
                  <li className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Sustainability Score</span>
                    <span className="font-medium">{product.sustainabilityScore}/5</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Shipping & Returns</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Free Standard Shipping</p>
                      <p className="text-sm text-muted-foreground">On orders over $100</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary shrink-0 mt-0.5"
                    >
                      <path d="M9 14 4 9l5-5" />
                      <path d="M4 9h16" />
                      <path d="M15 4v6" />
                      <path d="M15 10a5 5 0 0 1 5 5v6" />
                    </svg>
                    <div>
                      <p className="font-medium">30-Day Returns</p>
                      <p className="text-sm text-muted-foreground">Shop with confidence</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold">{product.rating.toFixed(1)}</div>
                    <div className="flex justify-center md:justify-start mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Based on {product.reviews} reviews</div>

                    <Button className="mt-4">Write a Review</Button>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="space-y-6">
                    {/* Mock reviews */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border-b pb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">John Doe</h4>
                            <div className="flex items-center mt-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                  key={j}
                                  className={cn(
                                    "h-4 w-4",
                                    j < 4 + (i % 2) ? "text-primary fill-primary" : "text-muted-foreground",
                                  )}
                                />
                              ))}
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(2023, 5 + i, 10).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Badge variant="outline">Verified Purchase</Badge>
                        </div>

                        <h5 className="font-medium mt-3">Excellent quality and design</h5>
                        <p className="text-muted-foreground mt-2">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies
                          lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                          <Button variant="ghost" size="sm" className="h-8">
                            Helpful (12)
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8">
                            Report
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
