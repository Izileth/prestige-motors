import { useState, useEffect } from 'react';
import type { Vehicle } from '../types/vehicle';
import type { VehicleSearchParams } from '../types/vehicle';
export const useVehicleFilters = (initialVehicles: Vehicle[] = []) => {
    const [allVehicles, setAllVehicles] = useState<Vehicle[]>(initialVehicles);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(initialVehicles);
    const [filters, setFilters] = useState<VehicleSearchParams>({});
    const [loading, setLoading] = useState(false);

    // Atualiza os veículos quando recebe novos dados
    useEffect(() => {
        setAllVehicles(initialVehicles);
        setFilteredVehicles(initialVehicles);
    }, [initialVehicles]);

    // Aplica filtros quando eles mudam
    useEffect(() => {
        if (allVehicles.length === 0) return;

        setLoading(true);
        const timer = setTimeout(() => {
        const filtered = applyFilters(allVehicles, filters);
        setFilteredVehicles(filtered);
        setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [filters, allVehicles]);

    const applyFilters = (vehicles: Vehicle[], filters: VehicleSearchParams): Vehicle[] => {
        return vehicles.filter(vehicle => {
        // Filtro por modelo/marca
        if (filters.modelo && 
            !`${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(filters.modelo.toLowerCase())) {
            return false;
        }
        
        // Filtro por preço
        const price = vehicle.precoPromocional || vehicle.preco;
        if (filters.precoMin && price < filters.precoMin) return false;
        if (filters.precoMax && price > filters.precoMax) return false;
        
        // Filtro por combustível
        if (filters.combustivel && filters.combustivel !== 'All' && 
            vehicle.tipoCombustivel !== filters.combustivel) {
            return false;
        }
        
        // Filtro por câmbio
        if (filters.cambio && filters.cambio !== 'All' && vehicle.cambio !== filters.cambio) {
            return false;
        }
        
        // Filtro por categoria
        if (filters.categoria && filters.categoria !== 'All' && vehicle.categoria !== filters.categoria) {
            return false;
        }
        
        // Filtro por destaque
        if (typeof filters.destaque !== 'undefined' && vehicle.destaque !== filters.destaque) {
            return false;
        }
        
        return true;
        });
    };

    return {
        filteredVehicles,
        filters,
        setFilters,
        loading: loading,
        resetFilters: () => setFilters({})
    };
};