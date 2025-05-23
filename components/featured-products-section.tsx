"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { products } from "@/lib/data"
import { ProductFilter, type FilterOptions } from "@/components/product-filter"
import { ProductCarousel } from "@/components/product-carousel"

export function FeaturedProductsSection() {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priceRange: [0, 1500],
    sort: "featured",
    onlyInStock: false,
    onlySustainable: false,
  })

  const [filteredProducts, setFilteredProducts] = useState(products.filter((product) => product.featured))

  useEffect(() => {
    let result = [...products]

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter((product) => filters.categories.includes(product.category))
    }

    // Filter by price range
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Filter by stock
    if (filters.onlyInStock) {
      result = result.filter((product) => product.stock > 0)
    }

    // Filter by sustainability
    if (filters.onlySustainable) {
      result = result.filter((product) => product.sustainabilityScore && product.sustainabilityScore >= 4)
    }

    // Sort products
    switch (filters.sort) {
      case "featured":
        result = result.filter((product) => product.featured)
        break
      case "newest":
        result = result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0))
        break
      case "price-low":
        result = result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result = result.sort((a, b) => b.rating - a.rating)
        break
    }

    setFilteredProducts(result)
  }, [filters])

  return (
    <section className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "2rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="h-0.5 bg-primary"
          />
          <span className="text-sm text-primary font-medium uppercase tracking-wider">Discover</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Featured Products</h2>
      </motion.div>

      <ProductFilter onFilterChange={setFilters} className="mb-8" />

      {filteredProducts.length > 0 ? (
        <ProductCarousel products={filteredProducts} title="" />
      ) : (
        <div className="text-center py-12 border rounded-xl bg-muted/20">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters to find what you're looking for.</p>
        </div>
      )}
    </section>
  )
}
