import { Component, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarService } from '../../../../services/sidebar.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatList, MatListItem, MatListModule, MatNavList } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebarAdmin',
  imports: [MatSidenavModule, RouterModule, MatToolbarModule, MatDrawer,
            MatDrawerContent, MatNavList, MatListItem, RouterOutlet, MatListModule, MatIconModule],
  templateUrl: './sidebarAdmin.component.html',
  styleUrl: './sidebarAdmin.component.css'
})
export class SidebarComponent {

  @ViewChild("drawer") public drawer!: MatDrawer;

  constructor(private sidebarService: SidebarService) {

  }

  ngOnInit() {
    this.sidebarService.sideNavToggleSubject.subscribe(
      () => {
        this.drawer?.toggle();
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

}
