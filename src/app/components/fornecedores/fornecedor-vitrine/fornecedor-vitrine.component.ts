import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';

@Component({
  selector: 'app-fornecedor-vitrine',
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
    FormsModule
  ],
  templateUrl: './fornecedor-vitrine.component.html',
  styleUrl: './fornecedor-vitrine.component.css'
})
export class FornecedorVitrineComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'cnpj', 'email', 'telefones'];
  fornecedores: Fornecedor[] = [];
  fornecedoresFiltrados: Fornecedor[] = [];

  totalRecords = 0;
  pageSize = 10;
  page = 0;

  termoBusca = '';
  isLoading = false;

  constructor(
    private fornecedorService: FornecedorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.termoBusca = query;
        this.buscarFornecedores();
      }
    });
  }

  buscarFornecedores(): void {
    const busca = this.termoBusca.toLowerCase().trim();

    if (!busca) {
      this.fornecedoresFiltrados = [];
      return;
    }

    this.isLoading = true;

    this.fornecedorService.findAll().subscribe({
      next: fornecedores => {
        this.fornecedores = fornecedores.filter(f =>
          f.nome.toLowerCase().includes(busca) ||
          f.cnpj.toLowerCase().includes(busca) ||
          (f.email && f.email.toLowerCase().includes(busca))
        );
        this.page = 0;
        this.atualizarPagina();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.fornecedoresFiltrados = [];
      }
    });
  }

  atualizarPagina(): void {
    const inicio = this.page * this.pageSize;
    const fim = inicio + this.pageSize;
    this.fornecedoresFiltrados = this.fornecedores.slice(inicio, fim);
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.atualizarPagina();
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }  
}
