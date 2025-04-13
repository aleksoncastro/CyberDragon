import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { MatInputModule } from '@angular/material/input';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-placadevideo-vitrine',
  standalone: true,
  imports: [MatInputModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, CommonModule, MatProgressSpinnerModule, FormsModule],
  templateUrl: './placadevideo-vitrine.component.html',
  styleUrl: './placadevideo-vitrine.component.css'
})
export class PlacadevideoVitrineComponent implements OnInit {
  displayedColumns: string[] = [
    'modelo',
    'categoria',
    'preco',
    'resolucao',
    'memoria',
    'fornecedor',
    'listaImagem',

  ];
  placasDeVideo: PlacaDeVideo[] = [];
  placasDeVideoFiltradas: PlacaDeVideo[] = [];
  fornecedores: Fornecedor[] = [];

  // variáveis de controle de paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  termoBusca = '';
  isLoading= false;


  constructor(
    private placaService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    });

    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.termoBusca = query;
        this.buscarPlacas(); // chama o método de busca com o termo
      }
    });
  }

  buscarPlacas(): void {
    const busca = this.termoBusca.toLowerCase().trim();
  
    if (!busca) {
      this.placasDeVideoFiltradas = [];
      return;
    }

    this.isLoading = false;

    // Tenta buscar o fornecedor pelo nome
    this.fornecedorService.findByNome(busca).subscribe({
      next: fornecedor => {
        const idFornecedor = fornecedor.id;
  
        this.placaService.findAll(0, 1000).subscribe(placas => {
          this.placasDeVideo = placas.filter(p =>
            p.modelo.toLowerCase().includes(busca) ||
            p.categoria.toLowerCase().includes(busca) ||
            p.idFornecedor === idFornecedor
          );
  
          this.page = 0;
          this.atualizarPagina();
        });
      },
      error: () => {
        // Se não encontrar fornecedor, busca só por modelo/categoria
        this.placaService.findAll(0, 1000).subscribe(placas => {
          this.placasDeVideo = placas.filter(p =>
            p.modelo.toLowerCase().includes(busca) ||
            p.categoria.toLowerCase().includes(busca)
          );
  
          this.page = 0;
          this.atualizarPagina();
        });
      }
    });
  }

  atualizarPagina(): void {
    const inicio = this.page * this.pageSize;
    const fim = inicio + this.pageSize;
    this.placasDeVideoFiltradas = this.placasDeVideo.slice(inicio, fim);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.atualizarPagina();
  }
  
}
