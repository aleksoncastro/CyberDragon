import { SidebarService } from '../../../../services/sidebar.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../services/auth.service';
import { MatDrawer } from '@angular/material/sidenav';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
import { DialogCadastrarClienteComponent } from '../../../usuario/dialog-cadastrar-cliente/dialog-cadastrar-cliente.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-header-cli',
  standalone: true,
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './header-cli.component.html',
  styleUrl: './header-cli.component.css'
})
export class HeaderCliComponent implements OnInit {
  searchQuery: string = '';
  isLogado: boolean = false;
  cliente: Cliente | null = null;

  constructor(
    private sidebarService: SidebarService,
    private router: Router,
    private authService: AuthService,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.authService.getUsuarioLogado().subscribe((usuario) => {
      const token = this.authService.getToken();
      this.isLogado = !!token && !!usuario;
    });
  }

  clickMenu() {
    this.sidebarService.toggle();
  }

  verificarCliente() {
    this.clienteService.findByMe().subscribe({
      next: data => {
        this.cliente = data;
  
        if (!this.cliente) {
          this.dialog.open(DialogCadastrarClienteComponent, {
            width: '400px',
            disableClose: true
          });
        } else {
          this.router.navigate(['cliente/perfil'])
        }
      },
      error: err => {
        console.error("Erro ao carregar usuário", err);
        this.dialog.open(DialogCadastrarClienteComponent, {
          width: '400px',
          disableClose: true
        });
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['placasdevideo-search'], {
        queryParams: { q: query }
      });
    }
  }

  logout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
  }

  buscarPorCategoria(categoria: string) {
    this.router.navigate(['placasdevideo-search'], {
      queryParams: { categoria }
    });
  }

  buscarPorFornecedor(nomeFornecedor: string) {
    this.router.navigate(['placasdevideo-search'], {
      queryParams: { q: nomeFornecedor }
    });
  }
}
