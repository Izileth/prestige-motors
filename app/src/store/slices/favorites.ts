import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import vehicleService from '~/src/services/vehicle';
import type { Vehicle } from '~/src/types/vehicle';


export interface FavoritesState {
    favorites: Vehicle[]; // Agora armazena apenas os veículos favoritados
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null,
    success: false,
};

// Thunks (mantidos os mesmos)
    export const fetchUserFavorites = createAsyncThunk(
    'favorites/fetchUserFavorites',
    async (_, { rejectWithValue }) => {
        try {
        return await vehicleService.getUserFavorites();
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch favorites');
        }
    }
);


export const addFavorite = createAsyncThunk(
    'favorites/addFavorite',
    async (vehicleId: string, { rejectWithValue }) => {
        try {
        // Supondo que seu serviço retorne o veículo completo após favoritar
        const vehicle = await vehicleService.addFavorite(vehicleId);
        return vehicle as Vehicle; // Força a tipagem
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to add favorite');
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'favorites/removeFavorite',
    async (vehicleId: string, { rejectWithValue }) => {
        try {
        await vehicleService.removeFavorite(vehicleId);
        return vehicleId;
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to remove favorite');
        }
    }
);

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        resetFavoritesState: () => initialState, // Nome mais específico
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserFavorites.fulfilled, (state, action) => {
            state.loading = false;
            state.favorites = action.payload;
        })
        .addCase(addFavorite.fulfilled, (state, action) => {
            state.loading = false;
            state.favorites.push(action.payload);
            state.success = true;
        })
        
        .addCase(removeFavorite.fulfilled, (state, action) => {
            state.loading = false;
            state.favorites = state.favorites.filter(vehicle => vehicle.id !== action.payload);
            state.success = true;
        });
    
    },
});

export const { resetFavoritesState } = favoritesSlice.actions;
export default favoritesSlice.reducer;