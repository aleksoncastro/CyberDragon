import { Component, ElementRef, signal, ViewChild, type OnInit } from "@angular/core"
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
import { ItemFavorito } from "../../../models/item-favorito"
import { FavoritosService } from "../../../services/favoritos.service"
import { LoteService } from "../../../services/lote.service"
import { MatExpansionModule } from "@angular/material/expansion"

type Card = {
  id: number;
  title: string;
  fornecedor: string;
  tipoMemoria: string;
  capacidade: number;
  larguraBanda: number;
  preco: number;
  imageUrl: string;
};

@Component({
  selector: "app-placadevideo-detail",
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatExpansionModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCardModule, MatDividerModule, MatTabsModule, RouterModule],
  templateUrl: "./placadevideo-detail.component.html",
  styleUrls: ["./placadevideo-detail.component.css"],
})
export class PlacaDeVideoDetailComponent implements OnInit {
  placaDeVideo: PlacaDeVideo = new PlacaDeVideo()
  selectedImageIndex = 0
  isLoading = true
  precoParcelado = 0
  valorParcela = 0
  qtdTotal = 0
  cards = signal<Card[]>([]);
  placa: PlacaDeVideo[] = [];
  iconCarrinho = 'shopping_cart';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private placaDeVideoService: PlacaDeVideoService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar,
    private favoritosService: FavoritosService,
    private loteService: LoteService
  ) { }

  cardsOfertas = signal<Card[]>([]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.loadPlacaDeVideo(Number(id));
      this.carregarPlacas();
    } else {
      this.router.navigate(["/placasdevideo"])
    }
  }



@ViewChild('scrollContainer') scrollContainer!: ElementRef;

scrollRight() {
  const lista = this.cardsOfertas();
  if (lista.length > 0) {
    const primeiro = lista[0];
    const restante = lista.slice(1);
    this.cardsOfertas.set([...restante, primeiro]);

    // animação suave (opcional)
    const container = this.scrollContainer.nativeElement;
    container.scrollLeft = 0; // garante início
    setTimeout(() => {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }, 0);
  }
}

scrollLeft() {
  const lista = this.cardsOfertas();
  if (lista.length > 0) {
    const ultimo = lista[lista.length - 1];
    const restante = lista.slice(0, -1);
    this.cardsOfertas.set([ultimo, ...restante]);

    const container = this.scrollContainer.nativeElement;
    container.scrollLeft = 300; // simula scroll à frente
    setTimeout(() => {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }, 0);
  }
}



  carregarPlacas() {
    this.placaDeVideoService.findAll(0, 20).subscribe((data) => {
      const cards = this.converterParaCards(data);
      this.cardsOfertas.set(cards);
    });
  }

  converterParaCards(placas: PlacaDeVideo[]): Card[] {
    return placas.map((placa) => ({
      id: placa.id!,
      title: placa.modelo,
      tipoMemoria: placa.memoria.tipoMemoria,
      fornecedor: placa.fornecedor?.nome ?? 'Fornecedor não informado',
      capacidade: placa.memoria.capacidade,
      larguraBanda: placa.memoria.larguraBanda,
      preco: placa.preco,
      imageUrl: placa.listaImagem?.length
        ? this.placaDeVideoService.getImagemUrl(placa.listaImagem[0])
        : 'assets/imagem-nao-disponivel'
    }));
  }

  adicionarAoCarrinho(card: Card): void {
    this.carrinhoService.adicionar({
      id: card.id,
      modelo: card.title,
      preco: card.preco,
      fornecedor: card.fornecedor,
      capacidade: card.capacidade,
      tipoMemoria: card.tipoMemoria,
      larguraBanda: card.larguraBanda,
      quantidade: 1,
      imageUrl: card.imageUrl
    });


    this.showSnackBarTopPosition('Adicionado ao carrinho');
  }

  loadPlacaDeVideo(id: number): void {
    this.isLoading = true
    this.placaDeVideoService.findById(id).subscribe({
      next: (data) => {
        this.placaDeVideo = data;
        this.calcularPrecos();
        this.quantidadePlaca(data.id!);
        this.isLoading = false;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error("Erro ao carregar placa de vídeo:", error)
        this.snackBar.open("Erro ao carregar detalhes do produto", "Fechar", {
          duration: 3000,
        });
        this.isLoading = false;
        this.router.navigate(["/placasdevideo"]);
      },
    })
  }

  quantidadePlaca(id: number): void {
    this.loteService.findByPlacasEmLotes(id).subscribe({
      next: (lotes) => {
        this.qtdTotal = lotes.reduce((total, lote) => total + lote.estoque, 0);
      },
      error: (err) => {
        console.error("Erro ao buscar lotes:", err);
        this.qtdTotal = 0;
      }

    })
  }

  verDetalhes(id: number): void {
  this.router.navigate(['placadevideo-detail/', id]);
}

  calcularPrecos(): void {
    // Calcula o preço parcelado (exemplo: acréscimo de 17.65%)
    this.precoParcelado = this.placaDeVideo.preco * 1.1765;
    // Calcula o valor da parcela em 12x
    this.valorParcela = this.precoParcelado / 10;
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

  adicionarOuRemoverFavorito(): void {
    const placa = this.placaDeVideo;

    const item: ItemFavorito = {
      id: placa.id!,
      title: placa.modelo,
      fornecedor: placa.fornecedor?.nome ?? 'Fornecedor não informado',
      tipoMemoria: placa.memoria.tipoMemoria,
      capacidade: placa.memoria.capacidade,
      larguraBanda: placa.memoria.larguraBanda,
      preco: placa.preco,
      imageUrl: placa.listaImagem?.length
        ? this.placaDeVideoService.getImagemUrl(placa.listaImagem[0])
        : 'assets/imagem-nao-disponivel',
      quantidade: 1
    };

    if (this.isFavorito(item.id)) {
      this.favoritosService.remover(item);
      this.showSnackBarTopPosition('Removido dos favoritos');
    } else {
      this.favoritosService.adicionar(item);
      this.showSnackBarTopPosition('Adicionado aos favoritos');
    }
  }


  isFavorito(id: number): boolean {
    return this.favoritosService.obter().some(item => item.id === id);
  }

  showSnackBarTopPosition(content: any) {
    this.snackBar.open(content, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }


  voltar(): void {
    this.router.navigate(["/placasdevideo"])
  }
}