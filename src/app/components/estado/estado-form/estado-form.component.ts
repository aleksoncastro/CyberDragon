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
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../../services/snackbar.service';

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
    private activateRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    const estado: Estado = this.activateRoute.snapshot.data['estado'];

    this.formGroup = this.formBuilder.group({
      id: [(estado && estado.id) ? estado.id : null],
      nome: [(estado && estado.nome) ? estado.nome : '', 
        Validators.compose([Validators.required, Validators.maxLength(60)])],
      sigla: [(estado && estado.sigla) ? estado.sigla : '', 
        Validators.compose([Validators.required, Validators.maxLength(2)])],
    });
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const estado = this.formGroup.value;

      const operacao = estado.id == null
        ? this.estadoService.insert(estado)
        : this.estadoService.update(estado);

      operacao.subscribe({
        next: () => {
          this.snackbarService.showMessage('Estado Salvo!', true);
          this.router.navigateByUrl('/admin/estados');
        },
        error: (erroResponse) => {
          this.snackbarService.showMessage('Erro ao salvar o estado!', false);
          console.log('Erro ao salvar', JSON.stringify(erroResponse));
        },
      });
    }
  }

  excluir() {
    const estado = this.formGroup.value;
    if (estado.id != null) {
      this.estadoService.delete(estado).subscribe({
        next: () => {
          this.snackbarService.showMessage('Estado Excluído!', true);
          this.router.navigateByUrl('/admin/estados');
        },
        error: (erroResponse) => {
          this.snackbarService.showMessage('Erro ao excluir o estado!', false);
          console.log('Erro ao excluir', JSON.stringify(erroResponse));
        },
      });
    }
  }

  cancelar() {
    this.router.navigateByUrl('/admin/estados');
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
      } else {
        this.snackbarService.showMessage(httpError.error?.message || 'Erro não mapeado no servidor.');
      }
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'Campo inválido';
    }

    for (const errorName in errors) {
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'Campo inválido';
  }

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
