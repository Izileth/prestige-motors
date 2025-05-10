import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import negociationsService from '~/src/services/negociations';
import type { Negotiation } from '~/src/types/negociation';


// Adicione ao estado inicial
interface negociationState {
    negotiations: Negotiation[];
    negotiationsLoading: boolean;
    negotiationsError: string | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: negociationState = {
    negotiations: [],
    negotiationsLoading: false,
    negotiationsError: null,
    loading: false,
    error: null,
    success: false,
};

export const createNegotiation = createAsyncThunk(
    'vehicles/createNegotiation',
    async ({ vehicleId, message }: { vehicleId: string; message: string }, { rejectWithValue }) => {
        try {
        return await negociationsService.createNegotiation(vehicleId, message);
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to Create Negociation');
        }
    }
);

export const fetchUserNegotiations = createAsyncThunk(
    'vehicles/fetchUserNegotiations',
    async (_, { rejectWithValue }) => {
        try {
        return await negociationsService.getUserNegotiations();
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to Fetch Negociation');
        }
    }
);

// Adicione os reducers
const negociationSlice = createSlice({
    name: 'negociation',
    initialState,
    reducers: {
        // ... outros reducers ...
        clearNegotiations(state) {
        state.negotiations = [];
        state.negotiationsError = null;
        }
    },
    extraReducers: (builder) => {
        // ... outros builders ...
        
        builder.addCase(createNegotiation.pending, (state) => {
        state.negotiationsLoading = true;
        });
        builder.addCase(createNegotiation.fulfilled, (state, action) => {
        state.negotiationsLoading = false;
        state.negotiations.unshift(action.payload);
        });
        builder.addCase(createNegotiation.rejected, (state, action) => {
        state.negotiationsLoading = false;
        state.negotiationsError = action.payload as string;
        });
        
        builder.addCase(fetchUserNegotiations.pending, (state) => {
        state.negotiationsLoading = true;
        });
        builder.addCase(fetchUserNegotiations.fulfilled, (state, action) => {
        state.negotiationsLoading = false;
        state.negotiations = action.payload;
        });
        builder.addCase(fetchUserNegotiations.rejected, (state, action) => {
        state.negotiationsLoading = false;
        state.negotiationsError = action.payload as string;
        });
    }
});

export const { clearNegotiations } = negociationSlice.actions;
export default negociationSlice.reducer;