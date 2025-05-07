import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '~/src/services/auth';
import type { RootState } from '../store';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  avatar: string | null; // Sem opcionais, usar null
  telefone: string | null;
  cpf: string | null;
  dataNascimento: string | null; // String ISO em vez de Date
}

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    resetPassword: {
      status: 'idle' | 'loading' | 'succeeded' | 'failed';
      error: string | null;
    };
}

const initialState: AuthState = {
    user: null,
    status: 'idle',
    error: null,
    resetPassword: {
        status: 'idle',
        error: null,
    },
};

interface LoginData {
    email: string;
    senha: string;
}

interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cpf?: string;
    dataNascimento?: string;
}

interface ResetPasswordData {
    token: string;
    senha: string;
}

// Ação de Registro
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      // Extrair apenas o objeto user da resposta
      return response.user;
    } catch (error) {
        console.log(error,'Erro na Conexão')
        return rejectWithValue(
        'Erro ao registrar usuário'
        );
    }
  }
);

// Ação de Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, senha }: LoginData, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, senha });
      // Extrair apenas o objeto user da resposta
      if (response && response.user) {
        return response.user;
        console.log("Dados recebidos da API:", response.user);
        console.log("Estrutura do objeto user:", response.user);
        
      }
      return rejectWithValue('Dados de usuário não encontrados na resposta');
    } catch (error) {
        console.log(error, 'Erro no Login')
        return rejectWithValue(
             'Erro ao fazer login'
        );
    }
  }
);



// Ação de Logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('Erro durante logout:', error);
      throw error;
    }
  }
);

// Ação de Verificar Sessão
export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
        console.log(error, 'Token Expirado')
        return rejectWithValue('Sessão expirada');
    }
  }
);

// Ação de Esqueci a Senha
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword({ email });
      return response;
    } catch (error) {
        console.log(error, 'Erro na Definição de Senha')
        return rejectWithValue(
            'Erro ao solicitar reset de senha'
        );
    }
  }
);

// Ação de Resetar Senha
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, senha }: ResetPasswordData,
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.resetPassword({ token, senha });
      return response;
    } catch (error) {
        console.log(error, 'Erro na Modificação')
        return rejectWithValue(
            'Erro ao resetar senha'
        );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
    clearResetPasswordStatus(state) {
      state.resetPassword.status = 'idle';
      state.resetPassword.error = null;
    },
    // Adicionar um reducer para definir manualmente o usuário se necessário
    setUser(state, action) {
      state.user = action.payload;
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      // Registro
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Verificar Sessão
      .addCase(checkSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'failed';
        state.user = null;
      })

      // Esqueci a Senha
      .addCase(forgotPassword.pending, (state) => {
        state.resetPassword.status = 'loading';
        state.resetPassword.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.resetPassword.status = 'succeeded';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.resetPassword.status = 'failed';
        state.resetPassword.error = action.payload as string;
      })

      // Resetar Senha
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.status = 'loading';
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.status = 'failed';
        state.resetPassword.error = action.payload as string;
      });
  },
});

export const { logout, clearResetPasswordStatus, setUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectResetPasswordStatus = (state: RootState) =>
  state.auth.resetPassword;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
