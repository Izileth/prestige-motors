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
export type VehicleCreateInput = Omit<Vehicle, 'id' | 'imagens' | 'isFavorite'>;
export type VehicleUpdateInput = Partial<VehicleCreateInput>;

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

    async getFeaturedVehicles(): Promise<Vehicle[]> {
        const response = await api.get('/vehicles', { params: { destaque: true } });
        return response.data;
    },

    async addFavorite(vehicleId: string): Promise<Vehicle> {
        const response = await api.post(`/vehicles/${vehicleId}/favorites`);
        return response.data; 
    },

    async removeFavorite(vehicleId: string): Promise<void> {
        await api.delete(`/vehicles/${vehicleId}/favorites`);
    },

    async getUserFavorites(): Promise<Vehicle[]> {
        const response = await api.get('/vehicles/me/favorites');
        return response.data;
    },

    async createReview(vehicleId: string, data: ReviewCreateInput): Promise<Review> {
        const response = await api.post(`/vehicles/${vehicleId}/reviews`, data);
        return response.data;
    },

    async getVehicleReviews(vehicleId: string): Promise<Review[]> {
        const response = await api.get(`/vehicles/${vehicleId}/reviews`);
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
    

    async deleteVehicleImage(vehicleId: string, imageUrl: string): Promise<void> {
        await api.delete(`/vehicles/${vehicleId}/images`, {
          data: { imageUrl } // Envia a URL da imagem a ser removida no corpo da requisição
        });
    },

    async getVehicleStats(): Promise<VehicleStats> {
        const response = await api.get('/vehicles/stats');
        return response.data;
    }
};

export default vehicleService;