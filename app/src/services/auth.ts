import api from './api';

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

interface ForgotPasswordData {
    email: string;
}

interface ResetPasswordData {
    token: string;
    senha: string;
}

// Interfaces para respostas da API
interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/users/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/users/login', data);
        return response.data;
      
        
    },

    async logout(): Promise<void> {
        await api.post('/users/logout');
    },

    async checkSession(): Promise<User | null> {
        try {
            const response = await api.get('/users/check-session');
            return response.data;
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);
            return null;
        }
    },

    async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
        const response = await api.post('/users/forgot-password', data);
        return response.data;
    },

    async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
        const response = await api.post('/users/reset-password', data);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/users/me');
        return response.data;
    }
};

