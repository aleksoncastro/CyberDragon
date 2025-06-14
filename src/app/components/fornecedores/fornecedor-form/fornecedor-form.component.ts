import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Fornecedor } from '../../../models/fornecedor.model';
import { SnackbarService } from '../../../services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fornecedor-form',
  imports: [NgIf, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})

export class FornecedorFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService) {

    const fornecedor: Fornecedor = this.activatedRoute.snapshot.data['fornecedor'];

    this.formGroup = this.formBuilder.group({
      id: [(fornecedor && fornecedor.id) ? fornecedor.id : null],
      nome: ['', [Validators.required, Validators.maxLength(100)]], // max opcional
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefones: this.formBuilder.array([]),
    });
    

    if (fornecedor) {
      this.formGroup.patchValue({
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        email: fornecedor.email
      });

      if (fornecedor && fornecedor.telefones) {
        fornecedor.telefones.forEach(telefone => this.addTelefone(telefone.codigoArea, telefone.numero));
      } else {

        this.addTelefone();
      }
    }
  }

  get telefones() {
    return this.formGroup.get('telefones') as FormArray;
  }

  addTelefone(codigoArea: string = '', numero: string = '') {
    const telefoneGroup = this.formBuilder.group({
      codigoArea: [codigoArea, Validators.required],
      numero: [numero, Validators.required]
    });
  
    this.telefones.push(telefoneGroup);
  }
  

  removeTelefone(index: number) {
    this.telefones.removeAt(index);
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
      required: 'O nome é obrigatório.',
      apiError: ''
    },
    cnpj: {
      required: 'O CNPJ é obrigatório.',
      pattern: 'O CNPJ deve conter exatamente 14 dígitos.',
      apiError: ''
    },
    email: {
      required: 'O email é obrigatório.',
      email: 'Formato de e-mail inválido.',
      apiError: ''
    },
    codigoArea: {
      required: 'O código de área é obrigatório.'
    },
    numero: {
      required: 'O número de telefone é obrigatório.'
    }
  };

  salvar() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id == null) {
        this.fornecedorService.insert(fornecedor).subscribe({
          next: () => {
            this.snackbarService.showMessage('Fornecedor Salvo!', true);
            this.router.navigateByUrl('/admin/fornecedores');
          },
          error: (errorResponse) => {
            this.snackbarService.showMessage('Erro ao excluir o fornecedor!', false);
            console.log('Erro ao incluir' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.fornecedorService.update(fornecedor).subscribe({
          next: (fornecedorAlterado) => {
            this.snackbarService.showMessage('Fornecedor Atualizado!', true);
            this.router.navigateByUrl('/admin/fornecedores');
          }
        });
      }
    }
  }

  tratarErros(httpError: HttpErrorResponse): void {
    if (httpError.status === 400 && httpError.error?.errors) {
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

  cancelar() {
    this.router.navigateByUrl('/admin/fornecedores');
  }

  excluir() {
    if (this.formGroup.valid) {
      const fornecedor = this.formGroup.value;
      if (fornecedor.id != null) {
        this.fornecedorService.delete(fornecedor).subscribe({
          next: () => {
            this.router.navigateByUrl('/admin/fornecedores');
          },
          error: (err) => {
            console.log('Erro ao excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  
}