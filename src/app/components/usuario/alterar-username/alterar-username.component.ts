import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { UsernamePatchRequestDTO } from '../../../models/username-patch-request-dto.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-alterar-username',
  imports: [ReactiveFormsModule, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink],
  templateUrl: './alterar-username.component.html',
  styleUrl: './alterar-username.component.css'
})
export class AlterarUsernameComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      novoUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    });
  }

  logout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
  }

  alterarUsername(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const dto: UsernamePatchRequestDTO = {
      novoUsername: this.form.value.novoUsername
    };

    this.usuarioService.updateUsername(dto).subscribe({
      next: () => {
        this.logout();
        this.router.navigate(['/login']);
      },
      error: err => {
        alert('Erro ao atualizar username: ' + (err.error?.message || err.message));
      }
    });
  }
}
