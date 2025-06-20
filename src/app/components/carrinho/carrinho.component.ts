import { Component, type OnInit } from "@angular/core"
import { ItemCarrinho } from "../../models/item-carrinho"
import { CarrinhoService } from "../../services/carrinho.service"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { MatBadgeModule } from "@angular/material/badge"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatRippleModule } from "@angular/material/core"
import { trigger, transition, style, animate } from "@angular/animations"
import { ClienteService } from "../../services/cliente.service"
import { Cliente } from "../../models/cliente.model"
import { DialogCadastrarClienteComponent } from "../usuario/dialog-cadastrar-cliente/dialog-cadastrar-cliente.component"
import { MatDialog, MatDialogModule } from "@angular/material/dialog"

@Component({
  selector: "app-carrinho",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatRippleModule,
    MatDialogModule,
  ],
  templateUrl: "./carrinho.component.html",
  styleUrl: "./carrinho.component.css",
  animations: [
    trigger("itemAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [animate("300ms ease-in", style({ opacity: 0, transform: "translateY(20px)" }))]),
    ]),
  ],
})


export class CarrinhoComponent implements OnInit {
  carrinhoItens: ItemCarrinho[] = []
  cliente: Cliente | null = null;
  mostrarCardCadastro = false;


  constructor(
    private carrinhoService: CarrinhoService,
    private clienteService: ClienteService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe((itens) => {
      this.carrinhoItens = itens
    })

  }

  irParaInformacoes() {
    this.router.navigate(['cliente/informacoes']);
  }

  verificarCliente() {
  this.clienteService.findByMe().subscribe({
    next: data => {
      this.cliente = data;

      if (!this.cliente) {
        this.dialog.open(DialogCadastrarClienteComponent, {
          width: '400px',
          disableClose: true
        });
      } else {
        this.finalizarCompra();
      }
    },
    error: err => {
      console.error("Erro ao carregar usuário", err);
      this.dialog.open(DialogCadastrarClienteComponent, {
        width: '400px',
        disableClose: true
      });
    }
  });
}



  removerItem(item: ItemCarrinho): void {
    this.carrinhoService.remover(item)
  }

  atualizarQuantidade(item: ItemCarrinho, novaQuantidade: number): void {
    if (novaQuantidade > 0) {
      const itemAtualizado = { ...item, quantidade: novaQuantidade }
      this.carrinhoService.remover(item)
      this.carrinhoService.adicionar(itemAtualizado)
    }
  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + item.preco * item.quantidade, 0)
  }

  finalizarCompra() {
    // Implementação futura
    //alert("Compra finalizada com sucesso! Total: R$ " + this.calcularTotal().toFixed(2))
  this.router.navigate(['/cliente/pedido-pagamento'])
  }

  continuarComprando() {
    this.router.navigate(["/placasdevideo"])
  }

  // Formatar preço para exibição
  formatarPreco(valor: number): string {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  // Função para obter uma imagem placeholder para o item
  getImagemUrl(item: ItemCarrinho): string {
    return `https://placeholder.co/150?text=${encodeURIComponent(item.modelo)}`
  }
}
