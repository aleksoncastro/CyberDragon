import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../../../services/sidebar.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Usuario } from '../../../../models/usuario.model';
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header-admin',
  imports: [RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatMenuModule
  ],
  templateUrl: './header-admin.component.html',
  styleUrl: './header-admin.component.css'
})
export class HeaderAdminComponent implements OnInit, OnDestroy {
  usuarioLogado: Usuario | null = null;
  private subscription: Subscription = new Subscription();
  searchQuery: string = '';

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService) {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.obterUsuarioLogado();
  }

  obterUsuarioLogado() {
    this.subscription.add(this.authService.getUsuarioLogado().subscribe(
      usuario => this.usuarioLogado = usuario
    ));
  }

  deslogar() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
  }
  

  clickMenu() {
    this.sidebarService.toggle();
  }

}
