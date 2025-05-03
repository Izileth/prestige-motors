import api from './api';

export interface SaleData {
    vehicleId: string;
    compradorId: string;
    precoVenda: number;
    formaPagamento: string;
    parcelas?: number;
    observacoes?: string;
}

export interface UpdateSaleData {
    precoVenda?: number;
    status?: string;
    formaPagamento?: string;
    observacoes?: string;
}

export interface SaleStats {
    totalSales: number;
    totalRevenue: number;
    averageSalePrice: number;
    byPaymentMethod: Record<string, { 
        count: number;
        total: number;
    }>;
    byStatus: Record<string, {
        count: number;
        total: number;
    }>;
    monthlySales: Array<{
        month: string;
        count: number;
        total: number;
        average?: number;
    }>;
    topVehicles: Array<{
        vehicleId: string;
        model: string;
        brand: string;
        salesCount: number;
        totalRevenue: number;
    }>;
    salesTrend?: {
        labels: string[];
        data: number[];
    };
}
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