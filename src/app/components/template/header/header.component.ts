import { Component } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private sidebarService: SidebarService) {

   }

   clickMenu() {
    this.sidebarService.toggle();
   }

}
