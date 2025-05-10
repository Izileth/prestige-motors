import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const usePersistentFilters = <T extends Record<string, any>>(defaultFilters: T) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState<T>(() => {
        // Prioridade 1: Parâmetros da URL
        const urlParams = Object.fromEntries(searchParams);
        if (Object.keys(urlParams).length > 0) {
        return { 
            ...defaultFilters,
            ...urlParams,
            ...(urlParams.precoMin && { precoMin: Number(urlParams.precoMin) }),
            ...(urlParams.precoMax && { precoMax: Number(urlParams.precoMax) })
        };
        }
        
        // Prioridade 2: localStorage
        const savedFilters = localStorage.getItem('vehicleFilters');
        return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
    });

    useEffect(() => {
        // Atualiza URL e localStorage
        const validFilters = Object.fromEntries(
        Object.entries(filters)
            .filter(([_, v]) => v !== undefined && v !== '')
            .map(([k, v]) => [k, v.toString()])
        );
        
        setSearchParams(validFilters);
        localStorage.setItem('vehicleFilters', JSON.stringify(filters));
    }, [filters]);

    return [filters, setFilters] as const;
};