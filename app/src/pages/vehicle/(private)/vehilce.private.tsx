import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '~/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Loader2, Edit, Trash2, PlusCircle, Star, Heart, Zap, ShieldCheck, Gauge, Calendar } from 'lucide-react';
import useVehicle from '~/src/hooks/useVehicle';
import { useAuth } from '~/src/hooks/useAuth';
import type { Vehicle } from '~/src/store/slices/vehicle';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '~/components/ui/tooltip';
import { Skeleton } from '~/components/ui/skeleton';
import { formatPrice } from '~/src/lib/ultils';

export function UserVehicleList() {
    const { user } = useAuth();
    const {
        userVehicles = [], // Valor padrão garantido
        loading,
        error,
        fetchUserVehicles, // Nova função específica para veículos do usuário
        deleteVehicle,
        fetchUserFavorites,
        addFavorite,
        removeFavorite,
        favorites,
        updateStatus, // Nova função para atualizar status
        userStats // Estatísticas do usuário (opcional)
    } = useVehicle();

    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [hoveredVehicle, setHoveredVehicle] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchUserVehicles(); // Substitui o fetchVehicles com userId
            fetchUserFavorites();
        }
    }, [user?.id]);

    const vehiclesToRender = Array.isArray(userVehicles) ? userVehicles : [];

    const handleDelete = async (vehicleId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
        
        setIsDeleting(vehicleId);
        try {
            await deleteVehicle(vehicleId);
            // Não precisamos mais do setUserVehicles pois vem do estado
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
        } finally {
            setIsDeleting(null);
        }
    };

    const toggleFavorite = async (vehicleId: string) => {
        const isFavorite = Array.isArray(favorites) ? favorites.some(v => v.id === vehicleId) : false;
        try {
            if (isFavorite) {
                await removeFavorite(vehicleId);
            } else {
                await addFavorite(vehicleId);
            }
            fetchUserFavorites();
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        }
    };

    const handleStatusChange = async (vehicleId: string, newStatus: string) => {
        try {
            await updateStatus({ id: vehicleId, status: newStatus });
            // O estado é atualizado automaticamente pelo Redux
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const isFavorite = (vehicleId: string) => {
        return Array.isArray(favorites) && favorites.some(v => v.id === vehicleId);
    };

    if (loading && !userVehicles.length) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
                <div>
                    <CardTitle className="text-2xl">Meus Veículos</CardTitle>
                    <CardDescription>
                        {userVehicles.length} veículo{userVehicles.length !== 1 ? 's' : ''} cadastrado{userVehicles.length !== 1 ? 's' : ''}
                        {userStats && (
                            <span className="ml-2">
                                • {userStats.totalVehicles} no total
                            </span>
                        )}
                    </CardDescription>
                </div>
                <Button asChild className="gap-2">
                    <Link to="/vehicles/create">
                        <PlusCircle className="h-4 w-4" />
                        Adicionar Veículo
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                {userVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                        <div className="bg-muted/50 p-6 rounded-full">
                            <Zap className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">Nenhum veículo cadastrado</h3>
                        <p className="text-muted-foreground max-w-md">
                            Você ainda não tem veículos cadastrados. Comece anunciando seu primeiro veículo para alcançar potenciais compradores.
                        </p>
                        <Button className="mt-4 gap-2" asChild>
                            <Link to="/vehicles/create">
                                <PlusCircle className="h-4 w-4" />
                                Criar primeiro veículo
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Veículo</TableHead>
                                    <TableHead>Detalhes</TableHead>
                                    <TableHead className="text-right">Preço</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehiclesToRender.map((vehicle) => (
                                    <TableRow 
                                        key={vehicle.id} 
                                        className="hover:bg-muted/50"
                                        onMouseEnter={() => setHoveredVehicle(vehicle.id)}
                                        onMouseLeave={() => setHoveredVehicle(null)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {vehicle.imagens?.length > 0 ? (
                                                        <img
                                                            src={vehicle.imagens.find(img => img.isMain)?.url || vehicle.imagens[0].url}
                                                            alt={`${vehicle.marca} ${vehicle.modelo}`}
                                                            className="h-16 w-24 rounded-md object-cover border"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-16 w-24 rounded-md bg-muted flex items-center justify-center">
                                                            <span className="text-xs text-muted-foreground">Sem imagem</span>
                                                        </div>
                                                    )}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className={`absolute -top-2 -left-2 h-8 w-8 rounded-full transition-all ${hoveredVehicle === vehicle.id ? 'opacity-100' : 'opacity-0'}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFavorite(vehicle.id);
                                                                    }}
                                                                >
                                                                    <Heart
                                                                        className={`h-4 w-4 transition-colors ${isFavorite(vehicle.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
                                                                    />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {isFavorite(vehicle.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                                <div>
                                                    <p className="font-medium line-clamp-1">
                                                        {vehicle.marca} {vehicle.modelo}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {vehicle.anoFabricacao}/{vehicle.anoModelo}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Gauge className="h-3 w-3" />
                                                            {vehicle.quilometragem.toLocaleString('pt-BR')} km
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge variant="outline" className="flex items-center gap-1">
                                                    {vehicle.tipoCombustivel}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {vehicle.cambio}
                                                </Badge>
                                                {vehicle.seloOriginal && (
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <ShieldCheck className="h-3 w-3" />
                                                        Original
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {formatPrice(vehicle.precoPromocional || vehicle.preco)}
                                                </span>
                                                {vehicle.precoPromocional && (
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        {formatPrice(vehicle.preco)}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Badge variant={vehicle.destaque ? 'default' : 'secondary'}>
                                                    {vehicle.destaque ? (
                                                        <span className="flex items-center gap-1">
                                                            <Zap className="h-3 w-3" />
                                                            Destaque
                                                        </span>
                                                    ) : 'Normal'}
                                                </Badge>
                                                <Select
                                                    value={vehicle.status}
                                                    onValueChange={(value) => handleStatusChange(vehicle.id, value)}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                                                        <SelectItem value="RESERVADO">Reservado</SelectItem>
                                                        <SelectItem value="VENDIDO">Vendido</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="outline" size="icon" asChild>
                                                                <Link to={`/vehicles/update/${vehicle.id}`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Editar veículo</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                                onClick={() => handleDelete(vehicle.id)}
                                                                disabled={isDeleting === vehicle.id}
                                                            >
                                                                {isDeleting === vehicle.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Excluir veículo</TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}