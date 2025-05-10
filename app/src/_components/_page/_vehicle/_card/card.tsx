// components/VehicleCard.tsx
import { Heart, ChevronRight, Zap, ShieldCheck, Calendar, Gauge, MapPin } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "~/src/types/vehicle";

interface VehicleCardProps {
    vehicle: Vehicle;
    isFavorite?: boolean;
    onToggleFavorite?: (vehicle: Vehicle) => void;
    }

    export const VehicleCard = ({ vehicle, isFavorite = false, onToggleFavorite }: VehicleCardProps) => {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        }).format(price);
    };

    const getFuelType = (type: string) => {
        const fuelTypes: Record<string, string> = {
        GASOLINA: "Gasolina",
        ETANOL: "Etanol",
        FLEX: "Flex",
        DIESEL: "Diesel",
        ELETRICO: "Elétrico",
        HIBRIDO: "Híbrido",
        GNV: "GNV",
        };
        return fuelTypes[type] || type;
    };

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        >
        <Card className="overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            {/* Imagem e badges */}
            <div className="relative overflow-hidden group aspect-video">
            {vehicle.imagens?.length > 0 ? (
                <img
                src={vehicle.imagens[0].url}
                alt={`${vehicle.marca} ${vehicle.modelo}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Sem imagem</span>
                </div>
            )}

            {/* Badges */}
            <div className="absolute bottom-3 left-3 flex gap-2">
                {vehicle.destaque && (
                <Badge variant="default" className="bg-black text-white dark:bg-white dark:text-black">
                    <Zap size={14} className="mr-1" /> Destaque
                </Badge>
                )}
                {vehicle.seloOriginal && (
                <Badge variant="secondary" className="bg-white text-black dark:bg-black dark:text-white">
                    <ShieldCheck size={14} className="mr-1" /> Original
                </Badge>
                )}
            </div>

            {/* Botão de favorito */}
            {onToggleFavorite && (
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(vehicle);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/90 shadow-sm transition-all hover:scale-110"
                aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                <Heart
                    size={18}
                    className={
                    isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500 group-hover:text-red-500"
                    }
                />
                </button>
            )}
            </div>

            {/* Conteúdo */}
            <CardContent className="p-5 flex-grow">
            <div className="space-y-3">
                <div>
                <h3 className="font-medium text-lg line-clamp-1">
                    {vehicle.marca} {vehicle.modelo}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <Calendar size={14} />
                    {vehicle.anoFabricacao}/{vehicle.anoModelo}
                    <Gauge size={14} className="ml-2" />
                    {vehicle.quilometragem.toLocaleString("pt-BR")} km
                </p>
                </div>

                <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                    {getFuelType(vehicle.tipoCombustivel)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                    {vehicle.cambio === "AUTOMATICO" ? "Automático" : "Manual"}
                </Badge>
                {vehicle.potencia && (
                    <Badge variant="outline" className="text-xs">
                    {vehicle.potencia} cv
                    </Badge>
                )}
                </div>

                <div className="mt-2">
                <p className="text-xl font-medium">
                    {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                </p>
                {vehicle.precoPromocional && (
                    <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm line-through text-gray-500">
                        {formatPrice(vehicle.preco)}
                    </p>
                    <Badge variant="destructive" className="text-xs">
                        {Math.round((1 - vehicle.precoPromocional / vehicle.preco) * 100)}% OFF
                    </Badge>
                    </div>
                )}
                </div>
            </div>
            </CardContent>

            {/* Rodapé */}
            <CardFooter className="p-5 pt-0">
            <Button
                variant="default"
                className="w-full bg-black hover:bg-gray-900 text-white dark:bg-white dark:text-black dark:hover:bg-gray-100"
                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            >
                Ver detalhes
                <ChevronRight size={16} className="ml-1" />
            </Button>
            </CardFooter>
        </Card>
        </motion.div>
    );
};

// Componente de loading para o card
export const VehicleCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 p-4 animate-pulse h-full">
        <div className="bg-gray-200 dark:bg-gray-800 aspect-video rounded-md mb-4"></div>
        <div className="space-y-3">
        <div className="bg-gray-200 dark:bg-gray-800 h-6 rounded-md w-3/4"></div>
        <div className="bg-gray-200 dark:bg-gray-800 h-4 rounded-md w-1/2"></div>
        <div className="flex gap-2">
            <div className="bg-gray-200 dark:bg-gray-800 h-5 rounded-full w-16"></div>
            <div className="bg-gray-200 dark:bg-gray-800 h-5 rounded-full w-20"></div>
        </div>
        <div className="bg-gray-200 dark:bg-gray-800 h-7 rounded-md w-1/2 mt-2"></div>
        </div>
    </div>
);