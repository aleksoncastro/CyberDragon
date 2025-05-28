export interface Cartao {
  id?: number; // DefaultEntity possui id
  numero: string;
  titular: string;
  dataValidade: string; // LocalDate no backend, usar string (yyyy-MM-dd) no frontend
  cvv: string;
  cpf: string;
}
