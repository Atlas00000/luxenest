"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AnimatedBanner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  return (
    <motion.div ref={containerRef} style={{ opacity, scale }} className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 border shadow-sm">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10 bg-cover bg-center" />

        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Summer Collection 2025</h2>
              <p className="text-muted-foreground mb-6">
                Discover our new summer collection featuring sustainable materials and timeless designs. Perfect for
                creating your dream living space.
              </p>
              <Button asChild>
                <Link href="/products" className="group">
                  Shop the Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative h-48 w-48 md:h-64 md:w-64"
            >
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-primary/5 border" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary">
                30% OFF
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
