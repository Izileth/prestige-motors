import api from './api';
import type { Vehicle, Review, VehicleStats } from '~/src/store/slices/vehicle';

// Parâmetros para busca de veículos
export interface VehicleSearchParams {
    userId?: string;
    marca?: string;
    modelo?: string;
    precoMin?: number;
    precoMax?: number;
    anoMin?: number;
    anoMax?: number;
    combustivel?: string;
    cambio?: string;
    categoria?: string;
    destaque?: boolean;
}

// Tipo para criação/atualização de veículo (sem o ID e campos gerados pelo servidor)

export type VehicleUpdateInput = Partial<VehicleCreateInput>;

export interface VehicleCreateInput {
    marca: string;
    modelo: string;
    anoFabricacao: number;
    anoModelo: number;
    preco: number;
    quilometragem: number;
    tipoCombustivel: 'GASOLINA' | 'ETANOL' | 'FLEX' | 'DIESEL' | 'ELETRICO' | 'HIBRIDO' | 'GNV';
    cambio: 'MANUAL' | 'AUTOMATICO' | 'SEMI_AUTOMATICO' | 'CVT';
    cor: string;
    portas: number;
    finalPlaca?: number;
    carroceria: 'HATCH' | 'SEDAN' | 'SUV' | 'PICAPE' | 'COUPE' | 'CONVERSIVEL' | 'PERUA' | 'MINIVAN' | 'VAN' | 'BUGGY' | 'OFFROAD';
    potencia?: number;
    motor?: string;
    categoria: 'HYPERCAR' | 'SUPERCAR' | 'SPORTS_CAR' | 'CLASSIC_MUSCLE' | 'MODERN_MUSCLE' | 'RETRO_SUPER' | 'DRIFT_CAR' | 'TRACK_TOY' | 'OFFROAD' | 'BUGGY' | 'PICKUP_4X4' | 'SUV' | 'HOT_HATCH' | 'SALOON' | 'GT' | 'RALLY' | 'CONCEPT';
    classe: 'D' | 'C' | 'B' | 'A' | 'S1' | 'S2' | 'X';
    destaque?: boolean;
    seloOriginal?: boolean;
    aceitaTroca?: boolean;
    parcelamento?: number;
    localizacaoId?: string;
    descricao?: string;
    precoPromocional?: number;
    status?: 'DISPONIVEL' | 'VENDIDO' | 'RESERVADO'; // Opcional (pode ter um valor padrão no backend)
}

// Tipo para criação de review (sem campos gerados pelo servidor)
export type ReviewCreateInput = Pick<Review, 'rating' | 'comentario'>;

export const vehicleService = {

    async getVehicles(params?: VehicleSearchParams): Promise<Vehicle[]> {
        const response = await api.get('/vehicles', { params });
        console.log('Resposta da API:', response.data); // ← Verifique aqui
        return response.data?.data || []; // Ou o caminho correto para o array
    },

    async getVehicleById(id: string): Promise<Vehicle> {
        const response = await api.get(`/vehicles/${id}`);
        return response.data;
    },

    async createVehicle(data: VehicleCreateInput): Promise<Vehicle> {
        const response = await api.post<Vehicle>('/vehicles', data);
        return response.data;
    },

    async updateVehicle(id: string, data: VehicleUpdateInput): Promise<Vehicle> {
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data;
    },

    async deleteVehicle(id: string): Promise<void> {
        await api.delete(`/vehicles/${id}`);
    },

    async registerVehicleView(vehicleId: string): Promise<void> {
        await api.post(`/vehicles/${vehicleId}/views`);
    },
    
    async getVehicleViews(): Promise<number> {
        const response = await api.get('/vehicles/me/views');
        return response.data;
    },

    async getFeaturedVehicles(): Promise<Vehicle[]> {
        const response = await api.get('/vehicles', { params: { destaque: true } });
        return response.data;
    },


    async addFavorite(vehicleId: string): Promise<{id: string}> {
        const response = await api.post(`/vehicles/${vehicleId}/favorites`);
        return { id: vehicleId };
    },

    async removeFavorite(vehicleId: string): Promise<{id: string}> {
        await api.delete(`/vehicles/${vehicleId}/favorites`);
        return { id: vehicleId };
    },

    async getUserFavorites(): Promise<Vehicle[]> {
        console.log('Fetching favorites...');
        const response = await api.get('/vehicles/me/favorites');

        console.log('Raw response:', response.data);
        
        // Verifica se a resposta tem a estrutura esperada
        if (response.data && Array.isArray(response.data.data)) {
          // Mapeia para extrair apenas os veículos e adiciona isFavorite: true
            return response.data.data.map((item: { vehicle: Vehicle }) => ({
                ...item.vehicle,
                isFavorite: true // Garante que o flag esteja marcado
            }));
        }

        console.log('Processed favorites:', response);
        
        return [];
    },

    async createReview(vehicleId: string, data: ReviewCreateInput): Promise<Review> {
        const response = await api.post(`/vehicles/${vehicleId}/reviews`, data);
        return response.data;
    },

    async getVehicleReviews(vehicleId: string): Promise<Review[]> {
        const response = await api.get(`/vehicles/${vehicleId}/reviews`);
        return response.data;
    },

    async getVehicleStats(): Promise<VehicleStats> {
        const response = await api.get('/vehicles/stats');
        return response.data;
    },

    // Novos métodos adicionados

    async getUserVehicles(): Promise<Vehicle[]> {
        const response = await api.get('/vehicles/me/vehicles');
        return response.data.data || []; // Acessa a propriedade data
    },

    async getUserVehicleStats(): Promise<VehicleStats> {
        const response = await api.get('/vehicles/me/vehicle-stats');
        return response.data.stats || null;
    },

    async getVehiclesByVendor(vendorId: string): Promise<Vehicle[]> {
        const response = await api.get(`/vehicles/vendors/${vendorId}`);
        return response.data;
    },

    async updateVehicleStatus(id: string, status: string): Promise<Vehicle> {
        const response = await api.put(`/vehicles/${id}/status`, { status });
        return response.data;
    },

    async uploadImages(vehicleId: string, files: File[]): Promise<Vehicle> {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file)); // <-- 'images' deve bater com o nome no multer
        
        const response = await api.post(`/vehicles/${vehicleId}/images`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data', // <-- Isso está correto
            },
        });
        return response.data;
    },

    async uploadVideos(vehicleId: string, file: File): Promise<Vehicle> {
        const formData = new FormData();
        formData.append('video', file);
        
        const response = await api.post(`/vehicles/${vehicleId}/videos`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteVehicleImage(vehicleId: string, imageId: string): Promise<void> {
    // Enviar o ID da imagem com um nome de parâmetro mais claro
    await api.delete(`/vehicles/${vehicleId}/images`, {
        data: { imageId } // Usar imageId em vez de imageUrl para maior clareza
    });
}


    
};

export default vehicleService;