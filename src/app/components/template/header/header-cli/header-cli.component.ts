import { SidebarService } from '../../../../services/sidebar.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Component } from '@angular/core';

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
    FormsModule
  ],
  templateUrl: './header-cli.component.html',
  styleUrl: './header-cli.component.css'
})
export class HeaderCliComponent {
  searchQuery: string = '';

  constructor(
    private sidebarService: SidebarService,
    private router: Router
  ) {}

  clickMenu() {
    this.sidebarService.toggle();
  }

  onSearch() {
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['placas-vitrine'], {
        queryParams: { q: query }
      });
    }
  }
}