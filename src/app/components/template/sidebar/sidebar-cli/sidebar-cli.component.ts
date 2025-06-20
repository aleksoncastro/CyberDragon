import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList, MatListItem, MatListModule } from '@angular/material/list';
import { MatSidenavModule, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';
import { ClienteService } from '../../../../services/cliente.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCadastrarClienteComponent } from '../../../usuario/dialog-cadastrar-cliente/dialog-cadastrar-cliente.component';
import { Cliente } from '../../../../models/cliente.model';

@Component({
  selector: 'app-sidebar-cli',
  imports: [MatSidenavModule, RouterModule, MatToolbarModule, MatDrawer,
    MatDrawerContent, MatNavList, MatListItem, RouterOutlet, MatListModule, MatIconModule, CommonModule],
  templateUrl: './sidebar-cli.component.html',
  styleUrl: './sidebar-cli.component.css'
})
export class SidebarComponent implements OnInit {

  @ViewChild("drawer") public drawer!: MatDrawer;

  cliente: Cliente | null = null;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private clienteService: ClienteService,
    private dialog: MatDialog
  ) { }

  isLogado: boolean = false;
  usuarioNome: string | null = null;

  ngOnInit() {
    this.authService.getUsuarioLogado().subscribe((usuario) => {
      const token = this.authService.getToken();
      this.isLogado = !!token && !!usuario;
      this.usuarioNome = usuario?.username ?? null;
    });

    this.sidebarService.sideNavToggleSubject.subscribe(() => {
      this.drawer?.toggle();
    });
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
          this.router.navigate(['cliente/perfil']);
        }
      },
      error: err => {
        console.error("Erro ao carregar cliente", err);
        this.dialog.open(DialogCadastrarClienteComponent, {
          width: '400px',
          disableClose: true
        });
      }
    });
  }

  irParaPedidos() {this.clienteService.findByMe().subscribe({
    next: data => {
      this.cliente = data;
      if (!this.cliente) {
        this.dialog.open(DialogCadastrarClienteComponent, {
          width: '400px',
          disableClose: true
        });
      } else {
        this.router.navigate(['/cliente/perfil'], {
          queryParams: { secao: 'pedidos' }
        });
      }
    },
    error: err => {
      console.error("Erro ao carregar cliente", err);
      this.dialog.open(DialogCadastrarClienteComponent, {
        width: '400px',
        disableClose: true
      });
    }
  });
  }

  ngAfterViewInit() {
    // Certifique-se de que o drawer está fechado após a inicialização da view
    setTimeout(() => {
      if (this.drawer && this.drawer.opened) {
        this.drawer.close()
      }
    })
  }

  logout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.drawer.close();
    // this.router.navigate(['/login']);
  }

}
