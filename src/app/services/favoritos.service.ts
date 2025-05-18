import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { ItemCarrinho } from '../models/item-carrinho'
import { LocalStorageService } from './local-storage.service'
import { ItemFavorito } from '../models/item-favorito'

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private favoritosSubject = new BehaviorSubject<ItemFavorito[]>([])
  favoritos$ = this.favoritosSubject.asObservable()

  constructor(private localStorageService: LocalStorageService) {
    const favoritosArmazenado = this.localStorageService.getItem('favoritos')
    const itens = favoritosArmazenado ? JSON.parse(favoritosArmazenado) : []
    this.favoritosSubject.next(itens)
  }

  adicionar(item: any): void {
    const favoritosAtual = this.favoritosSubject.value
    const jaExiste = favoritosAtual.some(i => i.id === item.id)

    if (!jaExiste) {
      const itemAdaptado: ItemFavorito = {
        ...item,
        modelo: item.title || item.modelo, // usa 'title' se for fornecido
      }

      favoritosAtual.push(itemAdaptado)
      this.favoritosSubject.next([...favoritosAtual])
      this.atualizarArmazenamentoLocal()
    }
  }

  remover(item: ItemFavorito): void {
    const favoritosAtual = this.favoritosSubject.value
    const atualizados = favoritosAtual.filter(fav => fav.id !== item.id)
    this.favoritosSubject.next(atualizados)
    this.atualizarArmazenamentoLocal()
  }

  removerTudo(): void {
    this.favoritosSubject.next([])
    this.localStorageService.removeItem('favoritos')
  }

  obter(): ItemFavorito[] {
    return this.favoritosSubject.value
  }

  private atualizarArmazenamentoLocal(): void {
    this.localStorageService.setItem('favoritos', JSON.stringify(this.favoritosSubject.value))
  }
}
