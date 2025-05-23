"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { useProperties } from "@/hooks/use-properties"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import { Property, Review } from "@/lib/types"
import { ReviewSection } from "@/components/review-section"

export default function PropertyDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { getById } = useProperties()
  const [property, setProperty] = useState<Property | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getById(params.id as string)
        setProperty(data)
        // TODO: Fetch reviews for the property
        setReviews([])
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [params.id, getById])

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book a property",
        variant: "destructive",
      })
      return
    }

    if (!selectedDates.from || !selectedDates.to) {
      toast({
        title: "Error",
        description: "Please select check-in and check-out dates",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement booking functionality
    toast({
      title: "Success",
      description: "Booking request sent!",
    })
  }

  const handleReviewSubmit = async (review: Omit<Review, "id" | "created_at" | "updated_at">) => {
    // TODO: Implement review submission
    const newReview: Review = {
      ...review,
      id: Math.random().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setReviews((prev) => [...prev, newReview])
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-96 bg-gray-200 rounded-lg" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Property not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={property.images[0] || "/placeholder.jpg"}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About this property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{property.description}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-semibold">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-semibold">{property.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Max Guests</p>
                  <p className="font-semibold">{property.max_guests}</p>
                </div>
              </div>

              {property.amenities.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {property.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <ReviewSection
            propertyId={property.id}
            reviews={reviews}
            onReviewSubmit={handleReviewSubmit}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book this property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">${property.price_per_night}</p>
                  <p className="text-gray-500">per night</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">{property.location}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Select dates</p>
                <Calendar
                  mode="range"
                  selected={{
                    from: selectedDates.from,
                    to: selectedDates.to,
                  }}
                  onSelect={(range) => {
                    setSelectedDates({
                      from: range?.from,
                      to: range?.to,
                    })
                  }}
                  numberOfMonths={2}
                  className="rounded-md border"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleBooking}
                disabled={!selectedDates.from || !selectedDates.to}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 