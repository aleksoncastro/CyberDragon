import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';

@Component({
  selector: 'app-placadevideo-list',
  standalone: true,
  imports: [ MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, CommonModule],
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
    'descricao', 
    'idFan',
    'compatibilidade', 
    'clockBase', 
    'clockBoost', 
    'suporteRayTracing', 
    'memoria', 
    'saidas', 
    'tamanho', 
    'fornecedor', 
    'listaImagem', 
    'acao'
  ];
  placasDeVideo: PlacaDeVideo[] = [];

  // variáveis de controle de paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(private placaDeVideoService: PlacaDeVideoService) { }

  ngOnInit(): void {
    this.carregarPlacasDeVideo();
  }

  carregarPlacasDeVideo(): void {
    this.placaDeVideoService.findAll(this.page, this.pageSize).subscribe(data => {
      this.placasDeVideo = data;
    });
    this.placaDeVideoService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarPlacasDeVideo();
  }
}
