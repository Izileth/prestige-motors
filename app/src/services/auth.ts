import api from './api';
import type { User } from '../types/user';
import type { LoginData, RegisterData,  } from '../types/auth';
import type { ForgotPasswordData, ResetPasswordData } from '../types/password';
import type { AuthResponse } from '../types/response';


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

