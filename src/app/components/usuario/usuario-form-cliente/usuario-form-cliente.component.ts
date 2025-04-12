import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { matchPasswordsValidator } from '../../../validators/match-passwords.validators';

@Component({
  selector: 'app-usuario-form-cliente',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatToolbarModule, MatIconModule],
  templateUrl: './usuario-form-cliente.component.html',
  styleUrl: './usuario-form-cliente.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioFormClienteComponent {
  formGroup: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      cpf: ['', [
        Validators.required,
        Validators.pattern(/^\d{11}$/)  // exatamente 11 dígitos
      ]],
      senha: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20)
      ]],
      confirmarSenha: ['', Validators.required]
    }, {
      validator: matchPasswordsValidator
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) return 'Campo inválido.';
    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'Campo inválido.';
  }

  getConfirmPasswordErrorMessage(): string {
    return this.formGroup.hasError('senhaNaoConfere') ? 'As senhas não coincidem' : '';
  }

  onSubmit(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const novoUsuario = this.formGroup.value;
      this.usuarioService.insertUsuarioCliente(novoUsuario).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => {
          console.log('Erro ao gravar: ' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400 && httpError.error?.errors) {
      httpError.error.errors.forEach((validationError: any) => {
        const formControl = this.formGroup.get(validationError.fieldName);
        if (formControl) {
          formControl.setErrors({ apiError: validationError.message });
        }
      });
    } else {
      alert(httpError.error?.message || 'Erro não mapeado do servidor.');
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    username: {
      required: 'O username é obrigatório.',
      apiError: ''
    },
    email: {
      required: 'O email é obrigatório.',
      email: 'O email deve ser válido.',
      apiError: ''
    },
    cpf: {
      required: 'O CPF é obrigatório.',
      apiError: ''
    },
    senha: {
      required: 'A senha é obrigatória.',
      minlength: 'A senha deve ter no mínimo 6 caracteres.',
      apiError: ''
    },
    confirmarSenha: {
      required: 'A confirmação da senha é obrigatória.',
      apiError: ''
    }
  };
}
