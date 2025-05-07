import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../header/header-admin/header-admin.component';
import { SidebarComponent } from '../sidebar/sidebar-adm/sidebarAdmin.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin-template',
  imports: [HeaderAdminComponent, SidebarComponent, FooterComponent],
  templateUrl: './admin-template.component.html',
  styleUrl: './admin-template.component.css'
})
export class AdminTemplateComponent {

}
