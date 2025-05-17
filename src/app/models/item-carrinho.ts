export interface ItemCarrinho { 
    id: number;
    modelo: string;
    quantidade: number;
    preco: number;
    fornecedor: string;
    capacidade: number;
    tipoMemoria: string;
    larguraBanda: number;
    imageUrl?: string;
}
