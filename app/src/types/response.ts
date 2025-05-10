import type { User } from "./user";

export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}