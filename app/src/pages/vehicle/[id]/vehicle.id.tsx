// src/pages/VehicleDetailsPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Slider } from '~/components/ui/slider';
import { Heart, Star, ChevronLeft, Share2, Phone, MessageSquare, MapPin } from 'lucide-react';
import useVehicle from '~/src/hooks/useVehicle';
import type { ReviewCreateInput } from '~/src/services/vehicle';

const VehicleDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        currentVehicle,
        favorites,
        reviews,
        loading,
        error,
        fetchVehicleById,
        fetchVehicleReviews,
        createReview,
        addFavorite,
        removeFavorite,
        fetchUserFavorites
    } = useVehicle();

    

    const [isLoading, setIsLoading] = useState(false);
    const [newReview, setNewReview] = useState<ReviewCreateInput>({
        rating: 5,
        comentario: ''
    });


    useEffect(() => {
        const loadVehicle = async () => {
            if (id) {
            const vehicleData = await fetchVehicleById(id);
            console.log('Dados recebidos:', vehicleData); // Verifique aqui
            }
        };
        loadVehicle();
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                // 1. Busca dados do veículo (se ainda não carregados)
                if (!currentVehicle || currentVehicle.id !== id) {
                await fetchVehicleById(id);
                }

                // 2. Busca reviews (se ainda não carregadas)
                if (!reviews.length) {
                await fetchVehicleReviews(id);
                }

                // 3. Busca favoritos (apenas uma vez, não depende do ID)
                if (!favorites.length) {
                await fetchUserFavorites();
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id]); // Só re-executa se o `id` mudar


    const toggleFavorite = async () => {
        if (!currentVehicle) return;
        
        if (currentVehicle.isFavorite) {
        await removeFavorite(currentVehicle.id);
        } else {
        await addFavorite(currentVehicle.id);
        }
        fetchUserFavorites();
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        await createReview(id, newReview);
        setNewReview({ rating: 5, comentario: '' });
        fetchVehicleReviews(id);
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

    if (loading) return <div className="container mx-auto px-4 py-8 text-center">Carregando...</div>;
    if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Erro: {error}</div>;
    if (!currentVehicle) return <div className="container mx-auto px-4 py-8 text-center">Veículo não encontrado</div>;

    return (
        <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
            <ChevronLeft size={16} className="mr-2" /> Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
            {/* Galeria de imagens */}
            <div className="mb-8">
                {currentVehicle.imagens && currentVehicle.imagens.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    <div className="relative h-96 w-full rounded-lg overflow-hidden">
                    <img
                        src={currentVehicle.imagens[0].url}  // ← Adicione .url aqui
                        alt={currentVehicle.modelo}
                        className="w-full h-full object-cover"
                        />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-white/90 hover:bg-white"
                        onClick={toggleFavorite}
                        >
                        <Heart
                            size={20}
                            className={currentVehicle.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                        />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/90 hover:bg-white">
                        <Share2 size={20} className="text-gray-500" />
                        </Button>
                    </div>
                    {currentVehicle.destaque && (
                        <Badge variant="default" className="absolute top-4 left-4">
                        Destaque
                        </Badge>
                    )}
                    </div>
                    {currentVehicle.imagens.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                        {currentVehicle.imagens.slice(1).map((img, index) => (
                        <div key={index} className="h-24 rounded-md overflow-hidden">
                            <img 
                            src={img.url}  // ← Adicione .url aqui
                            alt="" 
                            className="w-full h-full object-cover" 
                            />
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                ) : (
                <div className="h-96 w-full bg-zinc-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Sem imagens disponíveis</span>
                </div>
                )}
            </div>

            {/* Informações detalhadas */}
            <Tabs defaultValue="details" className="mb-8">
                <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="specs">Especificações</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações ({reviews.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                <Card className="mt-4">
                    <CardHeader className="font-semibold text-lg">Descrição</CardHeader>
                    <CardContent>
                    <p className="text-muted-foreground">
                        {currentVehicle.descricao || 'Nenhuma descrição fornecida.'}
                    </p>
                    </CardContent>
                </Card>
                </TabsContent>
                
                <TabsContent value="specs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                    <CardHeader className="font-semibold text-lg">Informações Gerais</CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Marca/Modelo</span>
                        <span>{currentVehicle.marca} {currentVehicle.modelo}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Ano</span>
                        <span>{currentVehicle.anoFabricacao}/{currentVehicle.anoModelo}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Quilometragem</span>
                        <span>
                        {currentVehicle.quilometragem ? currentVehicle.quilometragem.toLocaleString('pt-BR') : 'N/A'} km
                        </span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Combustível</span>
                        <span>{getFuelType(currentVehicle.tipoCombustivel)}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Câmbio</span>
                        <span>{getTransmissionType(currentVehicle.cambio)}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Cor</span>
                        <span>{currentVehicle.cor}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Portas</span>
                        <span>{currentVehicle.portas}</span>
                        </div>
                    </CardContent>
                    </Card>

                    <Card>
                    <CardHeader className="font-semibold text-lg">Mecânica</CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Motor</span>
                        <span>{currentVehicle.motor || 'Não informado'}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Potência</span>
                        <span>{currentVehicle.potencia ? `${currentVehicle.potencia} cv` : 'Não informado'}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Carroceria</span>
                        <span>{currentVehicle.carroceria}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoria</span>
                        <span>{currentVehicle.categoria}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Classe</span>
                        <span>{currentVehicle.classe}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Final da placa</span>
                        <span>{currentVehicle.finalPlaca || 'Não informado'}</span>
                        </div>
                        <div className="flex justify-between">
                        <span className="text-muted-foreground">Selo original</span>
                        <span>{currentVehicle.seloOriginal ? 'Sim' : 'Não'}</span>
                        </div>
                    </CardContent>
                    </Card>
                </div>
                </TabsContent>
                
                <TabsContent value="reviews">
                <div className="mt-4 space-y-6">
                    {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <Card key={review.id}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium">
                                {review.userId.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium">Usuário Anônimo</h4>
                                <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                    key={i}
                                    size={16}
                                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                ))}
                                </div>
                            </div>
                            <span className="text-sm text-muted-foreground ml-auto">
                                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            </div>
                            <p className="text-muted-foreground mt-2">{review.comentario}</p>
                        </CardContent>
                        </Card>
                    ))
                    ) : (
                    <p className="text-muted-foreground text-center py-8">Nenhuma avaliação ainda.</p>
                    )}

                    <Card>
                    <CardHeader className="font-semibold text-lg">Deixe sua avaliação</CardHeader>
                    <CardContent>
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2">Sua avaliação</label>
                            <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="focus:outline-none"
                                >
                                <Star
                                    size={24}
                                    className={
                                    star <= newReview.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }
                                />
                                </button>
                            ))}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comment" className="block mb-2">
                            Comentário (opcional)
                            </label>
                            <Textarea
                            id="comment"
                            value={newReview.comentario}
                            onChange={(e) => setNewReview({ ...newReview, comentario: e.target.value })}
                            placeholder="Conte sua experiência com este veículo..."
                            />
                        </div>
                        <Button type="submit" className="mt-2">
                            Enviar avaliação
                        </Button>
                        </form>
                    </CardContent>
                    </Card>
                </div>
                </TabsContent>
            </Tabs>
            </div>

            {/* Sidebar com preço e ações */}
            <div>
            <Card className="sticky top-4">
                <CardContent className="p-6 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">
                    {formatPrice(currentVehicle.precoPromocional || currentVehicle.preco)}
                    </h2>
                    {currentVehicle.precoPromocional && (
                    <p className="text-sm line-through text-muted-foreground">
                        {formatPrice(currentVehicle.preco)}
                    </p>
                    )}
                    {currentVehicle.parcelamento && (
                    <p className="text-sm text-muted-foreground mt-1">
                        Ou {currentVehicle.parcelamento}x de{' '}
                        {formatPrice((currentVehicle.precoPromocional || currentVehicle.preco) / currentVehicle.parcelamento)}
                    </p>
                    )}
                </div>
            
                <div className="space-y-4">
                    <Button className="w-full" size="lg" asChild>
                        <a href={`tel:${currentVehicle.vendedor?.telefone || ''}`}>
                            <Phone size={18} className="mr-2" /> Entrar em contato
                        </a>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg" asChild>
                        <a href={`https://wa.me/55${currentVehicle.vendedor?.telefone?.replace(/\D/g, '') || ''}`}>
                            <MessageSquare size={18} className="mr-2" /> Enviar mensagem
                        </a>
                    </Button>
                </div>
                <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Localização</h3>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>
                            {currentVehicle.localizacaoId || 'São Paulo, SP'} {/* Substitua por seu campo de localização real */}
                        </span>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Vendedor</h3>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {currentVehicle.vendedor?.nome?.substring(0, 2).toUpperCase() || 'VD'}
                            </span>
                        </div>
                        <div>
                            <h4 className="font-medium">
                                {currentVehicle.vendedor?.nome || 'Vendedor não informado'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Membro desde {new Date(currentVehicle.createdAt).getFullYear()}
                            </p>
                            {currentVehicle.vendedor?.telefone && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    <Phone size={14} className="inline mr-1" />
                                    {currentVehicle.vendedor.telefone}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    );
};

export default VehicleDetailsPage;