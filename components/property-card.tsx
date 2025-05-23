"use client"

import Image from "next/image"
import Link from "next/link"
import { Property } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Users } from "lucide-react"

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/properties/${property.id}`}>
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={property.images[0] || "/placeholder-property.jpg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <Badge className="absolute top-4 right-4">
            ${property.price_per_night}/night
          </Badge>
        </div>
        <CardHeader className="space-y-2">
          <h3 className="text-xl font-semibold line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="text-sm">{property.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2">{property.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Bed className="mr-1 h-4 w-4" />
              {property.bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="mr-1 h-4 w-4" />
              {property.bathrooms}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {property.max_guests}
            </div>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </CardFooter>
      </Link>
    </Card>
  )
} 