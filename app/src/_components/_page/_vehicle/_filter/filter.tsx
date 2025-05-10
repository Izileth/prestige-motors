// components/VehicleFilters.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { Filter, X } from "lucide-react";
import type { VehicleSearchParams } from "~/src/types/vehicle";

interface VehicleFiltersProps {
    searchParams: VehicleSearchParams;
    onFilterChange: (field: keyof VehicleSearchParams, value: string | number) => void;
    onReset: () => void;
}

export const VehicleFilters = ({ 
    searchParams, 
    onFilterChange,
    onReset 
    }: VehicleFiltersProps) => {
    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Filtrar veículos</h3>
            <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
            <X size={16} className="mr-1" /> Limpar
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Filtro de Preço */}
            <div>
            <label className="block text-sm font-medium mb-2">Preço</label>
            <Slider
                defaultValue={[searchParams.precoMin || 0, searchParams.precoMax || 500000]}
                max={500000}
                step={1000}
                onValueChange={(value) => {
                onFilterChange("precoMin", value[0]);
                onFilterChange("precoMax", value[1]);
                }}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span>R$ {searchParams.precoMin?.toLocaleString("pt-BR") || "0"}</span>
                <span>R$ {searchParams.precoMax?.toLocaleString("pt-BR") || "500.000"}</span>
            </div>
            </div>

            {/* Filtro de Combustível */}
            <div>
            <label className="block text-sm font-medium mb-2">Combustível</label>
            <Select
                value={searchParams.combustivel || "All"}
                onValueChange={(value) => onFilterChange("combustivel", value)}
            >
                <SelectTrigger>
                <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="All">Todos</SelectItem>
                <SelectItem value="GASOLINA">Gasolina</SelectItem>
                <SelectItem value="ETANOL">Etanol</SelectItem>
                <SelectItem value="FLEX">Flex</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Filtro de Câmbio */}
            <div>
            <label className="block text-sm font-medium mb-2">Câmbio</label>
            <Select
                value={searchParams.cambio || "All"}
                onValueChange={(value) => onFilterChange("cambio", value)}
            >
                <SelectTrigger>
                <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="All">Todos</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="AUTOMATICO">Automático</SelectItem>
                </SelectContent>
            </Select>
            </div>

            {/* Filtro de Categoria (Oculto quando já filtrado por categoria) */}
            {!searchParams.categoria && (
            <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select
                value={searchParams.categoria || "All"}
                onValueChange={(value) => onFilterChange("categoria", value)}
                >
                <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="SPORTS_CAR">Esportivos</SelectItem>
                    <SelectItem value="PICKUP_4X4">Picapes</SelectItem>
                </SelectContent>
                </Select>
            </div>
            )}
        </div>
        </div>
    );
};