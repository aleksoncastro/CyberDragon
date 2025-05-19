import { Component, type OnInit } from "@angular/core"
import { ItemCarrinho } from "../../models/item-carrinho"
import { CarrinhoService } from "../../services/carrinho.service"
import { FavoritosService } from "../../services/favoritos.service"
import { Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatBadgeModule } from "@angular/material/badge"
import { MatRippleModule } from "@angular/material/core"
import { trigger, transition, style, animate } from "@angular/animations"
import { ItemFavorito } from "../../models/item-favorito"

@Component({
  selector: "app-favoritos",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule,
    MatRippleModule,
  ],
  templateUrl: "./favoritos.component.html",
  styleUrl: "./favoritos.component.css",
  animations: [
    trigger("itemAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        animate("300ms ease-in", style({ opacity: 0, transform: "translateY(20px)" })),
      ]),
    ]),
  ],
})
export class FavoritosComponent implements OnInit {
  favoritos: ItemFavorito[] = [];

  constructor(
    private favoritosService: FavoritosService,
    private router: Router,
    private carrinhoService: CarrinhoService
  ) { }

  ngOnInit(): void {
    this.favoritosService.favoritos$.subscribe((itens) => {
      this.favoritos = itens
    })
  }

  removerFavorito(item: ItemFavorito): void {
    this.favoritosService.remover(item)
  }

  adicionarAoCarrinho(item: ItemFavorito): void {
    const itemCarrinho: ItemCarrinho = {
      id: item.id,
      modelo: item.title,        // converte title -> modelo
      preco: item.preco,
      fornecedor: item.fornecedor,
      capacidade: item.capacidade,
      tipoMemoria: item.tipoMemoria,
      larguraBanda: item.larguraBanda,
      quantidade: 1,
      imageUrl: item.imageUrl
    };
    this.carrinhoService.adicionar(itemCarrinho);
    this.removerFavorito(item);
  }


  continuarExplorando(): void {
    this.router.navigate(["/placasdevideo"])
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  getImagemUrl(item: ItemFavorito): string {
    return `https://placeholder.co/150?text=${encodeURIComponent(item.title)}`
  }
}
