"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/lib/cart"
import { useWishlist } from "@/lib/wishlist"
import { Heart, ShoppingCart, Bell, SlidersHorizontal, X, ChevronRight, TrendingUp, Clock, Percent, Search } from "lucide-react"

type SortOption = "discount-desc" | "price-asc" | "price-desc" | "popular" | "ending-soon"

export default function SalesPage() {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("discount-desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [showEndingSoon, setShowEndingSoon] = useState(false)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})

  // Get unique filter options from products
  const filterOptions = useMemo(() => {
    const options = new Set<string>()
    products.forEach((product) => {
      if (product.tags) {
        product.tags.forEach((tag) => options.add(tag))
      }
    })
    return Array.from(options)
  }, [])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilters = selectedFilters.length === 0 ||
          selectedFilters.every((filter) => product.tags?.includes(filter))
        const matchesEndingSoon = !showEndingSoon || isEndingSoon(product.saleEndsAt)
        return matchesSearch && matchesFilters && matchesEndingSoon
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "discount-desc":
            return (b.discount || 0) - (a.discount || 0)
          case "price-asc":
            return (a.price * (1 - (a.discount || 0))) - (b.price * (1 - (b.discount || 0)))
          case "price-desc":
            return (b.price * (1 - (b.discount || 0))) - (a.price * (1 - (a.discount || 0)))
          case "popular":
            return (b.popularity || 0) - (a.popularity || 0)
          case "ending-soon":
            return new Date(a.saleEndsAt || "").getTime() - new Date(b.saleEndsAt || "").getTime()
          default:
            return 0
        }
      })
  }, [products, searchQuery, selectedFilters, sortBy, showEndingSoon])

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    )
  }

  const clearFilters = () => {
    setSelectedFilters([])
    setSearchQuery("")
    setShowEndingSoon(false)
  }

  const toggleNotification = (productId: string) => {
    setNotifications((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }))
    toast({
      title: notifications[productId] ? "Notification removed" : "Notification added",
      description: notifications[productId] 
        ? "You will no longer receive updates for this sale"
        : "You will be notified when this sale is about to end",
    })
  }

  const isEndingSoon = (date?: string) => {
    if (!date) return false
    const endDate = new Date(date)
    const now = new Date()
    const hoursLeft = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursLeft <= 24
  }

  const getTimeLeft = (date?: string) => {
    if (!date) return null
    const endDate = new Date(date)
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    
    if (diff <= 0) return null

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
  }

  const getDiscountPercentage = (product: any) => {
    return Math.round((product.discount || 0) * 100)
  }

  const getSaleProgress = (product: any) => {
    if (!product.saleEndsAt) return 100
    const endDate = new Date(product.saleEndsAt)
    const startDate = new Date(product.saleStartsAt || endDate.getTime() - (7 * 24 * 60 * 60 * 1000))
    const now = new Date()
    const total = endDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

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
          <span className="text-sm text-primary font-medium uppercase tracking-wider">Special Offers</span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "2rem" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-primary"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Flash Sales</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Limited time offers on our most popular products. Don't miss out on these amazing deals!
        </p>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {selectedFilters.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedFilters.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Sales</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.map((filter) => (
                        <Badge
                          key={filter}
                          variant={selectedFilters.includes(filter) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleFilter(filter)}
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ending-soon"
                      checked={showEndingSoon}
                      onCheckedChange={setShowEndingSoon}
                    />
                    <Label htmlFor="ending-soon">Show ending soon</Label>
                  </div>
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={clearFilters}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount-desc">Highest Discount</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleFilter(filter)}
              >
                {filter}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => {
            const timeLeft = getTimeLeft(product.saleEndsAt)
            const discountPercentage = getDiscountPercentage(product)
            const saleProgress = getSaleProgress(product)
            const isEnding = isEndingSoon(product.saleEndsAt)

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative rounded-xl overflow-hidden border bg-background hover:shadow-lg transition-all"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        onClick={(e) => {
                          e.preventDefault()
                          if (isInWishlist(product.id)) {
                            removeFromWishlist(product.id)
                          } else {
                            addToWishlist(product)
                          }
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isInWishlist(product.id) ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleNotification(product.id)
                        }}
                      >
                        <Bell
                          className={`h-4 w-4 ${
                            notifications[product.id] ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="destructive" className="text-sm">
                          {discountPercentage}% OFF
                        </Badge>
                        {isEnding && (
                          <Badge variant="secondary" className="text-sm">
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
                      <p className="text-white/80 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-white">
                          ${(product.price * (1 - product.discount)).toFixed(2)}
                        </span>
                        <span className="text-white/60 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      {timeLeft && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m left
                            </span>
                          </div>
                          <Progress value={saleProgress} className="h-2" />
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {product.tags?.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-white/10 text-white hover:bg-white/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        className="w-full group/btn"
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                          toast({
                            title: "Added to cart",
                            description: `${product.name} has been added to your cart.`,
                          })
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <h3 className="text-lg font-medium mb-2">No sales found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </motion.div>
      )}

      {/* View All Products Button */}
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