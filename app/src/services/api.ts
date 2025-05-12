
import axios from 'axios';
import { AxiosError } from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:4242/api';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Importante para cookies HTTP-only
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Interceptor de resposta para tratar erros
    api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
        // Redirecionar para login se não autenticado
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        }
        return Promise.reject(error);
    }
);

export default api;