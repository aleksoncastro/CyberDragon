import { Component, OnInit } from '@angular/core';
import { ItemCarrinho } from '../../models/item-carrinho';
import { CarrinhoService } from '../../services/carrinho.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {

  carrinhoItens: ItemCarrinho[] = [];

  constructor(private carrinhoService: CarrinhoService,
    private router: Router) { }

    ngOnInit(): void {
        this.carrinhoService.carrinho$.subscribe(itens => {
          this.carrinhoItens = itens;
        });
    }

    removerItem(item: ItemCarrinho): void {
        this.carrinhoService.remover(item);
    }

    calcularTotal(): number {
        return this.carrinhoItens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    finalizarCompra() {
      // boa sorte!!
    }

}
