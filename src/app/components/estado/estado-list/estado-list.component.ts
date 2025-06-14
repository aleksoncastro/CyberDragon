import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';


import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-estado-list',
  imports: [MatInputModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './estado-list.component.html',
  styleUrl: './estado-list.component.css'
})
export class EstadoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'sigla', 'acao'];
  estados: Estado[] = [];
  // variaveis de controle de paginação
  totalRecords= 0;
  pageSize = 10;
  page =0;
  formGroup: any;
  router: any;


  constructor(
    private estadoService: EstadoService,
    //private dialogService: DialogService,
    //private snackbarService: SnackBarService,
  ) { }

  estadosFiltrados: Estado[] = [];

  ngOnInit(): void {
   this.loadEstados();
  }

  loadEstados(): void {
    this.estadoService.findAll(this.page, this.pageSize).subscribe(data => {
      this.estados = data.results;
      this.estadosFiltrados = this.estados;
      this.totalRecords = data.count;
    });
  }

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.estadosFiltrados = this.estados.filter(e =>
      e.nome.toLowerCase().includes(valor) || e.sigla.toLowerCase().includes(valor)
    );
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    //chamando pra executar novamente a consulta
    //caso tenha outras execucoes no ngOnit .. eh interessante criar um metodo de consulta
    this.loadEstados();
  }

  excluir(estado: Estado): void {
    if (estado.id != null) {
      this.estadoService.delete(estado).subscribe({
        next: () => {
          this.loadEstados();  // Recarregar os estados após exclusão
        },
        error: (erroResponse) => {
          console.log('Erro ao excluir', JSON.stringify(erroResponse));
        },
      });
    }
  }

}