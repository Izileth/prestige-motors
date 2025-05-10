import type { Vehicle } from "./vehicle";
export interface Negotiation {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'countered' | 'accepted' | 'rejected' | 'completed';
  currentPrice: number;
  originalPrice: number;
  createdAt: string;
  updatedAt: string;
  vehicle?: Vehicle;
  messages?: NegotiationMessage[];
}

export interface NegotiationMessage {
  id: string;
  negotiationId: string;
  senderId: string;
  message: string;
  isPriceOffer: boolean;
  priceAmount?: number;
  createdAt: string;
}