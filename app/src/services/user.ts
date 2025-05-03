import api from './api';

export interface UserUpdateData {
    nome?: string;
    email?: string;
    role?: string;
    avatar?: string | null;
    telefone?: string | null;
    cpf?: string | null;
    dataNascimento?: string | null;
}

export interface AddressData {
  
    cep: string,
    logradouro: string,
    numero: string,
    complemento: string,
    bairro: string,
    cidade:string,
    estado: string,
    pais: string
}

export const userService = {
    async getUsers() {
        const response = await api.get('/users/');
        return response.data;
    },

    async getUserById(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async updateUser(id: string, data: UserUpdateData) {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },

    async deleteUser(id: string) {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    async getUserStats(id: string) {
        const response = await api.get(`/users/${id}/stats`);
        return response.data;
    },

    // Address operations
    async getUserAddresses(userId: string) {
        const response = await api.get(`/users/${userId}/addresses`);
        return response.data;
    },

    async createAddress(userId: string, data: AddressData) {
        const response = await api.post(`/users/${userId}/addresses`, data);
        return response.data;
    },

    async updateAddress(addressId: string, data: AddressData) {
        const response = await api.put(`/users/addresses/${addressId}`, data);
        return response.data;
    },

    async deleteAddress(addressId: string) {
        const response = await api.delete(`/users/addresses/${addressId}`);
        return response.data;
    },

    async uploadAvatar(userId: string, file: File) {
        const formData = new FormData();
        formData.append('avatar', file);
        
        const response = await api.post(`/users/${userId}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        });
        return response.data;
    }
};