import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { saleService } from '~/src/services/sale';
import type { SaleData, UpdateSaleData } from '~/src/services/sale';

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


export interface SaleStats {
  totalSales?: number;
  totalRevenue?: number;
  averageSalePrice?: number;
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
  topVehicles?: Array<{
    vehicleId: string;
    model: string;
    brand: string;
    salesCount: number;
    totalRevenue?: number;
  }>;
  salesTrend?: {
    labels: string[];
    data: number[];
  };
}

export interface SaleState {
  sales: Sale[];
  purchases: Sale[];
  sellerSales: Sale[];
  vehicleSales: Sale[];
  currentSale: Sale | null;
  stats: {
    global: SaleStats | null;
    user: SaleStats | null;
  };
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SaleState = {
  sales: [],
  purchases: [],
  sellerSales: [],
  vehicleSales: [],
  currentSale: null,
  stats: {
    global: {
      totalSales: 0,
      totalRevenue: 0,
      averageSalePrice: 0,
      byPaymentMethod: {},
      byStatus: {},
      monthlySales: [],
      topVehicles: [],
    },
    user: null // Ou estrutura similar para user stats
  },
  loading: false,
  error: null,
  success: false,
};

// Thunks assíncronos
export const createSale = createAsyncThunk(
  'sales/create',
  async (data: SaleData, { rejectWithValue }) => {
    try {
      return await saleService.createSale(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create sale');
    }
  }
);

export const fetchSaleById = createAsyncThunk(
  'sales/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await saleService.getSaleById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch sale');
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/update',
  async ({ id, data }: { id: string; data: UpdateSaleData }, { rejectWithValue }) => {
    try {
      return await saleService.updateSale(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update sale');
    }
  }
);

export const fetchPurchasesByUser = createAsyncThunk(
  'sales/fetchPurchases',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await saleService.getPurchasesByUser(userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch purchases');
    }
  }
);

export const fetchSalesBySeller = createAsyncThunk(
  'sales/fetchSellerSales',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await saleService.getSalesBySeller(userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch seller sales');
    }
  }
);

export const fetchSalesByVehicle = createAsyncThunk(
  'sales/fetchByVehicle',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      return await saleService.getSalesByVehicle(vehicleId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicle sales');
    }
  }
);

export const fetchGlobalSalesStats = createAsyncThunk(
  'sales/fetchGlobalStats',
  async (_, { rejectWithValue }) => {
    try {
      return await saleService.getSalesStats();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch global stats');
    }
  }
);

export const fetchUserSalesStats = createAsyncThunk(
  'sales/fetchUserStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await saleService.getUserSalesStats(userId); 
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user stats');
    }
  }
);

const saleSlice = createSlice({
  name: 'sale',
  initialState,
  reducers: {
    resetSaleState: () => initialState,
    setCurrentSale: (state, action: PayloadAction<Sale | null>) => {
      state.currentSale = action.payload;
    },
    clearStats: (state) => {
      state.stats = { global: null, user: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSale.fulfilled, (state, action) => {
        state.sales.push(action.payload);
        state.success = true;
      })
      .addCase(fetchSaleById.fulfilled, (state, action) => {
        state.currentSale = action.payload;
      })
      .addCase(updateSale.fulfilled, (state, action) => {
        if (state.currentSale?.id === action.payload.id) {
          state.currentSale = action.payload;
        }
        state.sales = state.sales.map(sale => 
          sale.id === action.payload.id ? action.payload : sale
        );
        state.success = true;
      })
      .addCase(fetchPurchasesByUser.fulfilled, (state, action) => {
        state.purchases = action.payload;
      })
      .addCase(fetchSalesBySeller.fulfilled, (state, action) => {
        state.sellerSales = action.payload;
      })
      .addCase(fetchSalesByVehicle.fulfilled, (state, action) => {
        state.vehicleSales = action.payload;
      })
      .addCase(fetchGlobalSalesStats.fulfilled, (state, action) => {
        state.stats.global = action.payload;
      })
      .addCase(fetchUserSalesStats.fulfilled, (state, action) => {
        state.stats.user = action.payload;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.type as string;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { resetSaleState, setCurrentSale, clearStats } = saleSlice.actions;
export default saleSlice.reducer;