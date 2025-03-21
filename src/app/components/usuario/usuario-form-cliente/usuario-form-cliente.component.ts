import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
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
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
<<<<<<< HEAD
=======

>>>>>>> 5c51689 (Crud do Usuario)

  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) {

<<<<<<< HEAD
      this.formGroup = this.formBuilder.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        cpf: ['', Validators.required],
        senha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required]
      }, { validator: matchPasswordsValidator });
=======
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validator: matchPasswordsValidator });

>>>>>>> 5c51689 (Crud do Usuario)
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

<<<<<<< HEAD
  toggleConfirmPasswordVisibility(){
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
  
  getConfirmPasswordErrorMessage(){
    return this.formGroup.hasError('senhaNaoConfere') ? 'As senhas não coincidem': '';
=======
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
>>>>>>> 5c51689 (Crud do Usuario)
  }

  getConfirmPasswordErrorMessage() {
    return this.formGroup.hasError('senhaNaoConfere') ? 'As senhas não coincidem' : '';
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoUsuario = this.formGroup.value;
      this.usuarioService.insertUsuarioCliente(novoUsuario).subscribe({
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