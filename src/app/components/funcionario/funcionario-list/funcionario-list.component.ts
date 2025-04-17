import { Component, LOCALE_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { Funcionario } from '../../../models/funcionario';
import { FuncionarioService } from '../../../services/funcionario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-funcionario-list',
  imports: [ DatePipe, MatInputModule, MatPaginatorModule, RouterLink, MatToolbarModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './funcionario-list.component.html',
  styleUrl: './funcionario-list.component.css'
})
export class FuncionarioListComponent {
  displayedColumns: string[] = ['id', 'nome', 'dataNascimento', 'statusFuncionario', 'acao']
  funcionarios: Funcionario[] = []

  // variaveis de controle de paginação
  totalRecords = 0;
  pageSize = 10;
  page = 0;

  constructor(private funcionarioService: FuncionarioService) { }
  
    funcionariosFiltrados: Funcionario[] = [];
  
    ngOnInit(): void {
      this.funcionarioService.findAll(this.page, this.pageSize).subscribe(
        data => {
          console.log('Dados recebidos:', data);  // Adicione um log para verificar os dados recebidos
          this.funcionarios = data;
          this.funcionariosFiltrados = data;
        },
        error => {
          console.error('Erro ao carregar funcionarios:', error);  // Verifique se há erro na chamada
        }
      );
      this.funcionarioService.count().subscribe(
        data => {
          this.totalRecords = data;
        },
        error => {
          console.error('Erro ao carregar o total de funcionarios:', error);  // Verifique se há erro ao contar
        }
      );
    }

    loadFuncionarios(): void {
        this.funcionarioService.findAll(this.page, this.pageSize).subscribe(data => {
          this.funcionarios = data;
          this.funcionariosFiltrados = data;
        });
        this.funcionarioService.count().subscribe(data => {
          this.totalRecords = data;
        });
      }
    
      filtrar(event: any): void {
        const valor = event.target.value.toLowerCase();
        this.funcionariosFiltrados = this.funcionarios.filter(e =>
          e.nome.toLowerCase().includes(valor)
        );
      }
    
      paginar(event: PageEvent): void {
        this.page = event.pageIndex;
        this.pageSize = event.pageSize;
        //chamando pra executar novamente a consulta
        //caso tenha outras execucoes no ngOnit .. eh interessante criar um metodo de consulta
        this.loadFuncionarios();
      }

      getStatusLabel(status: string): string {
        switch (status) {
          case 'ATIVADO':
            return 'Ativado';
          case 'DESATIVADO':
            return 'Desativado';
          default:
            return 'Desconhecido';
        }
      }
    
      excluir(id: number): void {
        if (confirm('Tem certeza de que deseja excluir este funcionario?')) {
          this.funcionarioService.delete(id).subscribe(() => {
            this.loadFuncionarios(); // Recarrega a lista de funcionarios após exclusão
          }, error => {
            console.error('Erro ao excluir funcionario:', error);
            alert('Erro ao excluir funcionario.');
          });
        }
      }
    

}
