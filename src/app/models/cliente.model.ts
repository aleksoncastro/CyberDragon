import { Endereco } from './endereco.model';
import { TelefoneCliente } from './telefone-cliente.model';
import { Cartao } from './cartao.model';
import { Usuario } from './usuario.model';

export class Cliente {
  id?: number;
  nome!: string;
  dataNascimento!: string;  // yyyy-MM-dd
  enderecos!: Endereco[];
  telefones!: TelefoneCliente[];
  cartoes?: Cartao[];
  usuario?: Usuario;
  listaImagem?: string[];
}
