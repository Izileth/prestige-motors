import api from './api';
import type { SaleData, SaleStats, UpdateSaleData } from '../types/sale';




export const saleService = {
    async createSale(data: SaleData) {
        const response = await api.post('/sales', data);
        return response.data;
    },

    async getSaleById(id: string) {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },

    async updateSale(id: string, data: UpdateSaleData) {
        const response = await api.put(`/sales/${id}`, data);
        return response.data;
    },

    // Histórico de compras do usuário (como comprador)
    async getPurchasesByUser(userId: string) {
        const response = await api.get(`/sales/buyers/${userId}`);
        return response.data;
    },

    // Histórico de vendas do usuário (como vendedor)
    async getSalesBySeller(userId: string) {
        const response = await api.get(`/sales/sellers/${userId}`);
        return response.data;
    },

    async getSalesByVehicle(vehicleId: string) {
        const response = await api.get(`/sales/vehicles/${vehicleId}`);
        return response.data;
    },

    async getUserSalesStats(userId: string): Promise<SaleStats> {
        const response = await api.get(`/sales/${userId}/stats`);
        return response.data;
    },

    async getSalesStats(): Promise<SaleStats> {
        const response = await api.get('/sales/stats');
        return response.data;
    }
};