export interface ApiError {
    status: number;
    data: {
        message: string;
        code?: string;
        errors?: Record<string, string[]>;
    };
}

export interface KnownError {
    error: {
        message: string;
        statusCode: number;
    };
}

export type AppError = ApiError | KnownError | Error;