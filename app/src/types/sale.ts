export interface Sale {
    id: string;
    vehicleId: string;
    compradorId: string;
    vendedorId: string;
    precoVenda: number;
    formaPagamento: string;
    parcelas?: number;
    observacoes?: string;
    dataVenda: string;
    status: 'PENDENTE' | 'CONCLUIDA' | 'CANCELADA';
    vehicle?: {
        marca: string;
        modelo: string;
        anoFabricacao: number;
        imagem?: string;
    };
    comprador?: {
        nome: string;
        email: string;
        avatar?: string;
    };
    vendedor?: {
        nome: string;
        email: string;
    };
}
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