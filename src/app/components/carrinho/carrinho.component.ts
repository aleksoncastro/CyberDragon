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

  constructor(
    private carrinhoService: CarrinhoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe((itens) => {
      this.carrinhoItens = itens
    })
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
    alert("Compra finalizada com sucesso! Total: R$ " + this.calcularTotal().toFixed(2))
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
