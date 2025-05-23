"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Star, ShoppingBag, Bell, TrendingUp, Filter, X } from "lucide-react"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"

// Mock categories - replace with actual categories from your backend
const categories = [
  "All Categories",
  "Furniture",
  "Lighting",
  "Decor",
  "Textiles",
  "Storage",
  "Kitchen",
  "Bathroom",
]

// Mock arrival date ranges
const dateRanges = [
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
]

export default function NewArrivalsPage() {
  const { addItem } = useCart()
  const { toast } = useToast()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedDateRange, setSelectedDateRange] = useState("7d")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState({
    categories: [] as string[],
    dateRange: "7d",
    sort: "newest",
    onlyTrending: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("newArrivalNotifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem("newArrivalNotifications", JSON.stringify(notifications))
  }, [notifications])

  const toggleNotification = (productId: string) => {
    setNotifications((prev) => {
      const newNotifications = { ...prev, [productId]: !prev[productId] }
      toast({
        title: newNotifications[productId] ? "Notification set" : "Notification removed",
        description: newNotifications[productId]
          ? "You'll be notified about updates for this product."
          : "Notifications have been turned off for this product.",
      })
      return newNotifications
    })
  }

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]
      return { ...prev, categories }
    })
  }

  const handleDateRangeChange = (value: string) => {
    setFilters((prev) => ({ ...prev, dateRange: value }))
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }))
  }

  const handleTrendingChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, onlyTrending: checked }))
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      dateRange: "7d",
      sort: "newest",
      onlyTrending: false,
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.dateRange !== "7d" ||
    filters.sort !== "newest" ||
    filters.onlyTrending

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      if (!product.new) return false
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false
      if (filters.onlyTrending && !product.featured) return false
      return true
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return b.id.localeCompare(a.id) // Using ID as a proxy for date
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

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

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Filters */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-4">
          <Select value={filters.sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine your new arrivals search</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Date Range</h4>
                  <Select value={filters.dateRange} onValueChange={handleDateRangeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`}>{category}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="trending"
                      checked={filters.onlyTrending}
                      onCheckedChange={handleTrendingChange}
                    />
                    <Label htmlFor="trending">Show only trending items</Label>
                  </div>
                </div>

                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    Clear Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16"
        >
          <h2 className="text-2xl font-semibold mb-2">No new arrivals found</h2>
          <p className="text-muted-foreground mb-8">Try adjusting your filters to see more products</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => (
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
                      hoveredIndex === index ? "scale-110" : "scale-100"
                    )}
                  />
                  <Badge className="absolute top-3 left-3">New Arrival</Badge>
                  {product.featured && (
                    <Badge variant="secondary" className="absolute top-3 right-3">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {product.sustainabilityScore >= 4 && (
                    <Badge variant="outline" className="absolute top-3 right-3 bg-background/80">
                      Eco-Friendly
                    </Badge>
                  )}

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
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
                          i < Math.floor(product.rating) ? "text-primary fill-primary" : "text-muted-foreground"
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
                    className="rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      addItem(product)
                    }}
                  >
                    Add to Cart
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={`notification-${product.id}`}
                      checked={notifications[product.id]}
                      onCheckedChange={() => toggleNotification(product.id)}
                    />
                    <Label
                      htmlFor={`notification-${product.id}`}
                      className="text-sm text-muted-foreground"
                    >
                      Notify Me
                    </Label>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {dateRanges.find((range) => range.value === filters.dateRange)?.label}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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