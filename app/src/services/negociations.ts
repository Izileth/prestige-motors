import api from "./api";
import type { Negotiation, NegotiationMessage } from "../types/negociation";

export const negociationsService = {
    async createNegotiation(vehicleId: string, message: string): Promise<Negotiation> {
        const response = await api.post(`/vehicles/${vehicleId}/negotiations`, { message });
        return response.data;
    },

    async getNegotiationById(negotiationId: string): Promise<Negotiation> {
        const response = await api.get(`/negotiations/${negotiationId}`);
        return response.data;
    },

    async getUserNegotiations(): Promise<Negotiation[]> {
        const response = await api.get('/negotiations/me');
        return response.data.data || [];
    },

    async sendNegotiationMessage(negotiationId: string, message: string): Promise<NegotiationMessage> {
        const response = await api.post(`/negotiations/${negotiationId}/messages`, { message });
        return response.data;
    },

    async getNegotiationMessages(negotiationId: string): Promise<NegotiationMessage[]> {
        const response = await api.get(`/negotiations/${negotiationId}/messages`);
        return response.data.data || [];
    },

    async acceptNegotiation(negotiationId: string): Promise<Negotiation> {
        const response = await api.put(`/negotiations/${negotiationId}/accept`);
        return response.data;
    },

    async rejectNegotiation(negotiationId: string): Promise<Negotiation> {
        const response = await api.put(`/negotiations/${negotiationId}/reject`);
        return response.data;
    },

    async counterNegotiation(negotiationId: string, newPrice: number): Promise<Negotiation> {
        const response = await api.put(`/negotiations/${negotiationId}/counter`, { newPrice });
        return response.data;
    },

}

export default negociationsService