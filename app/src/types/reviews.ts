export interface Review {
    id: string;
    vehicleId: string;
    userId: string;
    rating: number;
    comentario: string | null;
    createdAt: string;
    updatedAt: string;
    user: {
        nome: string;
        avatar: string | null;
    };
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
}

