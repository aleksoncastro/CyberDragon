import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { matchPasswordsValidator } from '../../../validators/match-passwords.validators';
import { UsuarioServiceFuncionario } from '../../../services/usuario-funcionario.service';

@Component({
  selector: 'app-usuario-form-funcionario',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './usuario-form-funcionario.component.html',
  styleUrl: './usuario-form-funcionario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioFormFuncionarioComponent {
  formGroup: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceFuncionario,
    private router: Router) {

    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validator: matchPasswordsValidator });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getConfirmPasswordErrorMessage() {
    return this.formGroup.hasError('senhaNaoConfere') ? 'As senhas não coincidem' : '';
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoUsuario = this.formGroup.value;
      this.usuarioService.insertUsuarioFuncionario(novoUsuario).subscribe({
        next: (usuarioCadastrado) => {
          console.log(JSON.stringify(usuarioCadastrado));
          this.router.navigate(['/login']);
        },
        error: (e) => {
          console.log('Erro ao gravar' + JSON.stringify(e));
        }
      })
    }
  }
}
