import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon"
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from "@angular/material/divider"
import { MatTabsModule } from "@angular/material/tabs"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"

import { MatSnackBar } from "@angular/material/snack-bar"
import { PlacaDeVideo } from "../../../models/placadevideo.model"
import { PlacaDeVideoService } from "../../../services/placadevideo.service"
import { CarrinhoService } from "../../../services/carrinho.service"
import { ItemCarrinho } from "../../../models/item-carrinho"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"


@Component({
  selector: "app-placadevideo-detail",
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatTabsModule, RouterModule],
  templateUrl: "./placadevideo-detail.component.html",
  styleUrls: ["./placadevideo-detail.component.css"],
})
export class PlacaDeVideoDetailComponent implements OnInit {
  placaDeVideo: PlacaDeVideo = new PlacaDeVideo()
  selectedImageIndex = 0
  isLoading = true
  precoParcelado = 0
  valorParcela = 0

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placaDeVideoService: PlacaDeVideoService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.loadPlacaDeVideo(Number(id))
    } else {
      this.router.navigate(["/placasdevideo"])
    }
  }

  loadPlacaDeVideo(id: number): void {
    this.isLoading = true
    this.placaDeVideoService.findById(id).subscribe({
      next: (data) => {
        this.placaDeVideo = data
        this.calcularPrecos()
        this.isLoading = false
      },
      error: (error) => {
        console.error("Erro ao carregar placa de vídeo:", error)
        this.snackBar.open("Erro ao carregar detalhes do produto", "Fechar", {
          duration: 3000,
        })
        this.isLoading = false
        this.router.navigate(["/placasdevideo"])
      },
    })
  }

  calcularPrecos(): void {
    // Calcula o preço parcelado (exemplo: acréscimo de 17.65%)
    this.precoParcelado = this.placaDeVideo.preco * 1.1765
    // Calcula o valor da parcela em 12x
    this.valorParcela = this.precoParcelado / 10
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return "assets/images/placeholder.png"
    return this.placaDeVideoService.getImagemUrl(imagePath)
  }

  addToCart(): void {
  const item: ItemCarrinho = {
    id: this.placaDeVideo.id!,
    modelo: this.placaDeVideo.modelo,
    preco: this.placaDeVideo.preco,
    fornecedor: this.placaDeVideo.fornecedor?.nome ?? 'Fornecedor não informado',
    capacidade: this.placaDeVideo.memoria.capacidade,
    tipoMemoria: this.placaDeVideo.memoria.tipoMemoria,
    larguraBanda: this.placaDeVideo.memoria.larguraBanda,
    quantidade: 1,
    imageUrl: this.placaDeVideo.listaImagem?.length
      ? this.placaDeVideoService.getImagemUrl(this.placaDeVideo.listaImagem[0])
      : 'assets/imagem-nao-disponivel'
  }

  this.carrinhoService.adicionar(item)

  this.router.navigate(["/cliente/carrinho"])
}


  voltar(): void {
    this.router.navigate(["/placasdevideo"])
  }
}