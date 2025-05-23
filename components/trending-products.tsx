"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { products } from "@/lib/data"
import { ProductCarousel } from "@/components/product-carousel"

export function TrendingSection() {
  const trendingProducts = products.filter((product) => product.new || product.sale)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [100, -50])

  return (
    <motion.section ref={containerRef} style={{ opacity, y }} className="py-16">
      <ProductCarousel title="Trending Now" subtitle="New arrivals and current favorites" products={trendingProducts} />
    </motion.section>
  )
}
