"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, Share2, ShoppingBag, Star, Truck, Facebook, Twitter, Linkedin, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart"
import { useWishlist } from "@/lib/wishlist"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Mock reviews data - replace with actual data from your backend
const mockReviews = [
  {
    id: "1",
    productId: "prod-1",
    userId: "user-1",
    userName: "John Doe",
    rating: 5,
    title: "Excellent quality!",
    comment: "The product exceeded my expectations. The quality is outstanding and it looks even better in person.",
    date: "2024-03-15",
    helpful: 12
  },
  {
    id: "2",
    productId: "prod-1",
    userId: "user-2",
    userName: "Jane Smith",
    rating: 4,
    title: "Great product with minor issues",
    comment: "Overall very satisfied with the purchase. The only reason for 4 stars is the slightly longer shipping time.",
    date: "2024-03-10",
    helpful: 8
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 10))
  }

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1))
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = `Check out this amazing ${product.name} on LuxeNest!`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
    }
    setShowShareMenu(false)
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

            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="bg-background/80 backdrop-blur-sm"
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
              </Button>
              <div className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 backdrop-blur-sm"
                  onClick={() => setShowShareMenu(!showShareMenu)}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-background shadow-lg">
                    <div className="p-2 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleShare('facebook')}
                      >
                        <Facebook className="h-4 w-4 mr-2" />
                        Facebook
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleShare('twitter')}
                      >
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleShare('linkedin')}
                      >
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

            <Button className="w-full" size="lg" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2" />
                Free shipping
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div>30-day returns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details" className="space-y-8">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockReviews.length})</TabsTrigger>
            <TabsTrigger value="related">Related Products</TabsTrigger>
          </TabsList>

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
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium">Free Shipping</span>
                      <p className="text-sm text-muted-foreground">On all orders over $100</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <span className="font-medium">30-Day Returns</span>
                      <p className="text-sm text-muted-foreground">Hassle-free returns within 30 days</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{product.rating}</div>
                <div>
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
                  </div>
                  <p className="text-sm text-muted-foreground">Based on {product.reviews} reviews</p>
                </div>
              </div>

              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{review.userName}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < review.rating ? "text-primary fill-primary" : "text-muted-foreground",
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                    <h5 className="font-medium mb-2">{review.title}</h5>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="related" className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.id}`}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={relatedProduct.images[0] || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {relatedProduct.sale && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        Sale {relatedProduct.discount}%
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < Math.floor(relatedProduct.rating)
                                ? "text-primary fill-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({relatedProduct.reviews})</span>
                    </div>
                    <div className="mt-1">
                      {relatedProduct.sale ? (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-destructive">
                            ${((relatedProduct.price * (100 - relatedProduct.discount!)) / 100).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${relatedProduct.price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">${relatedProduct.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
