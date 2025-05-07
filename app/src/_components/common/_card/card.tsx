// src/components/VehicleCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Heart, Star, ChevronRight } from 'lucide-react';
import type { Vehicle } from '~/src/store/slices/vehicle';

interface VehicleCardProps {
    vehicle: Vehicle;
    onFavoriteToggle: (vehicle: Vehicle) => void;
    onClick: () => void;
}

const VehicleCard = ({ vehicle, onFavoriteToggle, onClick }: VehicleCardProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
        }).format(price);
    };

    const getFuelType = (type: string) => {
        const fuelTypes: Record<string, string> = {
        GASOLINA: 'Gasolina',
        ETANOL: 'Etanol',
        FLEX: 'Flex',
        DIESEL: 'Diesel',
        ELETRICO: 'Elétrico',
        HIBRIDO: 'Híbrido',
        GNV: 'GNV'
        };
        return fuelTypes[type] || type;
    };

    const getTransmissionType = (type: string) => {
        const transmissionTypes: Record<string, string> = {
        MANUAL: 'Manual',
        AUTOMATICO: 'Automático',
        SEMI_AUTOMATICO: 'Semi-automático',
        CVT: 'CVT'
        };
        return transmissionTypes[type] || type;
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="relative p-0">
            {vehicle.imagens && vehicle.imagens.length > 0 ? (
            <img
                src={vehicle.imagens[0].url}
                alt={vehicle.modelo}
                className="w-full h-48 object-cover rounded-t-lg"
            />
            ) : (
            <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">Sem imagem</span>
            </div>
            )}
            <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white"
            onClick={() => onFavoriteToggle(vehicle)}
            >
            <Heart
                size={20}
                className={vehicle.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
            />
            </Button>
            {vehicle.destaque && (
            <Badge variant="default" className="absolute top-2 left-2">
                Destaque
            </Badge>
            )}
        </CardHeader>
        <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">
                {vehicle.marca} {vehicle.modelo}
            </h3>
            <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.8</span>
            </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
            {vehicle.anoFabricacao}/{vehicle.anoModelo} • {vehicle.quilometragem.toLocaleString('pt-BR')} km
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary">{getFuelType(vehicle.tipoCombustivel)}</Badge>
            <Badge variant="secondary">{getTransmissionType(vehicle.cambio)}</Badge>
            <Badge variant="secondary">{vehicle.portas} portas</Badge>
            </div>
            <div className="mt-4">
            <p className="text-xl font-bold">
                {formatPrice(vehicle.precoPromocional || vehicle.preco)}
            </p>
            {vehicle.precoPromocional && (
                <p className="text-sm line-through text-muted-foreground">
                {formatPrice(vehicle.preco)}
                </p>
            )}
            </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <Button variant="default" className="w-full" onClick={onClick}>
            Ver detalhes <ChevronRight size={16} className="ml-1" />
            </Button>
        </CardFooter>
        </Card>
    );
};

export default VehicleCard;