import { Component } from '@angular/core';
import { HeaderCliComponent } from '../header/header-cli/header-cli.component';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from "../sidebar/sidebar-cli/sidebar-cli.component";

@Component({
  selector: 'app-user-template',
  imports: [HeaderCliComponent, FooterComponent, SidebarComponent],
  templateUrl: './user-template.component.html',
  styleUrl: './user-template.component.css'
})
export class UserTemplateComponent {

}
