"use client"

import { useEffect, useState } from "react"
import { useProperties } from "@/hooks/use-properties"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export default function PropertiesPage() {
  const { properties, isLoading, fetchProperties, searchProperties } = useProperties()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchProperties(searchQuery)
    } else {
      fetchProperties()
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Properties</h1>
        <Link href="/properties/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </form>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[400px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-xl font-semibold">No properties found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or add a new property
          </p>
        </div>
      )}
    </div>
  )
} 