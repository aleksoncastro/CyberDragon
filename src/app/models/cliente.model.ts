import { Endereco } from './endereco.model';
import { TelefoneCliente } from './telefone-cliente.model';
import { Cartao } from './cartao.model';

export interface Cliente {
  id?: number;
  nome: string;
  dataNascimento: string;  // yyyy-MM-dd
  enderecos: Endereco[];
  telefones: TelefoneCliente[];
  cartoes?: Cartao[];
}
