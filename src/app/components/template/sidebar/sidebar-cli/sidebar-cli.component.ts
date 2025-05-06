import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatNavList, MatListItem, MatListModule } from '@angular/material/list';
import { MatSidenavModule, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarService } from '../../../../services/sidebar.service';

@Component({
  selector: 'app-sidebar-cli',
  imports: [MatSidenavModule, RouterModule, MatToolbarModule, MatDrawer,
    MatDrawerContent, MatNavList, MatListItem, RouterOutlet, MatListModule, MatIconModule],
  templateUrl: './sidebar-cli.component.html',
  styleUrl: './sidebar-cli.component.css'
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
