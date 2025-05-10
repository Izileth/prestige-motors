import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import useVehicle from './useVehicle';
import type { Vehicle } from '../types/vehicle';

const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutos

export const useFeaturedVehicles = (count: number = 4) => {
    const { vehicles, loading, fetchVehicles } = useVehicle();
    const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
    const lastFetchTime = useRef<number>(0);
    const isMounted = useRef(true);
    
    // Função para selecionar veículos aleatórios
    const selectRandomVehicles = useCallback((vehicleList: Vehicle[]) => {
        if (vehicleList.length <= count) return [...vehicleList];
        
        // Usar uma cópia e método estável para shuffle
        const shuffled = [...vehicleList];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }, [count]);
    
    // Carrega veículos apenas se necessário
    const loadFeaturedVehicles = useCallback(async (forceRefresh = false) => {
        if (!isMounted.current) return;
        
        const now = Date.now();
        const shouldFetch =
            forceRefresh ||
            vehicles.length === 0 ||
            now - lastFetchTime.current > CACHE_EXPIRY_MS;
        
        if (shouldFetch) {
            try {
                await fetchVehicles();
                lastFetchTime.current = Date.now();
            } catch (error) {
                console.error('Failed to fetch vehicles:', error);
            }
        }
    }, [fetchVehicles, vehicles.length]);
    
    // Carrega os veículos no mount e quando dependências mudam
    useEffect(() => {
        isMounted.current = true;
        loadFeaturedVehicles();
        
        return () => {
            isMounted.current = false;
        };
    }, [loadFeaturedVehicles]);
    
    // Atualiza os veículos em destaque quando a lista muda
    useEffect(() => {
        if (vehicles.length > 0 && isMounted.current) {
            setFeaturedVehicles(selectRandomVehicles(vehicles));
        }
    }, [vehicles, selectRandomVehicles]);
    
    return {
        featuredVehicles,
        loading,
        refresh: () => loadFeaturedVehicles(true),
    };
};