import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { HttpErrorResponse } from '@angular/common/http';
import { NgIf, NgForOf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SnackbarService } from '../../../services/snackbar.service';

function extrairEstado(estadoCompleto: string): string {
  // Exemplo: "TO - TOCANTINS" vira "TOCANTINS"
  const partes = estadoCompleto.split('-').map(p => p.trim());
  return partes.length > 1 ? partes[1] : estadoCompleto;
}

function extrairCodigoArea(codigoArea: string): string {
  // Se seu tipo é código da área, só retorna ele. Se for algo mais complexo, adapte aqui.
  return codigoArea;
}

@Component({
  selector: 'app-cliente-form',
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
  standalone: true,
})
export class ClienteFormComponent {
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) {
    const cliente: Cliente = this.activateRoute.snapshot.data['cliente'];

    this.formGroup = this.formBuilder.group({
      id: [(cliente && cliente.id) ? cliente.id : null],
      nome: [(cliente && cliente.nome) ? cliente.nome : '', Validators.compose([Validators.required, Validators.maxLength(100)])],
      dataNascimento: [(cliente && cliente.dataNascimento) ? cliente.dataNascimento : '', Validators.required],
      enderecos: this.formBuilder.array([]),
      telefones: this.formBuilder.array([]),
    });

    if (cliente) {
      if (cliente.enderecos && cliente.enderecos.length) {
        cliente.enderecos.forEach(end => this.adicionarEndereco(end));
      } else {
        this.adicionarEndereco();
      }

      if (cliente.telefones && cliente.telefones.length) {
        cliente.telefones.forEach(tel => this.adicionarTelefone(tel));
      } else {
        this.adicionarTelefone();
      }
    } else {
      this.adicionarEndereco();
      this.adicionarTelefone();
    }
  }

  get enderecos() {
    return this.formGroup.get('enderecos') as FormArray;
  }

  get telefones() {
    return this.formGroup.get('telefones') as FormArray;
  }

  adicionarEndereco(endereco?: any) {
    const fg = this.formBuilder.group({
      id: [endereco?.id || null],  // <-- incluir o id aqui
      rua: [endereco?.rua || '', Validators.required],
      numero: [endereco?.numero || '', Validators.required],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || '', Validators.required],
      cidade: [endereco?.cidade || '', Validators.required],
      estado: [endereco?.estado || '', Validators.required],
      cep: [endereco?.cep || '', Validators.required],
    });
    this.enderecos.push(fg);
  }

  adicionarTelefone(telefone?: any) {
    const fg = this.formBuilder.group({
      id: [telefone?.id || null], // <-- incluir o id aqui
      numero: [telefone?.numero || '', Validators.required],
      codigoArea: [telefone?.codigoArea || '', Validators.required],
    });
    this.telefones.push(fg);
  }

  removerEndereco(index: number) {
    this.enderecos.removeAt(index);
  }

  removerTelefone(index: number) {
    this.telefones.removeAt(index);
  }

  salvar() {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cliente = {
        nome: this.formGroup.value.nome,
        dataNascimento: this.formGroup.value.dataNascimento,
        enderecos: this.formGroup.value.enderecos.map((end: any) => ({
          cep: end.cep,
          cidade: end.cidade,
          estado: extrairEstado(end.estado), // função para extrair só o nome do estado
          bairro: end.bairro,
          rua: end.rua, // renomear logradouro para rua
          numero: end.numero
        })),
        telefones: this.formGroup.value.telefones.map((tel: any) => ({
          codigoArea: extrairCodigoArea(tel.codigoArea), // função para extrair código da área
          numero: tel.numero
        }))
      };

      const operacao = this.formGroup.value.id == null
        ? this.clienteService.insert(cliente)
        : this.clienteService.update(
          this.formGroup.value.id,
          this.formGroup.value.enderecos?.[0]?.id,
          this.formGroup.value.telefones?.[0]?.id,
          cliente
        );

      operacao.subscribe({
        next: () => {
          this.snackbarService.showMessage('Cliente salvo com sucesso!', true);
          this.router.navigateByUrl('/cliente/perfil');
        },
        error: (erroResponse) => {
          this.snackbarService.showMessage('Erro ao salvar o cliente!', false);
          this.tratarErros(erroResponse);
          console.error('Erro ao salvar', erroResponse);
        },
      });
    }
  }

  excluir() {
    const cliente = this.formGroup.value;
    if (cliente.id != null) {
      this.clienteService.delete(cliente.id).subscribe({
        next: () => {
          this.snackbarService.showMessage('Cliente excluído com sucesso!', true);
          this.router.navigateByUrl('/admin/clientes');
        },
        error: (erroResponse) => {
          this.snackbarService.showMessage('Erro ao excluir o cliente!', false);
          console.error('Erro ao excluir', erroResponse);
        },
      });
    }
  }

  cancelar() {
    this.router.navigateByUrl('/admin/clientes');
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

  getEnderecoErrorMessage(index: number, controlName: string): string {
    const control = (this.enderecos.at(index) as FormGroup).get(controlName);
    if (control?.hasError('required')) {
      return `O campo ${controlName} é obrigatório.`;
    }
    if (control?.hasError('apiError')) {
      return control.getError('apiError');
    }
    return '';
  }

  getTelefoneErrorMessage(index: number, controlName: string): string {
    const control = (this.telefones.at(index) as FormGroup).get(controlName);
    if (control?.hasError('required')) {
      return `O campo ${controlName} é obrigatório.`;
    }
    if (control?.hasError('apiError')) {
      return control.getError('apiError');
    }
    return '';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nome: {
      required: 'O nome deve ser informado.',
      maxlength: 'O nome deve ter no máximo 100 caracteres.',
      apiError: '',
    },
    dataNascimento: {
      required: 'A data de nascimento deve ser informada.',
      apiError: '',
    }
  };
}
