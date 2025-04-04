export interface PlacaDeVideo {
    fan: number;
    id?: number;
    modelo: string;
    categoria: string;
    preco: number;
    resolucao: string;
    energia: number;
    descricao: string;
    compatibilidade: number;
    clockBase: number;
    clockBoost: number;
    suporteRayTracing: boolean;
    memoria: Memoria;
    saidas: SaidaVideo[];
    tamanho: Tamanho;
    fornecedor: Fornecedor;
    listaImagem: string[];
  }
  
  export interface Memoria {
    id?: number;
    tipo: string;
    capacidade: number;
  }
  
  export interface SaidaVideo {
    id?: number;
    tipo: string;
    quantidade: number;
  }
  
  export interface Tamanho {
    id?: number;
    largura: number;
    altura: number;
  }
  
  export interface Fornecedor {
    id?: number;
    nome: string;
    cnpj: string;
  }
  