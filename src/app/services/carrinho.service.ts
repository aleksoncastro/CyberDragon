import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrinho } from '../models/item-carrinho';
import { LocalStorageService } from './local-storage.service';
import { PlacaDeVideo } from '../models/placadevideo.model';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);
  carrinho$ = this.carrinhoSubject.asObservable();

  constructor(private localStorageService: LocalStorageService) {
    const carrinhoArmazenado = this.localStorageService.getItem('carrinho');
    const itens = carrinhoArmazenado ? JSON.parse(carrinhoArmazenado) : [];
    this.carrinhoSubject.next(itens);
  }

  adicionar(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const itemExistente = carrinhoAtual.find(i => i.id === item.id);

    if (itemExistente) {
      itemExistente.quantidade += item.quantidade;
    } else {
      carrinhoAtual.push(item);
    }

    this.carrinhoSubject.next([...carrinhoAtual]);
    this.atualizarArmazenamentoLocal();
  }


  private atualizarArmazenamentoLocal() {
    this.localStorageService.setItem('carrinho', JSON.stringify(this.carrinhoSubject.value));
  }

  // resolver o problema da quantidade
  remover(item: ItemCarrinho): void {
    const carrinhoAtual = this.carrinhoSubject.value;
    const carrinhoAtualizado = carrinhoAtual.filter(itemCarrinho => itemCarrinho !== item);

    this.carrinhoSubject.next(carrinhoAtualizado);
    this.atualizarArmazenamentoLocal();
  }

  removerTudo(): void {
    this.carrinhoSubject.next([]);
    this.localStorageService.removeItem('carrinho');
  }

  obter(): ItemCarrinho[] {
    return this.carrinhoSubject.value;
  }
} 