
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Slider } from '~/components/ui/slider';
import { Badge } from '~/components/ui/badge';
import { Heart, Star, ChevronRight, Filter, Zap, ShieldCheck, Calendar, Gauge, MapPin } from 'lucide-react';
import useVehicle from '~/src/hooks/useVehicle';
import type { Vehicle} from '~/src/store/slices/vehicle';
import type { VehicleSearchParams } from '~/src/services/vehicle';

const VehicleListingPage = () => {
    const {
        vehicles,
        loading,
        error,
        fetchVehicles,
        fetchFeaturedVehicles,
        addFavorite,
        removeFavorite,
        fetchUserFavorites,
        favorites
    } = useVehicle();


    const [searchParams, setSearchParams] = useState<VehicleSearchParams>({});
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Debounce para fetchVehicles
        const timer = setTimeout(() => {
        fetchVehicles(searchParams);
        }, 500);

        // 2. Favoritos só uma vez (não depende de searchParams)
        fetchUserFavorites();

        return () => clearTimeout(timer); // ← Cleanup
    }, [searchParams]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ ...searchParams, modelo: e.target.value });
    };

    const handlePriceChange = (value: number[]) => {
        setSearchParams({ 
        ...searchParams, 
        precoMin: value[0], 
        precoMax: value[1] 
        });
    };

    const toggleFavorite = async (vehicle: Vehicle) => {
        if (vehicle.isFavorite) {
        await removeFavorite(vehicle.id);
        } else {
        await addFavorite(vehicle.id);
        }
        fetchUserFavorites();
    };
    const handleFavorite = async (vehicleId: string) => {
        try {
          await addFavorite(vehicleId); // Dispara a ação
          await fetchUserFavorites(); // Recarrega a lista atualizada
        } catch (error) {
          console.error("Falha ao favoritar:", error);
        }
      };
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
        <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Encontre o veículo perfeito</h1>
            <p className="text-muted-foreground">
            Explore nossa seleção de veículos premium e encontre o que melhor se adapta às suas necessidades.
            </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1">
            <Input
                placeholder="Buscar por modelo..."
                value={searchParams.modelo || ''}
                onChange={handleSearchChange}
                className="w-full"
            />
            </div>
            <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
            >
            <Filter size={16} />
            Filtros
            </Button>
        </div>

        {showFilters && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Filtrar por</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                <label className="block text-sm font-medium mb-2">Preço</label>
                <Slider
                    defaultValue={[searchParams.precoMin || 0, searchParams.precoMax || 500000]}
                    max={500000}
                    step={1000}
                    onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm">
                    <span>{formatPrice(searchParams.precoMin || 0)}</span>
                    <span>{formatPrice(searchParams.precoMax || 500000)}</span>
                </div>
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Combustível</label>
                <Select
                    value={searchParams.combustivel || ''}
                    onValueChange={(value) => setSearchParams({ ...searchParams, combustivel: value })}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="GASOLINA">Gasolina</SelectItem>
                    <SelectItem value="ETANOL">Etanol</SelectItem>
                    <SelectItem value="FLEX">Flex</SelectItem>
                    <SelectItem value="DIESEL">Diesel</SelectItem>
                    <SelectItem value="ELETRICO">Elétrico</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                    <SelectItem value="GNV">GNV</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Câmbio</label>
                <Select
                    value={searchParams.cambio || ''}
                    onValueChange={(value) => setSearchParams({ ...searchParams, cambio: value })}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                    <SelectItem value="AUTOMATICO">Automático</SelectItem>
                    <SelectItem value="SEMI_AUTOMATICO">Semi-automático</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    </SelectContent>
                </Select>
                </div>

                <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <Select
                    value={searchParams.categoria || ''}
                    onValueChange={(value) => setSearchParams({ ...searchParams, categoria: value })}
                >
                    <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="All">Todos</SelectItem>
                    <SelectItem value="HYPERCAR">Hypercar</SelectItem>
                    <SelectItem value="SUPERCAR">Supercar</SelectItem>
                    <SelectItem value="SPORTS_CAR">Sports Car</SelectItem>
                    <SelectItem value="CLASSIC_MUSCLE">Classic Muscle</SelectItem>
                    <SelectItem value="MODERN_MUSCLE">Modern Muscle</SelectItem>
                    <SelectItem value="GT">GT</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="PICKUP_4X4">Pickup 4x4</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
            </div>
        )}

        {loading && <div className="text-center py-8">Carregando veículos...</div>}
        {error && <div className="text-center py-8 text-red-500">Erro ao carregar veículos: {error}</div>}

        {!loading && !error && (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.isArray(vehicles) && vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="hover:shadow-lg transition-shadow group">
                        <CardHeader className="relative p-0">
                            <div className="relative">
                                {vehicle.imagens && vehicle.imagens.length > 0 ? (
                                    <img
                                        src={vehicle.imagens.find(img => img.isMain)?.url || vehicle.imagens[0].url}
                                        alt={`${vehicle.marca} ${vehicle.modelo}`}
                                        className="w-full h-48 object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                                        <span className="text-gray-500">Sem imagem disponível</span>
                                    </div>
                                )}
                                
                                <div className="absolute bottom-2 left-2 flex gap-2">
                                    {vehicle.destaque && (
                                        <Badge variant="default" className="flex items-center gap-1">
                                            <Zap size={14} /> Destaque
                                        </Badge>
                                    )}
                                    {vehicle.seloOriginal && (
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                            <ShieldCheck size={14} /> Original
                                        </Badge>
                                    )}
                                </div>
                                
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white shadow-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(vehicle);
                                    }}
                                    aria-label={vehicle.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                >
                                    <Heart
                                        size={20}
                                        className={
                                            vehicle.isFavorite 
                                                ? 'fill-red-500 text-red-500 animate-pulse' 
                                                : 'text-gray-500 group-hover:text-red-500 transition-colors'
                                        }
                                    />
                                </Button>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg line-clamp-1">
                                        {vehicle.marca} {vehicle.modelo}
                                    </h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Calendar size={14} className="opacity-70" />
                                        {vehicle.anoFabricacao}/{vehicle.anoModelo} • 
                                        <Gauge size={14} className="opacity-70 ml-1" />
                                        {vehicle.quilometragem.toLocaleString('pt-BR')} km
                                    </p>
                                </div>
                                
                                {vehicle.vendedor && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin size={14} className="opacity-70" />
                                        <span>{vehicle.vendedor.id || 'Localização'}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {getFuelType(vehicle.tipoCombustivel)}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    {getTransmissionType(vehicle.cambio)}
                                </Badge>
                                <Badge variant="outline">
                                    {vehicle.portas} portas
                                </Badge>
                                {vehicle.potencia && (
                                    <Badge variant="outline">
                                        {vehicle.potencia} cv
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="mt-2">
                                <p className="text-xl font-bold">
                                    {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                                </p>
                                {vehicle.precoPromocional && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm line-through text-muted-foreground">
                                            {formatPrice(vehicle.preco)}
                                        </p>
                                        <Badge variant="destructive" className="text-xs">
                                            {Math.round((1 - (vehicle.precoPromocional / vehicle.preco)) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                                {vehicle.parcelamento && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        ou {vehicle.parcelamento}x de {formatPrice((vehicle.precoPromocional || vehicle.preco) / vehicle.parcelamento)}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        
                        <CardFooter className="p-4 pt-0">
                            <Button
                                variant="default"
                                className="w-full group-hover:bg-primary/90 transition-colors"
                                onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                            >
                                Ver detalhes <ChevronRight size={16} className="ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {vehicles.length === 0 && (
                <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">Nenhum veículo encontrado</h3>
                <p className="text-muted-foreground">
                    Tente ajustar seus filtros de busca ou volte mais tarde.
                </p>
                </div>
            )}
            </>
        )}
        </div>
    );
};

export default VehicleListingPage;