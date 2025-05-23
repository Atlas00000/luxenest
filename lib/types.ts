export type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  tags: string[]
  rating: number
  reviews: number
  stock: number
  featured?: boolean
  new?: boolean
  sale?: boolean
  discount?: number
  sustainabilityScore?: number
  colors?: string[]
  sizes?: string[]
  materials?: string[]
}

export type Category = {
  id: string
  name: string
  description: string
  image: string
  slug: string
  featured?: boolean
}

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Property = {
  id: string
  owner_id: string
  title: string
  description: string | null
  price_per_night: number
  location: string
  max_guests: number
  bedrooms: number
  bathrooms: number
  images: string[]
  amenities: string[]
  created_at: string
  updated_at: string
}

export type Booking = {
  id: string
  property_id: string
  guest_id: string
  check_in_date: string
  check_out_date: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  property_id: string
  reviewer_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  sender_id: string
  receiver_id: string
  property_id: string | null
  content: string
  is_read: boolean
  created_at: string
  updated_at: string
}

// Database schema type
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
      }
      properties: {
        Row: Property
        Insert: Omit<Property, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>
      }
      bookings: {
        Row: Booking
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
