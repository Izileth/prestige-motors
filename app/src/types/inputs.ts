import type { Review } from "./reviews";
import type { VehicleCreateInput } from "./vehicle";

export type VehicleUpdateInput = Partial<VehicleCreateInput>;

export type ReviewCreateInput = Pick<Review, 'rating' | 'comentario'>;
