import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as userService from '~/src/services/user';
import type { AddressData, UserUpdateData } from '~/src/services/user';

// Interfaces de tipo
export interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar: string | null;
  telefone: string | null;
  cpf: string | null;
  dataNascimento: string | null;
}

export interface Address {
  id: string,
  cep: string,
  logradouro: string,
  numero: string,
  complemento?: string,
  bairro: string,
  cidade:string,
  estado: string,
  pais?: string
  userId: string;
}

export interface VehicleStats {
  _sum: {
    preco: number | null;
  };
  _avg: {
    preco: number | null;
    anoFabricacao: number | null;
    anoModelo: number | null;
  };
  _min: {
    preco: number | null;
  };
  _max: {
    preco: number | null;
  };
}


export interface UserStats {
  totalVehicles: number;
  valorTotalInventario: number;
  precoMedio: number;
  anoFabricacaoMedio: number;
  anoModeloMedio: number;
  precoMinimo: number;
  precoMaximo: number;
}

export interface UserState {
  currentUser: User | null;
  users: User[];
  addresses: Address[];
  stats: UserStats | null; // Adicione esta linha
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UserState = {
  currentUser: null,
  users: [],
  addresses: [],
  stats: null, // Adicione esta linha
  loading: false,
  error: null,
  success: false,
};

// Thunks assíncronos usando createAsyncThunk
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.userService.getUserById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, userData }: { id: string; userData: UserUpdateData }, { rejectWithValue }) => {
    try {
      return await userService.userService.updateUser(id, userData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (id: string, { rejectWithValue }) => {
    try {
      return await userService.userService.getUserStats(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user stats');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'user/fetchAddresses',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userService.userService.getUserAddresses(userId);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch addresses');
    }
  }
);

export const addAddress = createAsyncThunk(
  'user/addAddress',
  async ({ userId, addressData }: { userId: string; addressData: AddressData }, { rejectWithValue }) => {
    try {
      return await userService.userService.createAddress(userId, addressData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add address');
    }
  }
);

export const updateAddress = createAsyncThunk(
  'user/updateAddress',
  async ({ addressId, addressData }: { addressId: string; addressData: AddressData }, { rejectWithValue }) => {
    try {
      return await userService.userService.updateAddress(addressId, addressData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'user/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await userService.userService.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete address');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ userId, file }: { userId: string; file: File }, { rejectWithValue }) => {
    try {
      return await userService.userService.uploadAvatar(userId, file);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to upload avatar');
    }
  }
);

// Slice principal
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {

    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateUser
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.success = true;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteUser
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteUser.fulfilled, (state) => {
      state.loading = false;
      state.currentUser = null;
      state.success = true;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //fetchUserStats

    builder.addCase(fetchUserStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    builder.addCase(fetchUserStats.fulfilled, (state, action: PayloadAction<UserStats>) => {
      state.loading = false;
      state.stats = action.payload;
    });
    
    builder.addCase(fetchUserStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchUserAddresses
    builder.addCase(fetchUserAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
      state.loading = false;
      state.addresses = action.payload;
    });
    builder.addCase(fetchUserAddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // addAddress
    builder.addCase(addAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      state.addresses.push(action.payload);
      state.success = true;
    });
    builder.addCase(addAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // updateAddress
    builder.addCase(updateAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      state.loading = false;
      state.addresses = state.addresses.map(address =>
        address.id === action.payload.id ? action.payload : address
      );
      state.success = true;
    });
    builder.addCase(updateAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // deleteAddress
    builder.addCase(deleteAddress.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
      state.success = true;
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // uploadAvatar
    builder.addCase(uploadAvatar.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.success = true;
    });
    builder.addCase(uploadAvatar.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Exportar ações e reducer
export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;