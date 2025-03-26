export class Fornecedor {
    id?: number;
    nome!: string;
    cnpj!: string;
    email!: string;
    telefones!: { codigoArea: string; numero: string }[];
  }
  
  
