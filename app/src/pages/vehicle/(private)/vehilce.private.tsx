import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Loader2, Edit, Trash2, PlusCircle, Star } from 'lucide-react';
import useVehicle from '~/src/hooks/useVehicle';
import { useAuth } from '~/src/hooks/useAuth';
import type { Vehicle } from '~/src/store/slices/vehicle';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';

export function UserVehicleList() {
    const { user } = useAuth();
    const {
        vehicles,
        loading,
        error,
        fetchVehicles,
        deleteVehicle,
        fetchUserFavorites,
        addFavorite,
        removeFavorite,
        favorites
    } = useVehicle();

    const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id) {
        fetchVehicles({ userId: user.id });
        fetchUserFavorites();
        }
    }, [user?.id]);

    useEffect(() => {
        setUserVehicles(vehicles);
    }, [vehicles]);

    const handleDelete = async (vehicleId: string) => {
        if (!window.confirm('Tem certeza que deseja excluir este veículo?')) return;
        
        setIsDeleting(vehicleId);
        try {
        await deleteVehicle(vehicleId);
        setUserVehicles(prev => prev.filter(v => v.id !== vehicleId));
        } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        } finally {
        setIsDeleting(null);
        }
    };

    const toggleFavorite = async (vehicleId: string) => {
        // Verifica se favorites é um array antes de chamar some()
        const isFavorite = Array.isArray(favorites) ? favorites.some(v => v.id === vehicleId) : false;
        try {
        if (isFavorite) {
            await removeFavorite(vehicleId);
        } else {
            await addFavorite(vehicleId);
        }
        } catch (error) {
        console.error('Erro ao atualizar favoritos:', error);
        }
    };

    const isFavorite = (vehicleId: string) => {
        // Função auxiliar para verificar se um veículo está nos favoritos
        return Array.isArray(favorites) && favorites.some(v => v.id === vehicleId);
    };

    if (loading) {
        return (
        <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
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
        <Card>
        <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Meus Veículos</CardTitle>
            <Button asChild>
            <Link to="/vehicles/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Veículo
            </Link>
            </Button>
        </CardHeader>
        <CardContent>
            {userVehicles.length === 0 ? (
            <div className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não tem veículos cadastrados</p>
                <Button className="mt-4" asChild>
                <Link to="/vehicles/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar primeiro veículo
                </Link>
                </Button>
            </div>
            ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {userVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(vehicle.id)}
                        >
                            <Star
                            className={`h-4 w-4 ${
                                isFavorite(vehicle.id)
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-muted-foreground'
                            }`}
                            />
                        </Button>
                        <div>
                            <p className="font-medium">
                            {vehicle.marca} {vehicle.modelo}
                            </p>
                            <p className="text-sm text-muted-foreground">
                            {vehicle.carroceria}
                            </p>
                        </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        {vehicle.anoFabricacao}/{vehicle.anoModelo}
                    </TableCell>
                    <TableCell>
                        {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                        }).format(vehicle.preco)}
                        {vehicle.precoPromocional && (
                        <span className="block text-xs text-muted-foreground line-through">
                            {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                            }).format(vehicle.precoPromocional)}
                        </span>
                        )}
                    </TableCell>
                    <TableCell>
                        <Badge variant={vehicle.destaque ? 'default' : 'secondary'}>
                        {vehicle.destaque ? 'Destaque' : 'Normal'}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <Link to={`/vehicles/update/${vehicle.id}`}>
                            <Edit className="h-4 w-4" />
                            </Link>
                        </Button>
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
                        </div>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </CardContent>
        </Card>
    );
}