import { supabase } from '@/lib/supabase'
import type { Property } from '@/lib/types'

export const propertiesService = {
  // Get all properties
  async getAll() {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Property[]
  },

  // Get a single property by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Property
  },

  // Create a new property
  async create(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single()

    if (error) throw error
    return data as Property
  },

  // Update a property
  async update(id: string, property: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Property
  },

  // Delete a property
  async delete(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Search properties
  async search(query: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Property[]
  },

  // Get properties by owner
  async getByOwner(ownerId: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Property[]
  }
} 