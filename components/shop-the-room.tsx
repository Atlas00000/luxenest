"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { products } from "@/lib/data"
import { cn } from "@/lib/utils"

const rooms = [
  {
    id: "room-1",
    name: "Modern Living Room",
    image: "/images/rooms/modern-living-room.jpg",
    description: "A contemporary living space that balances comfort and style",
    hotspots: [
      { id: 1, x: 25, y: 45, productId: "prod-1" },
      { id: 2, x: 60, y: 70, productId: "prod-4" },
      { id: 3, x: 80, y: 30, productId: "prod-6" },
    ],
  },
  {
    id: "room-2",
    name: "Minimalist Dining",
    image: "/images/rooms/minimalist-dining.jpg",
    description: "Clean lines and functional elegance for memorable gatherings",
    hotspots: [
      { id: 1, x: 50, y: 60, productId: "prod-2" },
      { id: 2, x: 30, y: 40, productId: "prod-5" },
      { id: 3, x: 70, y: 30, productId: "prod-7" },
    ],
  },
]

export function ShopTheRoom() {
  const [currentRoom, setCurrentRoom] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)
  const room = rooms[currentRoom]

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-0.5 bg-primary"
            />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">Interactive</span>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "2rem" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-0.5 bg-primary"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop The Room</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Explore our curated room designs and discover the perfect pieces to recreate the look
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border">
              <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />

              {room.hotspots.map((hotspot) => {
                const product = products.find((p) => p.id === hotspot.productId)
                if (!product) return null

                return (
                  <div key={hotspot.id} className="absolute" style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}>
                    <button
                      className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300",
                        activeHotspot === hotspot.id
                          ? "bg-primary scale-100"
                          : "bg-primary/80 hover:bg-primary scale-75 hover:scale-100",
                      )}
                      onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                    >
                      <span className="sr-only">View {product.name}</span>
                      <span className="text-white text-xs font-bold">+</span>
                    </button>

                    <AnimatePresence>
                      {activeHotspot === hotspot.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-background rounded-lg shadow-lg border overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                            {product.sale && (
                              <Badge variant="destructive" className="absolute top-2 left-2">
                                Sale {product.discount}%
                              </Badge>
                            )}
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium">{product.name}</h4>
                            <div className="flex items-center justify-between mt-1">
                              <div className="font-semibold">
                                {product.sale ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-destructive">
                                      ${((product.price * (100 - product.discount!)) / 100).toFixed(2)}
                                    </span>
                                    <span className="text-muted-foreground line-through text-sm">
                                      ${product.price.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <span>${product.price.toFixed(2)}</span>
                                )}
                              </div>
                              <Button asChild size="sm" variant="outline" className="h-8">
                                <Link href={`/products/${product.id}`}>View</Link>
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {rooms.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentRoom(index)
                    setActiveHotspot(null)
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentRoom ? "bg-primary w-8" : "bg-primary/30"
                  }`}
                  aria-label={`View room ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="bg-muted/30 rounded-xl p-6 h-full">
              <h3 className="text-2xl font-bold mb-2">{room.name}</h3>
              <p className="text-muted-foreground mb-6">{room.description}</p>

              <h4 className="font-medium text-lg mb-4">Featured Products</h4>
              <div className="space-y-4">
                {room.hotspots.map((hotspot) => {
                  const product = products.find((p) => p.id === hotspot.productId)
                  if (!product) return null

                  return (
                    <motion.div
                      key={hotspot.id}
                      initial={{ opacity: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: activeHotspot === hotspot.id ? 1.02 : 1,
                        backgroundColor: activeHotspot === hotspot.id ? "rgba(var(--primary), 0.1)" : "transparent",
                      }}
                      className="flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                      onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                    >
                      <div className="relative h-16 w-16 rounded border overflow-hidden shrink-0">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{product.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="font-semibold text-sm">
                            {product.sale ? (
                              <div className="flex items-center gap-2">
                                <span className="text-destructive">
                                  ${((product.price * (100 - product.discount!)) / 100).toFixed(2)}
                                </span>
                                <span className="text-muted-foreground line-through text-xs">
                                  ${product.price.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span>${product.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-8">
                <Button asChild className="w-full">
                  <Link href="/products">Shop All Products</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
