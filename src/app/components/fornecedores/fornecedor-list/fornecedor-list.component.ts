import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatToolbar } from '@angular/material/toolbar';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-fornecedor-list',
  imports: [RouterLink, MatIconModule, MatCardModule, MatTableModule, MatToolbar],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedoresComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'email', 'acao'];

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.listar().subscribe((dados) => {
      this.fornecedores = dados;
    });
  }

  excluir(id: number): void {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.fornecedorService.excluir(id).subscribe(() => {
        this.carregarFornecedores();
      });
    }
  }
}
