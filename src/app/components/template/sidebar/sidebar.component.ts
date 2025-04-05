import { Component, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerContent, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarService } from '../../../services/sidebar.service';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatList, MatListItem, MatListModule, MatNavList } from '@angular/material/list';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, RouterModule, MatToolbarModule, MatDrawer,
            MatDrawerContent, MatNavList, MatListItem, RouterOutlet, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
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

}
