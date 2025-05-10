
export interface LoginData {
    email: string;
    senha: string;
}


export interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    cpf?: string;
    dataNascimento?: string;
}

