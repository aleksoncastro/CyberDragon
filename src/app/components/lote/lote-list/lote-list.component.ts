import { Component, OnInit } from '@angular/core';
import { LoteService } from '../../../services/lote.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { Lote } from '../../../models/lote.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lote-list',
  imports: [MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './lote-list.component.html',
  styleUrls: ['./lote-list.component.css']
})
export class LoteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'codigo', 'estoque', 'dataFabricacao', 'placaDeVideo', 'acao'];
  lotes: Lote[] = [];

  // Variáveis de controle de paginação
  totalRecords = 0;
  pageSize = 2;
  page = 0;

  constructor(private loteService: LoteService) { }

  ngOnInit(): void {
    this.loteService.findAll(this.page, this.pageSize).subscribe(
      data => {
        console.log('Dados recebidos:', data);  // Adicione um log para verificar os dados recebidos
        this.lotes = data;
      },
      error => {
        console.error('Erro ao carregar lotes:', error);  // Verifique se há erro na chamada
      }
    );
    this.loteService.count().subscribe(
      data => {
        this.totalRecords = data;
      },
      error => {
        console.error('Erro ao carregar o total de lotes:', error);  // Verifique se há erro ao contar
      }
    );
  }

  loadLotes(): void {
    this.loteService.findAll(this.page, this.pageSize).subscribe(data => {
      this.lotes = data;
    });
    this.loteService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    // Chamando pra executar novamente a consulta
    // Caso tenha outras execuções no ngOnInit.. é interessante criar um método de consulta
    this.loadLotes();
  }

  excluir(id: number): void {
    if (confirm('Tem certeza de que deseja excluir este lote?')) {
      this.loteService.delete(id).subscribe(() => {
        this.loadLotes(); // Recarrega a lista de lotes após exclusão
      }, error => {
        console.error('Erro ao excluir lote:', error);
        alert('Erro ao excluir lote.');
      });
    }
  }

}
