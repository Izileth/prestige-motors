import api from './api';

import type { Vehicle, VehicleStats, VehicleCreateInput, VehicleSearchParams } from '../types/vehicle';

import type { Review } from '../types/reviews';

import type { VehicleUpdateInput, ReviewCreateInput } from '../types/inputs';




export const vehicleService = {

    async getVehicles(params?: VehicleSearchParams): Promise<Vehicle[]> {
        // Limpa parâmetros undefined/null/empty
        const cleanParams = Object.fromEntries(
            Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== null && v !== '')
        );

        console.log('Enviando parâmetros para API:', cleanParams); // Debug
        
        const response = await api.get('/vehicles', { 
            params: cleanParams,
            paramsSerializer: {
                indexes: null // Evita notação de colchetes nos arrays
            }
        });
        
        console.log('Resposta da API:', response.config.url); // Verifique a URL final
        return response.data?.data || [];
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
        const response = await api.get('/vehicles', { 
        params: { 
            destaque: true,
            limit: 8,
            sort: '-createdAt'
        } 
        });
        return response.data.data || [];
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
        const response = await api.get('/vehicles/me/favorites', {
        params: {
            include: 'vehicle'
        }
        });
        
        // Processamento mais robusto da resposta
        if (response.data?.data) {
        return response.data.data.map((fav: any) => ({
            ...fav.vehicle,
            isFavorite: true,
            favoritedAt: fav.createdAt
        }));
        }
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