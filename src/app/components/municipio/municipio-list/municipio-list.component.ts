import { Component, OnInit } from '@angular/core';
import { Municipio } from '../../../models/municipio.model';
import { MunicipioService } from '../../../services/municipio.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-municipio-list',
  standalone: true,
  imports: [ MatPaginatorModule, MatInputModule, MatTableModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterLink],
  templateUrl: './municipio-list.component.html',
  styleUrl: './municipio-list.component.css'
})
export class MunicipioListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'estado', 'acao'];
  municipios: Municipio[] = [];
  // Variáveis de controle de paginação
  totalRecords = 0; 
  pageSize = 5;
  page = 0;
  formGroup: any;
  router: any;

  constructor(private municipioService: MunicipioService) { }

  municipiosFiltrados: Municipio[] = [];

  ngOnInit(): void {
    this.municipioService.findAll(this.page, this.pageSize).subscribe(data => {
      this.municipios = data;
      this.municipiosFiltrados = data;  // Inicializa a lista filtrada com todos os municipios
    });
    this.municipioService.count().subscribe(data => {
      this.totalRecords = data;
    });
  }
  paginar(event: PageEvent) : void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    // chamando para executar novamente a consulta
    // caso tenha outras execucoes no ngOnInit .. eh interessante criar um metodo de consulta
    this.ngOnInit();
  }

  loadMunicipios(): void {
    this.municipioService.findAll().subscribe(data => {
      this.municipios = data;
      this.municipiosFiltrados = data;  // Inicializa a lista filtrada com todos os municipios
    });
  }

  filtrar(event: any): void {
    const valor = event.target.value.toLowerCase();
    this.municipiosFiltrados = this.municipios.filter(e =>
      e.nome.toLowerCase().includes(valor) || e.estado.sigla.toLowerCase().includes(valor)
    );
  }

  excluir(municipio: Municipio): void {
    if (municipio.id != null) {
      this.municipioService.delete(municipio).subscribe({
        next: () => {
          this.loadMunicipios();  // Recarregar os municipios após exclusão
        },
        error: (erroResponse) => {
          console.log('Erro ao excluir', JSON.stringify(erroResponse));
        },
      });
    }
  }
}
