export class Funcionario {
    id?: number;
    nome!: string;
    dataNascimento!: string;
    statusFuncionario!: number
    telefones!: { codigoArea: string; numero: string }[];
}
