"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Filter, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { products, categories } from "@/lib/data"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export default function ProductsPage() {
  const { addItem } = useCart()
  const isMobile = useMobile()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 1500] as [number, number],
    sort: "featured",
    onlyInStock: false,
    onlySustainable: false,
  })

  // Apply filters
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
        result = result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
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

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return { ...prev, categories }
    })
  }

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]] as [number, number],
    }))
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }))
  }

  const handleStockChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, onlyInStock: checked }))
  }

  const handleSustainableChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, onlySustainable: checked }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1500],
      sort: "featured",
      onlyInStock: false,
      onlySustainable: false,
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1500 ||
    filters.onlyInStock ||
    filters.onlySustainable

  // Filter UI component
  const FilterUI = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            Clear all
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.slug)}
                onCheckedChange={() => handleCategoryChange(category.slug)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Price Range</h4>
          <span className="text-xs text-muted-foreground">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[0, 1500]}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          max={1500}
          step={10}
          onValueChange={handlePriceChange}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.onlyInStock}
            onCheckedChange={(checked) => handleStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
            In Stock Only
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="sustainable"
            checked={filters.onlySustainable}
            onCheckedChange={(checked) => handleSustainableChange(checked as boolean)}
          />
          <Label htmlFor="sustainable" className="text-sm font-normal cursor-pointer">
            Eco-Friendly Only
          </Label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterUI />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground mt-1">Showing {filteredProducts.length} products</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2">
                        {filters.categories.length +
                          (filters.onlyInStock ? 1 : 0) +
                          (filters.onlySustainable ? 1 : 0) +
                          (filters.priceRange[0] > 0 || filters.priceRange[1] < 1500 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your product search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterUI />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <SheetClose asChild>
                      <Button className="w-full">Apply Filters</Button>
                    </SheetClose>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.slug === category)?.name}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => handleCategoryChange(category)} />
                </Badge>
              ))}

              {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1500) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, priceRange: [0, 1500] }))}
                  />
                </Badge>
              )}

              {filters.onlyInStock && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  In Stock Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, onlyInStock: false }))}
                  />
                </Badge>
              )}

              {filters.onlySustainable && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Eco-Friendly Only
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setFilters((prev) => ({ ...prev, onlySustainable: false }))}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group relative rounded-xl border bg-background overflow-hidden transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
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
                      {product.sustainabilityScore >= 4 && (
                        <Badge variant="outline" className="absolute top-3 right-3 bg-background/80">
                          Eco-Friendly
                        </Badge>
                      )}
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
                            <span className="text-muted-foreground line-through text-sm">
                              ${product.price.toFixed(2)}
                            </span>
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to find what you're looking for.</p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
