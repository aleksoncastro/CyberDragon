import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild, ElementRef } from '@angular/core';
import { CarrinhoService } from '../../../services/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-placa-card-list',
  imports: [CommonModule, NgFor, MatCardModule, MatDrawerContainer, MatIconModule],
  templateUrl: './placa-card-list.component.html',
  styleUrl: './placa-card-list.component.css',
})
export class PlacaCardListComponent implements OnInit {
  placa: PlacaDeVideo[] = [];
  cards = signal<Card[]>([]);

  constructor(private placaService: PlacaDeVideoService,
    private carrinhoService: CarrinhoService,
    private snackBar: MatSnackBar
  ) { }

  cardsLancamentos = signal<Card[]>([]);
  cardsOfertas = signal<Card[]>([]);

  ngOnInit(): void {
    this.carregarLancamentos();
    this.carregarPlacas();
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  carregarLancamentos() {

    this.placaService.findByUltimosLancamentos('RTX', 'RX', '40', 'XT').subscribe((data) => {
      const cards = this.converterParaCards(data);
      this.cardsLancamentos.set(cards);
    });
  }

  carregarPlacas() {
    this.placaService.findAll(0, 10).subscribe((data) => {
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
        ? this.placaService.getImagemUrl(placa.listaImagem[0])
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
    
  }

  showSnackBarTopPosition(content: any) {
    this.snackBar.open(content, 'Fechar', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
