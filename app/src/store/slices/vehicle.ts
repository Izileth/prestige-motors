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
  imagens?: string[];
  isFavorite?: boolean;
}

export interface Review {
  id: string;
  vehicleId: string;
  userId: string;
  rating: number;
  comentario?: string;
  createdAt: string;
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
  currentVehicle: Vehicle | null;
  reviews: Review[];
  stats: VehicleStats | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: VehicleState = {
  vehicles: [],
  featuredVehicles: [],
  favorites: [],
  currentVehicle: null,
  reviews: [],
  stats: null,
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

export const createVehicle = createAsyncThunk(
  'vehicles/create',
  async (data: VehicleCreateInput, { rejectWithValue }) => {
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
      state.loading = false;
      state.currentVehicle = action.payload;
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
      state.favorites.push(action.payload);
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? { ...vehicle, isFavorite: true } : vehicle
      );
      if (state.currentVehicle?.id === action.payload.id) {
        state.currentVehicle = { ...state.currentVehicle, isFavorite: true };
      }
    });

    builder.addCase(removeFavorite.fulfilled, (state, action) => {
      state.loading = false;
      state.favorites = state.favorites.filter(vehicle => vehicle.id !== action.payload);
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload ? { ...vehicle, isFavorite: false } : vehicle
      );
      if (state.currentVehicle?.id === action.payload) {
        state.currentVehicle = { ...state.currentVehicle, isFavorite: false };
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

    builder.addCase(uploadVehicleImages.fulfilled, (state, action) => {
      state.loading = false;
      state.currentVehicle = action.payload;
      state.vehicles = state.vehicles.map(vehicle =>
        vehicle.id === action.payload.id ? action.payload : vehicle
      );
      state.success = true;
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