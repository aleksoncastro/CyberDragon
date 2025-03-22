import { Estado } from "./estado.model";

export class Municipio {
    id!: number;
    nome!: string;
    estado!: Estado; // Referência ao Estado
}
