import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PedidoADMService} from '../../../services/pedidoADM.service';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';

@Component({
  selector: 'app-pedido-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './pedidos-list.component.html',
  styleUrls: ['./pedidos-list.component.css']  // corrigido aqui
})
export class PedidoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'cliente', 'data', 'valorTotal', 'status', 'acoes'];

  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;

  // Paginação
  totalRecords = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private pedidoService: PedidoADMService, 
    public placaService: PlacaDeVideoService,) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.pedidoService.findAll().subscribe(data => {
      this.pedidos = data;
      this.pedidosFiltrados = data;
      this.totalRecords = data.length; // usado pelo paginator, mesmo sem backend
    }, error => {
      console.error('Erro ao carregar pedidos:', error);
      alert('Erro ao carregar pedidos.');
    });
  }
  

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
  
      this.pedidosFiltrados = this.pedidos.filter(p =>
        (p.cliente?.nome?.toLowerCase() || '').includes(valor) ||
        (p.data?.toString().toLowerCase() || '').includes(valor) ||
        (p.valorTotal?.toString().toLowerCase() || '').includes(valor)
      );
      
    
  }

  paginar(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarPedidos();
  }

  verDetalhes(id: number): void {
    this.pedidoService.findById(id).subscribe(data => {
      console.log("Detalhes da placa:", data);
      this.pedidoSelecionado = data;
    });
  }

  excluir(id: number): void {
    if (confirm('Deseja realmente excluir este pedido?')) {
      this.pedidoService.cancelarPedido(id).subscribe(() => {
        this.carregarPedidos();
      }, error => {
        console.error('Erro ao excluir pedido:', error);
        alert('Erro ao excluir pedido.');
      });
    }
  }
}
