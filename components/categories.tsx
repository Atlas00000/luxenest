"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { categories } from "@/lib/data"

export function Categories() {
  const featuredCategories = categories.filter((category) => category.featured)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [100, -50])

  return (
    <motion.section ref={containerRef} style={{ opacity, y }} className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
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
          <span className="text-sm text-primary font-medium uppercase tracking-wider">Explore</span>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-0.5 bg-primary"
          />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Explore our curated collections of premium home furnishings and decor, designed to transform your space
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {featuredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="group relative"
          >
            <Link href={`/categories/${category.slug}`} className="block">
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="font-medium text-lg text-white">{category.name}</h3>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "2rem" }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-0.5 bg-primary mt-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <p className="text-sm text-white/80 mt-1 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
