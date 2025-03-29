import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Estado } from '../../../models/estado.model';
import { max } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-estado-form',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.css',
})
export class EstadoFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private estadoService: EstadoService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {

    const estado: Estado = this.activateRoute.snapshot.data['estado'];

    this.formGroup = this.formBuilder.group({
      id: [(estado && estado.id) ? estado.id : null],
      nome: [(estado && estado.nome) ? estado.nome : '', 
        Validators.compose([Validators.required, 
          Validators.maxLength(60)])],
      sigla: [(estado && estado.sigla) ? estado.sigla : '', 
        Validators.compose([Validators.required, 
          Validators.maxLength(2)])],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched(); // Marca todos os campos como tocados para mostrar as mensagens de erro
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;

      const operacao = estado.id == null
        ? this.estadoService.insert(estado)
        : this.estadoService.update(estado);

      operacao.subscribe({
        next: () => {
          this.router.navigateByUrl('/estados');
        },
        error: (erroResponse) => {
          console.log('Erro ao salvar', JSON.stringify(erroResponse));
        },
      });
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((ValidationError: any) => {  
          const formControl = this.formGroup.get(ValidationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: ValidationError.message });
          }
      });
    }
    else {
      alert(httpError.error?.message || 'Erro não mapeado no servidor.');
    }
  }
}

  excluir() {
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;
      if (estado.id != null) {
        this.estadoService.delete(estado).subscribe({
          next: () => {
            this.router.navigateByUrl('/estados');
          },
          error: (erroResponse) => {
            console.log('Erro ao excluir', JSON.stringify(erroResponse));
          },
        });
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  // é proximo ao Map do java
  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      minlength: 'O nome deve ter no mínimo 2 caracteres.',
      maxlength: 'O nome deve ter no máximo 60 caracteres.',
      apiError: '',
    },
    sigla: {
      required: 'A sigla deve ser informada.',
      minlength: 'A sigla deve ter no mínimo 2 caracteres.',
      maxlength: 'A sigla deve ter no máximo 2 caracteres.',
      apiError: '',
    },

  }
}