export interface Address {
    id: string,
    cep: string,
    logradouro: string,
    numero: string,
    complemento?: string,
    bairro: string,
    cidade:string,
    estado: string,
    pais?: string
    userId: string;
}


export interface AddressData {
    cep: string,
    logradouro: string,
    numero: string,
    complemento?: string,
    bairro: string,
    cidade: string,
    estado: string,
    pais?: string
}
