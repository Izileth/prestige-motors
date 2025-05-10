export interface User {
    id: string;
    nome: string;
    email: string;
    role: string;
    avatar: string | null; // Sem opcionais, usar null
    telefone: string | null;
    cpf: string | null;
    dataNascimento: string | null; // String ISO em vez de Date
}

export interface UserUpdateData {
    nome?: string;
    email?: string;
    role?: string;
    avatar?: string | null;
    telefone?: string | null;
    cpf?: string | null;
    dataNascimento?: string | null;
    senhaAtual?: string;
    senha?: string;
}

export interface UserStats {
    totalVehicles: number;
    valorTotalInventario: number;
    precoMedio: number;
    anoFabricacaoMedio: number;
    anoModeloMedio: number;
    precoMinimo: number;
    precoMaximo: number;
}
