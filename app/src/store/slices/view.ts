import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isPending, isRejectedWithValue } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';

import vehicleService from '~/src/services/vehicle';

export interface ViewState {
    totalViews: number;           // Contagem total de visualizações
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ViewState = {
    totalViews: 0,
    loading: false,
    error: null,
    success: false,
};

// Tipos para ações rejeitadas
type RejectedAction = AnyAction & { payload?: string };

export const registerVehicleView = createAsyncThunk<string, string>(
    'views/registerVehicleView',
    async (vehicleId: string, { rejectWithValue }) => {
        try {
        await vehicleService.registerVehicleView(vehicleId);
        return vehicleId;
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to register view');
        }
    }
);

export const fetchVehicleViews = createAsyncThunk<number, void>(
    'views/fetchVehicleViews',
    async (_, { rejectWithValue }) => {
        try {
        return await vehicleService.getVehicleViews();
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch vehicle views');
        }
    }
);

const viewSlice = createSlice({
    name: 'views',
    initialState,
    reducers: {
        resetViewState: () => initialState,
        // Removemos setCurrentVehicle pois não é responsabilidade deste slice
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchVehicleViews.fulfilled, (state, action: PayloadAction<number>) => {
            state.loading = false;
            state.totalViews = action.payload;
            state.success = true;
        })
        .addCase(registerVehicleView.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
            // A contagem específica por veículo será tratada no vehicleSlice
        });

    
    },
});

export const { resetViewState } = viewSlice.actions;
export default viewSlice.reducer;