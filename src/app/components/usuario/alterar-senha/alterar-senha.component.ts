import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SenhaPatchRequestDTO } from '../../../models/senha-patch-request-dto.model';
import { Usuario } from '../../../models/usuario.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-alterar-senha',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, MatFormFieldModule, MatInputModule, MatIconModule, RouterLink],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent implements OnInit {
  form!: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      repetirNovaSenha: ['', Validators.required]
    }, {
      validators: this.senhasConferemValidator
    });
  }

  logout() {
    this.authService.removeToken();
    this.authService.removeUsuarioLogado();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  } 

  // Validador customizado para o FormGroup
  senhasConferemValidator(form: FormGroup) {
    const senha = form.get('novaSenha')?.value;
    const repetir = form.get('repetirNovaSenha')?.value;
    return senha === repetir ? null : { senhasDiferentes: true };
  }

  alterarSenha(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const dto: SenhaPatchRequestDTO = {
      senhaAtual: this.form.value.senhaAtual,
      novaSenha: this.form.value.novaSenha,
      repetirNovaSenha: this.form.value.repetirNovaSenha
    };

    const username = 'usuario_logado'; // Substitua pelo valor correto via AuthService

    this.usuarioService.updateSenha(dto).subscribe({
      next: () => {
        this.logout()
        this.router.navigate(['/login']);
      },
      error: err => alert('Erro ao atualizar senha: ' + (err.error?.message || err.message))
    });
  }
}
