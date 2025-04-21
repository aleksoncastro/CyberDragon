import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Fornecedor } from '../../../models/fornecedor.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fornecedor-list',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule, CommonModule],
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.css']
})
export class FornecedorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'cnpj', 'email', 'acao'];
  fornecedores: Fornecedor[] = [];

  // variaveis de controle de paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  fornecedorSelecionado: Fornecedor | null = null;

  constructor(private fornecedorService: FornecedorService) { }

  fornecedoresFiltrados: Fornecedor[] = [];

  ngOnInit(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(
      data => {
        console.log('Dados recebidos:', data);  // Adicione um log para verificar os dados recebidos
        this.fornecedores = data;
        this.fornecedoresFiltrados = data;
      },
      error => {
        console.error('Erro ao carregar fornecedores:', error);  // Verifique se há erro na chamada
      }
    );
    this.fornecedorService.count().subscribe(
      data => {
        this.totalRecords = data;
      },
      error => {
        console.error('Erro ao carregar o total de fornecedores:', error);  // Verifique se há erro ao contar
      }
    );
  }

  ngOnChanges() {
    document.body.style.overflow = this.fornecedorSelecionado ? 'hidden' : '';
  }


  loadFornecedores(): void {
    this.fornecedorService.findAll(this.page, this.pageSize).subscribe(data => {
      this.fornecedores = data;
      this.fornecedoresFiltrados = data;
    });
    this.fornecedorService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.fornecedoresFiltrados = this.fornecedores.filter(e =>
      e.nome.toLowerCase().includes(valor) || e.cnpj.toLowerCase().includes(valor)
    );
  }

  formatarCnpj(cnpj: string): string {
    if (!cnpj) return '';
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  verDetalhes(id: number): void {
    this.fornecedorService.findById(id).subscribe(data => {
      console.log('Fornecedor selecionado:', data);
      this.fornecedorSelecionado = data;
      document.body.style.overflow = 'hidden'; // <- aqui
    });
  }

  fecharDetalhes(): void {
    this.fornecedorSelecionado = null;
    document.body.style.overflow = ''; // <- resetar
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    //chamando pra executar novamente a consulta
    //caso tenha outras execucoes no ngOnit .. eh interessante criar um metodo de consulta
    this.loadFornecedores();
  }

  excluir(id: number): void {
    if (confirm('Tem certeza de que deseja excluir este fornecedor?')) {
      this.fornecedorService.delete(id).subscribe(() => {
        this.loadFornecedores(); // Recarrega a lista de fornecedores após exclusão
      }, error => {
        console.error('Erro ao excluir fornecedor:', error);
        alert('Erro ao excluir fornecedor.');
      });
    }
  }

}
