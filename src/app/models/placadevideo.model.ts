export class PlacaDeVideo {
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
  idFan: number;
  memoria: Memoria;
  saidas: SaidaVideo[];
  tamanho: Tamanho;
  idFornecedor: number;
  listaImagem: string[];

  constructor() {
    this.idFan = 0;
    this.modelo = '';
    this.categoria = '';
    this.preco = 0;
    this.resolucao = '';
    this.energia = 0;
    this.descricao = '';
    this.compatibilidade = 0;
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

export class SaidaVideo {
  id?: number;
  tipoMemoria: string;
  quantidade: number;

  constructor() {
    this.tipoMemoria = '';
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

