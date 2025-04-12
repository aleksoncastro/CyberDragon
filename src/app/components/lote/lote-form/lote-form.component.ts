import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoteService } from '../../../services/lote.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { Lote } from '../../../models/lote.model';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';

// Angular Material
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatOptionModule } from '@angular/material/core';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';

// No topo do componente, fora da classe:
function dataNaoFuturaValidator() {
  return (control: any) => {
    const hoje = new Date();
    const valor = control.value;

    if (valor && new Date(valor) > hoje) {
      return { dataFutura: true };
    }
    return null;
  };
}

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-lote-form',
  standalone: true,
  imports: [
    NgIf, CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatToolbarModule, MatIconModule, MatCardModule,
    MatDatepickerModule, MatOptionModule, MatNativeDateModule, MatSelectModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.css']
})
export class LoteFormComponent implements OnInit {
  formGroup!: FormGroup;
  placadevideo: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private router: Router,
    private placaDeVideoService: PlacaDeVideoService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private dateAdapter: DateAdapter<any>
  ) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('pt-BR');
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];

    this.placaDeVideoService.findAll().subscribe({
      next: (placas) => {
        this.placadevideo = placas;

        // Corrigido: pega o ID se for um objeto ou número direto
        const idPlaca = typeof lote?.placaDeVideo === 'number'
          ? lote.placaDeVideo
          : lote?.placaDeVideo?.id ?? '';

        this.formGroup = this.formBuilder.group({
          id: [lote?.id ?? null],
          codigo: [lote?.codigo ?? '', Validators.required],
          estoque: [lote?.estoque ?? '', [Validators.required, Validators.min(1)]],
          dataFabricacao: [lote?.dataFabricacao ?? '', [Validators.required, dataNaoFuturaValidator()]],
          placaDeVideo: [idPlaca, Validators.required]
        });

        console.log("Formulário inicializado:", this.formGroup.value);
      },
      error: (err) => {
        console.error('Erro ao buscar placas de vídeo', err);
      }
    });
  }

  cancelar() {
    this.router.navigateByUrl('/admin/lotes');
  }

  salvar() {
    console.log("Método salvar() chamado!");

    if (!this.formGroup.valid) {
      console.warn("Formulário inválido! Verifique os campos.");
      return;
    }

    const formValue = this.formGroup.value;

    const lote: Lote = {
      id: formValue.id,
      codigo: formValue.codigo,
      estoque: formValue.estoque,
      dataFabricacao: formValue.dataFabricacao,
      idPlacaDeVideo: formValue.placaDeVideo ?? 0
    };

    console.log("Lote a ser enviado:", JSON.stringify(lote, null, 2));

    const request$ = lote.id == null
      ? this.loteService.insert(lote)
      : this.loteService.update(lote);

    request$.subscribe({
      next: () => {
        const msg = lote.id == null ? 'Lote Salvo!' : 'Lote Atualizado!';
        console.log(msg);
        this.snackbarService.showMessage(msg, true);
        this.router.navigateByUrl("/admin/lotes");
      },
      error: (errorResponse) => {
        const msg = lote.id == null ? 'Erro ao salvar o lote!' : 'Erro ao atualizar o lote!';
        console.error(msg, errorResponse);
        this.snackbarService.showMessage(msg, false);
      }
    });
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

  getErrorMessage(controlName: string, errors: any): string {
    if (!errors || !this.errorMessages[controlName]) return 'Campo inválido.';
  
    for (const error in errors) {
      if (this.errorMessages[controlName][error]) {
        return this.errorMessages[controlName][error];
      }
    }
    return 'Campo inválido.';
  }
  
  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    codigo: {
      required: 'O código do lote é obrigatório.',
      apiError: ''
    },
    estoque: {
      required: 'O estoque é obrigatório.',
      min: 'O estoque deve ser maior que zero.',
      apiError: ''
    },
    dataFabricacao: {
      required: 'A data de fabricação é obrigatória.',
      matDatepickerParse: 'Data inválida.',
      dataFutura: 'A data não pode ser no futuro.',
      apiError: ''
    },
    placaDeVideo: {
      required: 'A placa de vídeo é obrigatória.',
      apiError: ''
    }
  };

  excluir() {
    const lote = this.formGroup.value;
    if (lote.id != null) {
      this.loteService.delete(lote.id).subscribe({
        next: () => {
          this.router.navigateByUrl('/admin/lotes');
        },
        error: (err) => {
          console.log('Erro ao excluir:', JSON.stringify(err));
        }
      });
    }
  }
}
