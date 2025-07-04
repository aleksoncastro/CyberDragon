import { Fornecedor } from "./fornecedor.model";

export class PlacaDeVideo {
  id?: number;
  modelo: string;
  categoria: string;
  preco: number;
  resolucao: string;
  energia: number;
  descricao: string;
  barramento: string;
  clockBase: number;
  clockBoost: number;
  suporteRayTracing: boolean;
  idFan: number;
  fan?: Fan;
  memoria: Memoria;
  saidas: SaidaVideo[];
  tamanho: Tamanho;
  idFornecedor: number;
  fornecedor?: Fornecedor;
  listaImagem?: string[];

  constructor() {
    this.idFan = 0;
    this.modelo = '';
    this.categoria = '';
    this.preco = 0;
    this.resolucao = '';
    this.energia = 0;
    this.descricao = '';
    this.barramento = '';
    this.clockBase = 0;
    this.clockBoost = 0;
    this.suporteRayTracing = false;
    this.memoria = new Memoria();
    this.saidas = [];
    this.tamanho = new Tamanho();
    this.idFornecedor = 0;
    this.listaImagem = [];
  }
}

export class Memoria {
  id?: number;
  tipoMemoria: string;
  capacidade: number;
  larguraBanda: number;
  velocidadeMemoria: number;

  constructor() {
    this.tipoMemoria = '';
    this.capacidade = 0;
    this.larguraBanda = 0;
    this.velocidadeMemoria = 0;
  }
}

export class Fan{
  id?: number;
  label: string;

  constructor(){
    this.label = '';
  }

}

export class SaidaVideo {
  id?: number;
  tipo: string;
  quantidade: number;

  constructor() {
    this.tipo = '';
    this.quantidade = 0;
  }
}

export class Tamanho {
  id?: number;
  largura: number;
  altura: number;
  comprimento: number;

  constructor() {
    this.largura = 0;
    this.altura = 0;
    this.comprimento = 0;
  }
}

