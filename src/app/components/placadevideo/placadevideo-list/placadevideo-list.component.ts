import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-placadevideo-list',
  standalone: true,
  imports: [ MatInputModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, CommonModule, MatCardModule],
  templateUrl: './placadevideo-list.component.html',
  styleUrl: './placadevideo-list.component.css'
})
export class PlacadevideoListComponent implements OnInit {
  displayedColumns: string[] = [
    'id', 
    'modelo', 
    'categoria', 
    'preco', 
    'resolucao', 
    'energia', 
    'idFan',
    'barramento', 
    'suporteRayTracing', 
    'memoria', 
    'fornecedor',
    'acao'
  ];
  placasDeVideo: PlacaDeVideo[] = [];
  placasDeVideoFiltradas: PlacaDeVideo[] = [];

  // variáveis de controle de paginação
  totalRecords = 0;
  pageSize = 20;
  page = 0;
  
  placaSelecionada: PlacaDeVideo | null = null;

  fanLabels: { [key: number]: string } = {
    0: 'Single',
    1: 'Double',
    2: 'Triple'
  };
  snackbarService: any;
  router: any;

  constructor(private placaDeVideoService: PlacaDeVideoService,
    public placaService: PlacaDeVideoService
  ) { }
  
  ngOnInit(): void {
    this.carregarPlacasDeVideo();
  }

  ngOnChanges() {
    document.body.style.overflow = this.placaSelecionada ? 'hidden' : '';
  }

  carregarPlacasDeVideo(): void {
    // Primeiro busca a informação da paginação
    this.placaDeVideoService.getPaginacao(this.page, this.pageSize).subscribe(paginacao => {
      this.totalRecords = paginacao.totalRecords;
  
      // Depois busca os dados da página
      this.placaDeVideoService.findAll(this.page, this.pageSize).subscribe(data => {
        this.placasDeVideo = data;
        this.placasDeVideoFiltradas = data;
      });
    });
  }
  

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.placasDeVideoFiltradas = this.placasDeVideo.filter(e =>
      e.modelo.toLowerCase().includes(valor) || e.categoria.toLowerCase().includes(valor)
    );
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarPlacasDeVideo();
  }

  verDetalhes(id: number): void {
    this.placaDeVideoService.findById(id).subscribe(data => {
      console.log("Detalhes da placa:", data);
      this.placaSelecionada = data;

      if (this.placaSelecionada.listaImagem?.length > 0) {
        console.log("URL da imagem:", this.placaService.getImagemUrl(this.placaSelecionada.listaImagem[0]));
      }
    });
  }

  excluir(placasdevideo: PlacaDeVideo): void {
      if (placasdevideo.id != null) {
        this.placaDeVideoService.delete(placasdevideo).subscribe({
          next: () => {
            this.carregarPlacasDeVideo();  // Recarregar os placasdevideos após exclusão
          },
          error: (erroResponse) => {
            console.log('Erro ao excluir', JSON.stringify(erroResponse));
          },
        });
      }
    } 
}
