import { Component } from "@angular/core"
import { MatIconModule } from "@angular/material/icon"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatButtonModule } from "@angular/material/button"
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatTooltipModule } from "@angular/material/tooltip"
import { FormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  email = ""

  submitNewsletter() {
    // Implementar lógica para salvar o email na newsletter
    console.log("Email cadastrado:", this.email)
    this.email = ""
    // Aqui você pode adicionar um toast ou snackbar para confirmar a inscrição
  }
}
