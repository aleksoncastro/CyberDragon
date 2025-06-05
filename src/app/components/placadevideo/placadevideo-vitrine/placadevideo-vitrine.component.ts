import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  imports: [
    MatInputModule, 
    MatPaginatorModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatTableModule, 
    CommonModule, 
    MatProgressSpinnerModule, 
    FormsModule,
    RouterLink
  ],
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
    'acoes'
  ];
  
  placasDeVideo: PlacaDeVideo[] = [];
  placasDeVideoFiltradas: PlacaDeVideo[] = [];
  fornecedores: Fornecedor[] = [];

  // variáveis de controle de paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  termoBusca = '';
  isLoading = false;

  constructor(
    private placaService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;
    });

    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.termoBusca = query;
        this.buscarPlacasPorTexto(); // Usar o método do backend
      } else {
        this.carregarTodasPlacas();
      }
    });
  }

  // Método atualizado para usar o serviço do backend
  buscarPlacasPorTexto(): void {
    const busca = this.termoBusca.trim();
  
    if (!busca) {
      this.placasDeVideoFiltradas = [];
      return;
    }

    this.isLoading = true;

    // Usar o método findByTexto do serviço
    this.placaService.findByTexto(busca, this.page, this.pageSize).subscribe({
      next: (data) => {
        this.placasDeVideo = data;
        this.totalRecords = data.length; // Em um cenário real, viria do backend
        this.atualizarPagina();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao buscar placas de vídeo:', error);
        this.placasDeVideoFiltradas = [];
        this.isLoading = false;
      }
    });
  }

  carregarTodasPlacas(): void {
    this.isLoading = true;
    this.placaService.findAll(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.placasDeVideo = data;
        this.totalRecords = data.length;
        this.atualizarPagina();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar placas de vídeo:', error);
        this.isLoading = false;
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
    
    if (this.termoBusca) {
      this.buscarPlacasPorTexto();
    } else {
      this.carregarTodasPlacas();
    }
  }

  // Método para navegar para pesquisa avançada
  irParaPesquisaAvancada(): void {
    this.router.navigate(['/placasdevideo/search'], {
      queryParams: this.termoBusca ? { q: this.termoBusca } : {}
    });
  }

  getImageUrl(nomeImagem: string): string {
    return this.placaService.getImagemUrl(nomeImagem);
  }
}