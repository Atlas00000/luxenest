"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

export function AiRecommendations() {
  const { addItem } = useCart()
  // Mock AI recommendations - in a real app, these would come from an AI service
  const recommendedProducts = products.slice(0, 4)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Personalized For You</h2>
            <p className="text-muted-foreground mt-2">Curated recommendations based on your style preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            className="group relative rounded-xl border bg-background overflow-hidden transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Link href={`/products/${product.id}`} className="block">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500",
                    hoveredIndex === index && "scale-110",
                  )}
                />
                {product.sale && (
                  <Badge variant="destructive" className="absolute top-3 left-3">
                    Sale {product.discount}%
                  </Badge>
                )}
                {product.new && <Badge className="absolute top-3 left-3">New Arrival</Badge>}
                <Badge variant="secondary" className="absolute top-3 right-3 bg-background/80">
                  AI Recommended
                </Badge>
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
    </section>
  )
}
