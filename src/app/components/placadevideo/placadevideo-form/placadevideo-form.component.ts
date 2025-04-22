import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf, NgFor } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { SnackbarService } from '../../snackbar/snackbar.component';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-placadevideo-form',
  standalone: true,
  imports: [MatStepperModule, NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './placadevideo-form.component.html',
  styleUrl: './placadevideo-form.component.css'
})
export class PlacaDeVideoFormComponent {
  fornecedor: any[] = [];
  formGroup!: FormGroup;
  idFornecedorSelecionado: number | null = null;

  constructor(private formBuilder: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService) {

    this.fornecedorService.findAll().subscribe({
      next: (fornecedores) => {
        this.fornecedor = fornecedores;
        console.log("Fornecedores carregados:", this.fornecedor);

        const placaDeVideo: PlacaDeVideo = this.activatedRoute.snapshot.data['placadevideo'];

        this.formGroup = this.formBuilder.group({
          formArray: this.formBuilder.array([
            this.formBuilder.group({
              id: [(placaDeVideo && placaDeVideo.id) ? placaDeVideo.id : null],
              modelo: [placaDeVideo?.modelo || '', Validators.required],
              idFornecedor: [placaDeVideo?.idFornecedor ?? '', Validators.required],
              categoria: [placaDeVideo?.categoria || '', Validators.required],
              preco: [placaDeVideo?.preco || '', [Validators.required, Validators.min(0)]],
              resolucao: [placaDeVideo?.resolucao || '', Validators.required],
              idFan: [placaDeVideo?.idFan ?? '', [Validators.required, Validators.min(1)]],
              compatibilidade: [placaDeVideo?.compatibilidade || '', [Validators.required, Validators.min(1)]],
              descricao: [placaDeVideo?.descricao || '', Validators.required],
            }),
            this.formBuilder.group({
              energia: [placaDeVideo?.energia || '', [Validators.required, Validators.min(0)]],
              clockBase: [placaDeVideo?.clockBase || '', [Validators.required, Validators.min(0)]],
              clockBoost: [placaDeVideo?.clockBoost || '', [Validators.required, Validators.min(0)]],
              suporteRayTracing: [placaDeVideo?.suporteRayTracing || false],
            }),
            this.formBuilder.group({
              memoria: this.formBuilder.group({
                tipoMemoria: [placaDeVideo?.memoria?.tipoMemoria || '', Validators.required],
                capacidade: [placaDeVideo?.memoria?.capacidade || '', [Validators.required, Validators.min(1)]],
                larguraBanda: [placaDeVideo?.memoria?.larguraBanda || '', [Validators.required, Validators.min(1)]],
                velocidadeMemoria: [placaDeVideo?.memoria?.velocidadeMemoria || '', [Validators.required, Validators.min(1)]],
              }),
            }),
            this.formBuilder.group({
              tamanho: this.formBuilder.group({
                largura: [placaDeVideo?.tamanho?.largura || '', [Validators.required, Validators.min(1)]],
                altura: [placaDeVideo?.tamanho?.altura || '', [Validators.required, Validators.min(1)]],
                comprimento: [placaDeVideo?.tamanho?.comprimento || '', [Validators.required, Validators.min(1)]],
              }),
              saidas: this.formBuilder.array(
                placaDeVideo?.saidas?.length
                  ? placaDeVideo.saidas.map(saida => this.createSaidaFormGroup(saida))
                  : [this.createSaidaFormGroup()]
              )
            })
          ])
        });
        console.log("PlacaDeVideo inicializada:", this.formGroup.value);
        this.idFornecedorSelecionado = placaDeVideo?.idFornecedor ?? null;
      },
      error: (err) => {
        console.error('Erro ao buscar fornecedores', err);
      }
    });
  }

  atualizarIdFornecedor(id: number) {
    this.idFornecedorSelecionado = id;
    this.formGroup.patchValue({ idFornecedor: id });
    console.log("Fornecedor selecionado: ", this.idFornecedorSelecionado);
    console.log("Valor atualizado no formGroup: ", this.formGroup.value);
  }

  createSaidaFormGroup(saida?: any): FormGroup {
    return this.formBuilder.group({
      tipo: [saida?.tipo || '', Validators.required],
      quantidade: [saida?.quantidade || '', [Validators.required, Validators.min(1)]],
    });
  }
  getSaidas(): FormArray {
    return (this.formGroup.get('formArray') as FormArray).at(3).get('saidas') as FormArray;
  }  

  // Método para adicionar uma nova saída de vídeo ao array
  adicionarSaida(): void {
    this.getSaidas().push(
      this.formBuilder.group({
        tipo: ['', Validators.required],
        quantidade: [0, Validators.required],
      }
      ));
  }

  get formArray(): FormArray {
    return this.formGroup.get('formArray') as FormArray;
  }  

  get saidasFormArray(): FormArray {
    return this.formGroup.get('saidas') as FormArray;
  }

  removerSaida(index: number) {
    this.getSaidas().removeAt(index);
  }  

  salvar() {
    console.log("Método salvar() da Placa de Vídeo chamado!");

    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      console.warn("Formulário inválido! Verifique os campos.");
      return;
    }    

    const formValue = this.formGroup.value;
    console.log("Valores do formulário:", formValue);
    
    const formArray = this.formGroup.get('formArray') as FormArray;

    const step1 = formArray.at(0).value;
    const step2 = formArray.at(1).value;
    const step3 = formArray.at(2).value;
    const step4 = formArray.at(3).value;
    
    const placaDeVideo: PlacaDeVideo = {
      id: step1.id,
      modelo: step1.modelo,
      categoria: step1.categoria,
      preco: step1.preco,
      resolucao: step1.resolucao,
      energia: step2.energia,
      descricao: step1.descricao,
      compatibilidade: step1.compatibilidade,
      clockBase: step2.clockBase,
      clockBoost: step2.clockBoost,
      suporteRayTracing: step2.suporteRayTracing,
      idFan: step1.idFan,
      idFornecedor: step1.idFornecedor,
      memoria: {
        tipoMemoria: step3.memoria.tipoMemoria,
        capacidade: step3.memoria.capacidade,
        larguraBanda: step3.memoria.larguraBanda,
        velocidadeMemoria: step3.memoria.velocidadeMemoria,
      },
      tamanho: {
        largura: step4.tamanho.largura,
        altura: step4.tamanho.altura,
        comprimento: step4.tamanho.comprimento,
      },
      saidas: step4.saidas,
      listaImagem: []
    };

    console.log("Objeto PlacaDeVideo a ser enviado:", JSON.stringify(placaDeVideo, null, 2));

    if (placaDeVideo.id == null) {
      console.log("Chamando API para INSERIR nova placa de vídeo...");
      this.placaDeVideoService.insert(placaDeVideo).subscribe({
        next: () => {
          console.log("Placa de vídeo salva com sucesso!");
          this.router.navigateByUrl("/admin/placasdevideo");
        },
        error: (errorResponse) => {
          console.error("Erro ao salvar a placa de vídeo:", errorResponse);
        }
      });
    } else {
      console.log("Chamando API para ATUALIZAR placa de vídeo...");
      this.placaDeVideoService.update(placaDeVideo).subscribe({
        next: () => {
          console.log("Placa de vídeo atualizada com sucesso!");
          this.router.navigateByUrl("/admin/placasdevideo");
        },
        error: (errorResponse) => {
          console.error("Erro ao atualizar a placa de vídeo:", errorResponse);
        }
      });
    }
  }


  cancelar() {
    this.router.navigateByUrl('/admin/placasdevideo');
  }

  tratarErros(httpError: HttpErrorResponse): void {

    if (httpError.status === 400) {
      if (httpError.error?.errors) {
        httpError.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          if (formControl) {
            formControl.setErrors({ apiError: validationError.message })
          }
        });
      }
    } else {
      alert(httpError.error?.message || "Erro não mapeado do servidor.");
    }

  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors || !this.errorMessages[controlName]) {
      return 'invalid field';
    }

    for (const errorName in errors) {
      console.log(errorName);
      if (this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }
    return 'invalid field';
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    modelo: {
      required: 'O modelo deve ser informado.',
      apiError: ' '
    },
    categoria: {
      required: 'A categoria deve ser informada.',
      apiError: ' '
    },
    preco: {
      required: 'O preço deve ser informado.',
      min: 'O preço não pode ser negativo.',
      apiError: ' '
    },
    resolucao: {
      required: 'A resolução deve ser informada.',
      apiError: ' '
    },
    energia: {
      required: 'O consumo de energia deve ser informado.',
      min: 'A energia não pode ser negativa.',
      apiError: ' '
    },
    descricao: {
      required: 'A descrição deve ser informada.',
      apiError: ' '
    },
    compatibilidade: {
      required: 'A compatibilidade deve ser informada.',
      min: 'Informe pelo menos um item de compatibilidade.',
      apiError: ' '
    },
    clockBase: {
      required: 'O clock base deve ser informado.',
      min: 'O clock base deve ser maior ou igual a 0.',
      apiError: ' '
    },
    clockBoost: {
      required: 'O clock boost deve ser informado.',
      min: 'O clock boost deve ser maior ou igual a 0.',
      apiError: ' '
    },
    idFan: {
      required: 'O fan deve ser informado.',
      min: 'Selecione um fan válido.',
      apiError: ' '
    },
    idFornecedor: {
      required: 'O fornecedor deve ser informado.',
      apiError: ' '
    },
    // memória
    'memoria.tipoMemoria': {
      required: 'O tipo de memória deve ser informado.',
      apiError: ' '
    },
    'memoria.capacidade': {
      required: 'A capacidade da memória deve ser informada.',
      min: 'A capacidade da memória deve ser maior que 0.',
      apiError: ' '
    },
    'memoria.larguraBanda': {
      required: 'A largura de banda deve ser informada.',
      min: 'A largura de banda deve ser maior que 0.',
      apiError: ' '
    },
    'memoria.velocidadeMemoria': {
      required: 'A velocidade da memória deve ser informada.',
      min: 'A velocidade da memória deve ser maior que 0.',
      apiError: ' '
    },
    // tamanho
    'tamanho.largura': {
      required: 'A largura deve ser informada.',
      min: 'A largura deve ser maior que 0.',
      apiError: ' '
    },
    'tamanho.altura': {
      required: 'A altura deve ser informada.',
      min: 'A altura deve ser maior que 0.',
      apiError: ' '
    },
    'tamanho.comprimento': {
      required: 'O comprimento deve ser informado.',
      min: 'O comprimento deve ser maior que 0.',
      apiError: ' '
    }
    // Campos da lista `saidas` podem ser tratados separadamente se necessário
  };


  excluir() {
    const placaDeVideo = this.formGroup.value;
    if (placaDeVideo.id != null) {
      this.placaDeVideoService.delete(placaDeVideo).subscribe({
        next: () => {
          this.snackbarService.showMessage('Placa de Vídeo Excluída!', true);
          this.router.navigateByUrl('/admin/placasdevideo')
        },
        error: (err) => {
          this.snackbarService.showMessage('Erro ao excluir a placa de vídeo!', false);
          console.log('Erro ao excluir' + JSON.stringify(err))
        }
      });
    }
  }
}
