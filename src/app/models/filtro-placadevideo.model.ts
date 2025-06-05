export class FiltroPlacaDeVideoDTO {
  categoria?: string;
  memoriaMin?: number;
  memoriaMax?: number;
  precoMin?: number;
  precoMax?: number;
  rayTracing?: boolean;

  constructor() {
    this.categoria = undefined;
    this.memoriaMin = undefined;
    this.memoriaMax = undefined;
    this.precoMin = undefined;
    this.precoMax = undefined;
    this.rayTracing = undefined;
  }
}