import { Component, OnInit } from '@angular/core';
import { Estado } from '../../../models/estado.model';
import { EstadoService } from '../../../services/estado.service';


import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-estado-list',
  imports: [ MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule],
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


  constructor(
    private estadoService: EstadoService,
    //private dialogService: DialogService,
    //private snackbarService: SnackBarService,
  ) { }

  ngOnInit(): void {
   this.loadEstados();
  }

  loadEstados(): void {
    this.estadoService.findAll(this.page, this.pageSize).subscribe(data => {
      this.estados = data.results;
      this.totalRecords = data.count;
    });
  }

  paginar(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    //chamando pra executar novamente a consulta
    //caso tenha outras execucoes no ngOnit .. eh interessante criar um metodo de consulta
    this.ngOnInit();
  }

}