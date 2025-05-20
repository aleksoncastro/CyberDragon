import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList, MatListItem, MatListModule } from '@angular/material/list';
import { MatSidenavModule, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sidebar-cli',
  imports: [MatSidenavModule, RouterModule, MatToolbarModule, MatDrawer,
    MatDrawerContent, MatNavList, MatListItem, RouterOutlet, MatListModule, MatIconModule, CommonModule],
  templateUrl: './sidebar-cli.component.html',
  styleUrl: './sidebar-cli.component.css'
})
export class SidebarComponent implements OnInit {

  @ViewChild("drawer") public drawer!: MatDrawer;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router
  ) {

  }

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

  logout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
    this.drawer.close();
    // this.router.navigate(['/login']);
  }

}
