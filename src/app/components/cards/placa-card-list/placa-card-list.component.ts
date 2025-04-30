import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { MatDrawerContainer } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

type Card = {
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

  constructor(private placaService: PlacaDeVideoService) {}

  ngOnInit(): void {
    this.carregarPlacas();
  }

  carregarPlacas() {
    this.placaService.findAll(0, 10).subscribe((data) => {
      this.placa = data;
      this.carregarCards();
    });
  }

  carregarCards() {
    const cards: Card[] = [];
    this.placa.forEach((placa) => {
      cards.push({
        title: placa.modelo,
        tipoMemoria: placa.memoria.tipoMemoria,
        fornecedor: placa.fornecedor?.nome ?? 'Fornecedor não informado',
        capacidade: placa.memoria.capacidade,
        larguraBanda: placa.memoria.larguraBanda,
        preco: placa.preco,
        imageUrl: placa.listaImagem?.length
          ? this.placaService.getImagemUrl(placa.listaImagem[0])
          : 'assets/imagem-nao-disponivel'
      });
    });
  
    this.cards.set(cards);
  }
}
