import { Cliente } from "./cliente.model";
import { Lote } from "./lote.model";
import { Pagamento } from "./pagamento.model";


export class Pedido {
  id?: number;
  data!: string;  // LocalDateTime → string no formato ISO
  cliente!: Cliente;
  listaItemPedido!: ItemPedido[];
  valorTotal!: number;
  statusPedido!: UpdateStatusPedido[];
  enderecoEntrega!: EnderecoEntrega;
  pagamento!: Pagamento;
  tipoPagamento!: number;
}

export class ItemPedido {
  id?: number;
  lote!: Lote;
  quantidade!: number;
  preco!: number;  // BigDecimal → number no TypeScript
}

export class EnderecoEntrega {
  id?: number;
  cep!: string;
  cidade!: string;
  estado!: string;
  bairro!: string;
  rua!: string;
  numero!: string;
}

export class UpdateStatusPedido {
  id?: number;
  status!: StatusPedido;
  dataAtualizacao!: string;  // LocalDateTime → string no formato ISO
}

export class StatusPedido{
  id?: number;
  label: string;

  constructor(){
    this.label = '';
  }

}

