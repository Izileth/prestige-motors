import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import vehicleService, { 
} from '~/src/services/vehicle';

import type {
    VehicleSearchParams, 
    VehicleCreateInput, 
    VehicleUpdateInput, 
    ReviewCreateInput 
} from '~/src/services/vehicle'

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  anoFabricacao: number;
  anoModelo: number;
  preco: number;
  precoPromocional?: number;
  descricao?: string;
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
  imagens: VehicleImage[];
  isFavorite?: boolean;
  status: 'DISPONIVEL' | 'VENDIDO' | 'RESERVADO';
  createdAt: string;
  updatedAt: string;
  visualizacoes: number;
  vendedorId: string;
  vendedor: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
  };
  videos: VehicleVideo[];
  especificacoes: Record<string, unknown> | null;
  localizacao: {
    cidade: string;
    estado: string;
  } | null;
  
  
  avaliacoes: Review[];
  reviewStats: ReviewStats;
}

export interface VehicleImage {
  id: string;
  url: string;
  isMain?: boolean;
  ordem?: number;
  publicId?: string;
}

export interface VehicleVideo {
  id: string;
  url: string;
}
export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  rating: number;
  comentario: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    nome: string;
    avatar: string | null;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface VehicleStats {
  totalVehicles: number;
  byFuelType: Record<string, number>;
  byCategory: Record<string, number>;
  averagePrice: number;
}

export interface VehicleState {
  vehicles: Vehicle[];
  featuredVehicles: Vehicle[];
  favorites: Vehicle[];
  userVehicles: Vehicle[]; // Novo estado para veículos do usuário
  vendorVehicles: Vehicle[]; // Novo estado para veículos por vendedor
  currentVehicle: Vehicle | null;
  reviews: Review[];
  stats: VehicleStats | null;
  userStats: VehicleStats | null; // Novo estado para estatísticas do usuário
  views: number; // Novo estado para visualizações
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: VehicleState = {
  vehicles: [],
  featuredVehicles: [],
  favorites: [],
  userVehicles: [], // Inicializado
  vendorVehicles: [], // Inicializado
  currentVehicle: null,
  reviews: [],
  stats: null,
  userStats: null, // Inicializado
  views: 0, // Inicializado
  loading: false,
  error: null,
  success: false,
};

// Thunks assíncronos
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchAll',
  async (params: VehicleSearchParams = {}, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicles(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicles');
    }
  }
);

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicle');
    }
  }
);


export const createVehicle = createAsyncThunk<Vehicle, VehicleCreateInput>(
  'vehicles/create',
  async (data, { rejectWithValue }) => {
    try {
      return await vehicleService.createVehicle(data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create vehicle');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/update',
  async ({ id, data }: { id: string; data: VehicleUpdateInput }, { rejectWithValue }) => {
    try {
      return await vehicleService.updateVehicle(id, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update vehicle');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await vehicleService.deleteVehicle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete vehicle');
    }
  }
);

export const fetchFeaturedVehicles = createAsyncThunk(
  'vehicles/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getFeaturedVehicles();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch featured vehicles');
    }
  }
);

export const fetchUserFavorites = createAsyncThunk(
  'vehicles/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getUserFavorites();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch favorites');
    }
  }
);

export const addFavorite = createAsyncThunk(
  'vehicles/addFavorite',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.addFavorite(vehicleId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add favorite');
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'vehicles/removeFavorite',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await vehicleService.removeFavorite(vehicleId);
      return vehicleId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove favorite');
    }
  }
);

export const fetchVehicleReviews = createAsyncThunk(
  'vehicles/fetchReviews',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleReviews(vehicleId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'vehicles/createReview',
  async ({ vehicleId, data }: { vehicleId: string; data: ReviewCreateInput }, { rejectWithValue }) => {
    try {
      return await vehicleService.createReview(vehicleId, data);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create review');
    }
  }
);

export const uploadVehicleImages = createAsyncThunk(
  'vehicles/uploadImages',
  async ({ vehicleId, files }: { vehicleId: string; files: File[] }, { rejectWithValue }) => {
    try {
      return await vehicleService.uploadImages(vehicleId, files);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload images');
    }
  }
);

export const deleteVehicleImage = createAsyncThunk(
  'vehicles/deleteImage',
  async ({ vehicleId, imageUrl }: { vehicleId: string; imageUrl: string }, { rejectWithValue }) => {
    try {
      await vehicleService.deleteVehicleImage(vehicleId, imageUrl);
      return imageUrl; // Retorna a URL removida para atualizar o estado
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete image');
    }
  }
);

export const fetchVehicleStats = createAsyncThunk(
  'vehicles/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleStats();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  }
);

// Novos thunks para os endpoints adicionais
export const fetchUserVehicles = createAsyncThunk(
  'vehicles/fetchUserVehicles',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getUserVehicles();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user vehicles');
    }
  }
);

export const fetchUserVehicleStats = createAsyncThunk(
  'vehicles/fetchUserVehicleStats',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getUserVehicleStats();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user vehicle stats');
    }
  }
);

export const registerVehicleView = createAsyncThunk(
  'vehicles/registerView',
  async (vehicleId: string, { rejectWithValue }) => {
    try {
      await vehicleService.registerVehicleView(vehicleId);
      return vehicleId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to register view');
    }
  }
);

export const fetchVehicleViews = createAsyncThunk(
  'vehicles/fetchViews',
  async (_, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehicleViews();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicle views');
    }
  }
);

export const fetchVehiclesByVendor = createAsyncThunk(
  'vehicles/fetchByVendor',
  async (vendorId: string, { rejectWithValue }) => {
    try {
      return await vehicleService.getVehiclesByVendor(vendorId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vendor vehicles');
    }
  }
);

export const updateStatus = createAsyncThunk(
  'vehicles/updateStatus',
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      return await vehicleService.updateVehicleStatus(id, status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update vehicle status');
    }
  }
);

export const uploadVehicleVideos = createAsyncThunk(
  'vehicles/uploadVideos',
  async ({ vehicleId, file }: { vehicleId: string; file: File }, { rejectWithValue }) => {
    try {
      return await vehicleService.uploadVideos(vehicleId, file);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload videos');
    }
  }
);

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    resetVehicleState: () => initialState,
    setCurrentVehicle: (state, action: PayloadAction<Vehicle | null>) => {
      state.currentVehicle = action.payload;
    },
  },
  extraReducers: (builder) => {

    // Casos específicos
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles = action.payload;
    });

    builder.addCase(fetchVehicleById.fulfilled, (state, action) => {
      state.currentVehicle = {
        ...action.payload, // Mantém todos os campos originais
        imagens: action.payload.imagens || [] // Garante array mesmo se vazio
      };
    });
    builder.addCase(createVehicle.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles.push(action.payload);
      state.success = true;
    });

    builder.addCase(updateVehicle.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      if (state.currentVehicle?.id === action.payload.id) {
        state.currentVehicle = action.payload;
      }
      state.success = true;
    });

    builder.addCase(deleteVehicle.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles = state.vehicles.filter(vehicle => vehicle.id !== action.payload);
      if (state.currentVehicle?.id === action.payload) {
        state.currentVehicle = null;
      }
      state.success = true;
    });

    builder.addCase(fetchFeaturedVehicles.fulfilled, (state, action) => {
      state.loading = false;
      state.featuredVehicles = action.payload;
    });

    builder.addCase(fetchUserFavorites.fulfilled, (state, action) => {
      state.loading = false;
      state.favorites = action.payload;
    });

    builder.addCase(addFavorite.fulfilled, (state, action) => {
      state.loading = false;
      
      // Garante que favorites seja um array
      if (!Array.isArray(state.favorites)) {
        state.favorites = [];
      }
      
      // Atualiza o status nos veículos
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id 
          ? { ...vehicle, isFavorite: true } 
          : vehicle
      );
      
      // Atualiza o veículo atual se for o mesmo
      if (state.currentVehicle?.id === action.payload.id) {
        state.currentVehicle.isFavorite = true;
      }
    });

    builder.addCase(removeFavorite.fulfilled, (state, action) => {
      state.loading = false;
      
      // Garante que favorites seja um array antes de filtrar
      if (Array.isArray(state.favorites)) {
        state.favorites = state.favorites.filter(vehicle => vehicle.id !== action.payload);
      }
      
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload ? { ...vehicle, isFavorite: false } : vehicle
      );
      
      if (state.currentVehicle?.id === action.payload) {
        state.currentVehicle.isFavorite = false;
      }
    });

    builder.addCase(fetchVehicleReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    });

    builder.addCase(createReview.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
      state.success = true;
    });

      // Veículos do usuário
    builder.addCase(fetchUserVehicles.fulfilled, (state, action) => {
      state.loading = false;
      state.userVehicles = action.payload;
    });

    // Estatísticas do usuário
    builder.addCase(fetchUserVehicleStats.fulfilled, (state, action) => {
      state.loading = false;
      state.userStats = action.payload;
    });

    // Visualizações
    builder.addCase(fetchVehicleViews.fulfilled, (state, action) => {
      state.loading = false;
      state.views = action.payload;
    });

    // Veículos por vendedor
    builder.addCase(fetchVehiclesByVendor.fulfilled, (state, action) => {
      state.loading = false;
      state.vendorVehicles = action.payload;
    });

    // Atualizar status
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      state.userVehicles = state.userVehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      if (state.currentVehicle?.id === action.payload.id) {
        state.currentVehicle = action.payload;
      }
      state.success = true;
    });

    // Registrar visualização
    builder.addCase(registerVehicleView.fulfilled, (state, action) => {
      if (state.currentVehicle?.id === action.payload) {
        state.currentVehicle.visualizacoes = (state.currentVehicle.visualizacoes || 0) + 1;
      }
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload
          ? { ...vehicle, visualizacoes: (vehicle.visualizacoes || 0) + 1 }
          : vehicle
      );
    });

    // Upload Imagem
    builder.addCase(uploadVehicleImages.fulfilled, (state, action) => {
      state.loading = false;
      state.currentVehicle = action.payload;
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      state.success = true;
    });

    
    // Upload de vídeos
    builder.addCase(uploadVehicleVideos.fulfilled, (state, action) => {
      state.loading = false;
      state.currentVehicle = action.payload;
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      state.userVehicles = state.userVehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      state.success = true;
    });

    // Deletar Imagem
    builder.addCase(deleteVehicleImage.fulfilled, (state, action) => {
      // Atualiza o currentVehicle se estiver carregado
      if (state.currentVehicle) {
        state.currentVehicle.imagens = state.currentVehicle.imagens?.filter(
          img => img.id !== action.payload  
        );
      }
      
      // Atualiza a lista de veículos
      state.vehicles = state.vehicles.map(vehicle => {
        if (vehicle.id === action.meta.arg.vehicleId) {
          return {
            ...vehicle,
            imagens: vehicle.imagens?.filter(img => img.id !== action.payload) 
          };
        }
        return vehicle;
      });
    });

    builder.addCase(fetchVehicleStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });

    builder.addMatcher(
      (action) => action.type.endsWith('/pending'),
      (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      }
    );

    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        state.loading = false;
        state.error = action.type as string;
      }
    );
   
  },
});

export const { resetVehicleState, setCurrentVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;