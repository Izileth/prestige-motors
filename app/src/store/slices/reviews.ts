import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { isPending, isRejectedWithValue } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';

import vehicleService from '~/src/services/vehicle';
import type { ReviewCreateInput } from '~/src/types/inputs';
import type { Review } from '~/src/types/reviews';

export interface ReviewState {
    reviews: Review[];
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null,
    success: false,
};

// Tipos para ações rejeitadas
type RejectedAction = AnyAction & { payload?: string };

export const fetchVehicleReviews = createAsyncThunk<Review[], string>(
    'reviews/fetchVehicleReviews',
    async (vehicleId: string, { rejectWithValue }) => {
        try {
        return await vehicleService.getVehicleReviews(vehicleId);
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch reviews');
        }
    }
);

export const createReview = createAsyncThunk<
    Review,
    { vehicleId: string; data: ReviewCreateInput }
    >(
    'reviews/createReview',
    async ({ vehicleId, data }, { rejectWithValue }) => {
        try {
        return await vehicleService.createReview(vehicleId, data);
        } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : 'Failed to create review');
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReviewState: () => initialState,
        // Remove setCurrentVehicle pois não é responsabilidade deste slice
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchVehicleReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
            state.loading = false;
            state.reviews = action.payload;
        })
        .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
            state.loading = false;
            state.reviews.push(action.payload);
            state.success = true;
        });
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;