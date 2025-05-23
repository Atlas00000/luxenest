"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Star, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

export default function NewArrivalsPage() {
  const { addItem } = useCart()
  const newArrivals = products.filter((product) => product.new)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-primary"
          />
          <span className="text-sm text-primary font-medium uppercase tracking-wider">Latest</span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-primary"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">New Arrivals</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Be the first to discover our latest additions to the collection
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {newArrivals.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-xl border bg-background overflow-hidden transition-all hover:shadow-lg"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700",
                    hoveredIndex === index ? "scale-110" : "scale-100",
                  )}
                />
                <Badge className="absolute top-3 left-3">New Arrival</Badge>
                {product.sustainabilityScore >= 4 && (
                  <Badge variant="outline" className="absolute top-3 right-3 bg-background/80">
                    Eco-Friendly
                  </Badge>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Quick View</span>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.preventDefault()
                        addItem(product)
                      }}
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground",
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              <Link href={`/products/${product.id}`} className="block">
                <h3 className="font-medium text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {product.sale ? (
                    <div className="flex items-center gap-2">
                      <span className="text-destructive">
                        ${((product.price * (100 - product.discount!)) / 100).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground line-through text-sm">${product.price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span>${product.price.toFixed(2)}</span>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={(e) => {
                    e.preventDefault()
                    addItem(product)
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-16 text-center"
      >
        <Button asChild variant="outline" size="lg" className="group">
          <Link href="/products">
            View All Products
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
    </div>
  )
} 