import { useState, useCallback } from 'react'
import { propertiesService } from '@/lib/services/properties'
import type { Property } from '@/lib/types'
import { useToast } from '@/components/ui/use-toast'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await propertiesService.getAll()
      setProperties(data)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch properties',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const createProperty = useCallback(async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true)
    try {
      const newProperty = await propertiesService.create(property)
      setProperties(prev => [newProperty, ...prev])
      toast({
        title: 'Success',
        description: 'Property created successfully',
      })
      return newProperty
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create property',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const updateProperty = useCallback(async (id: string, property: Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>) => {
    setIsLoading(true)
    try {
      const updatedProperty = await propertiesService.update(id, property)
      setProperties(prev => prev.map(p => p.id === id ? updatedProperty : p))
      toast({
        title: 'Success',
        description: 'Property updated successfully',
      })
      return updatedProperty
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update property',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const deleteProperty = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      await propertiesService.delete(id)
      setProperties(prev => prev.filter(p => p.id !== id))
      toast({
        title: 'Success',
        description: 'Property deleted successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete property',
        variant: 'destructive',
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  const searchProperties = useCallback(async (query: string) => {
    setIsLoading(true)
    try {
      const results = await propertiesService.search(query)
      setProperties(results)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to search properties',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    properties,
    isLoading,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    searchProperties,
  }
} 