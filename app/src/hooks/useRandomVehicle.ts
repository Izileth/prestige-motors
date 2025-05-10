// src/hooks/useRandomVehicles.ts
import { useEffect, useState, useCallback, useRef } from 'react'
import useVehicle from './useVehicle'
import type { Vehicle } from '../types/vehicle'

export const useRandomVehicles = (count: number = 4) => {
  const {  fetchVehicles, vehicles, loading } = useVehicle()
  const [randomVehicles, setRandomVehicles] = useState<Vehicle[]>([])
  const isMounted = useRef(true)
  const lastFetchTime = useRef<number>(0)

  // Função memoizada para carregar veículos
  const loadVehicles = useCallback(async (force = false) => {
    if (!isMounted.current) return

    const now = Date.now()
    const cacheExpired = now - lastFetchTime.current > 300000 // 5 minutos

    if (!force && !cacheExpired && vehicles.length > 0) {
      return
    }

    try {
      await fetchVehicles()
      lastFetchTime.current = Date.now()
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    }
  }, [fetchVehicles, vehicles.length])

  // Efeito para carregar inicialmente
  useEffect(() => {
    isMounted.current = true
    loadVehicles()

    return () => {
      isMounted.current = false
    }
  }, [loadVehicles])

  // Atualizar veículos aleatórios quando os dados mudarem
  useEffect(() => {
    if ( vehicles.length > 0) {
      const shuffled = [...vehicles]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
      setRandomVehicles(shuffled)
    }
  }, [vehicles, count])

  return {
    vehicles: randomVehicles,
    loading,
    refresh: () => loadVehicles(true)
  }
}