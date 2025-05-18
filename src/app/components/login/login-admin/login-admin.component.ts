import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { FooterComponent } from '../../template/footer/footer.component';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [
    NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    RouterModule,
    FooterComponent
  ],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginAdminComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const username = this.loginForm.get('username')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authService.loginADM(username, password).subscribe({
        next: (resp) => {
          this.isLoading = false;
          this.router.navigateByUrl('/admin/home');
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.showSnackbarTopPosition("Dados Inválidos", 'Fechar', 2000);
        }
      });
      
    } else {
      this.loginForm.markAllAsTouched();
      this.showSnackbarTopPosition("Preencha todos os campos corretamente", 'Fechar', 2000);
    }
  }

  showSnackbarTopPosition(content: any, action: any, duration: any) {
    this.snackBar.open(content, action, {
      duration: duration,
      verticalPosition: "top", 
      horizontalPosition: "center",
      panelClass: ['error-snackbar']
    });
  }
}