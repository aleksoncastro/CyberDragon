import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrinhoService } from '../../../services/carrinho.service';
import { ClienteService } from '../../../services/cliente.service';
import { PedidoService } from '../../../services/pedido.service';
import { ItemCarrinho } from '../../../models/item-carrinho';
import { Endereco } from '../../../models/endereco.model';
import { Cliente } from '../../../models/cliente.model';
import { Pedido, ItemPedido } from '../../../models/pedido.model';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pedido-pagamento',
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
      MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, MatCardModule, CommonModule],
  templateUrl: './pedido-pagamento.component.html',
  styleUrls: ['./pedido-pagamento.component.css']
})
export class PedidoPagamentoComponent implements OnInit {

  carrinhoItens: ItemCarrinho[] = [];
  enderecos: Endereco[] = [];
  cliente!: Cliente;

  pagamentoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carrinhoItens = this.carrinhoService.obter();

    this.pagamentoForm = this.fb.group({
      enderecoId: [null, Validators.required],
      tipoPagamento: [1, Validators.required] // 1 - Pix, 2 - Boleto, 3 - Cartão
    });

    this.clienteService.findByMe().subscribe({
      next: (cliente) => {
        this.cliente = cliente;
        this.enderecos = cliente.enderecos || [];
        if (this.enderecos.length > 0) {
          this.pagamentoForm.patchValue({ enderecoId: this.enderecos[0].id });
        }
      },
      error: (err) => {
        console.error('Erro ao buscar cliente:', err);
      }
    });
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }

  obterIdCartaoSelecionado(): number {
  // Aqui você deve puxar o cartão selecionado pelo cliente
  // Por enquanto, se você não tem essa tela, usa um fixo:
  return 123; // <- simula um id de cartão salvo
}


  confirmarPagamento() {
  if (this.pagamentoForm.invalid) {
    this.pagamentoForm.markAllAsTouched();
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const { enderecoId, tipoPagamento } = this.pagamentoForm.value;
  const enderecoSelecionado = this.enderecos.find(e => e.id === Number(enderecoId));

  if (!enderecoSelecionado) {
    alert('Endereço inválido.');
    return;
  }

  const itensPedido = this.carrinhoItens.map(item => ({
    idProduto: item.id,
    quantidade: item.quantidade
  }));

  // 👇 Aqui definimos o idCartao dinamicamente
  const idCartao = tipoPagamento === 3 ? this.obterIdCartaoSelecionado() : 0;
  // Se você ainda não tem um método para isso, pode ser fixo por enquanto.

  const pedido = {
    valorTotal: this.calcularTotal(),
    listaItemPedido: itensPedido,
    idEndereco: Number(enderecoId),
    tipoPagamento: Number(tipoPagamento),
    idCartao: idCartao
  };

  console.log('🔗 JSON enviado para o backend:', JSON.stringify(pedido, null, 2));

  this.pedidoService.create(pedido).subscribe({
    next: (response) => {
      alert('Pedido criado com sucesso! ID: ' + response.id);
      this.carrinhoService.removerTudo();
      this.router.navigate(['/placasdevideo']);
    },
    error: (err) => {
      console.error(err);
      alert('Erro ao processar pagamento.');
    }
  });
}


}
