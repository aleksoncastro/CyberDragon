import { Location, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacaDeVideo } from '../../../models/placadevideo.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { SnackbarService } from '../../snackbar/snackbar.component';

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
  listaImagens: File[] = [];

  fileName: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private formBuilder: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private location: Location,
    private cdRef: ChangeDetectorRef) {

    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          id: [null],
          modelo: ['', Validators.required],
          idFornecedor: [null, Validators.required],
          categoria: ['', Validators.required],
          preco: ['', [Validators.required, Validators.min(0)]],
          resolucao: ['', Validators.required],
          idFan: [null, [Validators.required, Validators.min(1)]],
          barramento: [null, [Validators.required, Validators.min(1)]],
          descricao: ['', Validators.required],
        }),
        this.formBuilder.group({
          energia: [null, [Validators.required, Validators.min(0)]],
          clockBase: [null, [Validators.required, Validators.min(0)]],
          clockBoost: [null, [Validators.required, Validators.min(0)]],
          suporteRayTracing: [false],
          memoria: this.formBuilder.group({
            tipoMemoria: ['', Validators.required],
            capacidade: [null, [Validators.required, Validators.min(1)]],
            larguraBanda: [null, [Validators.required, Validators.min(1)]],
            velocidadeMemoria: [null, [Validators.required, Validators.min(1)]],
          }),
        }),
        this.formBuilder.group({
          tamanho: this.formBuilder.group({
            largura: [null, [Validators.required, Validators.min(1)]],
            altura: [null, [Validators.required, Validators.min(1)]],
            comprimento: [null, [Validators.required, Validators.min(1)]],
          }),
          saidas: this.formBuilder.array([this.createSaidaFormGroup()])
        }),
        this.formBuilder.group({
          listaImagem: this.formBuilder.array([])
        })
      ])
    });


  }

  private initializeForm(): void {

    this.fornecedorService.findAll().subscribe({
      next: (fornecedores) => {
        this.fornecedor = fornecedores;
        console.log("Fornecedores carregados:", this.fornecedor);

        const placaDeVideo: PlacaDeVideo = this.activatedRoute.snapshot.data['placadevideo'];

        if (placaDeVideo?.listaImagem?.length) {
          this.imagePreview = this.placaDeVideoService.getImagemUrl(placaDeVideo.listaImagem[0]);
          this.fileName = placaDeVideo.listaImagem[0];
        }

        this.formGroup = this.formBuilder.group({
          formArray: this.formBuilder.array([
            this.formBuilder.group({
              id: [(placaDeVideo && placaDeVideo.id) ? placaDeVideo.id : null],
              modelo: [(placaDeVideo && placaDeVideo.modelo) ? placaDeVideo.modelo : '', Validators.required],
              idFornecedor: [(placaDeVideo && placaDeVideo.idFornecedor) ? placaDeVideo.idFornecedor : '', Validators.required],
              categoria: [(placaDeVideo && placaDeVideo.categoria) ? placaDeVideo.categoria : '', Validators.required],
              preco: [(placaDeVideo && placaDeVideo.preco) ? placaDeVideo.preco : '', [Validators.required, Validators.min(0)]],
              resolucao: [(placaDeVideo && placaDeVideo.resolucao) ? placaDeVideo.resolucao : '', Validators.required],
              idFan: [(placaDeVideo && placaDeVideo.idFan) ? placaDeVideo.idFan : '', [Validators.required, Validators.min(1)]],
              barramento: [(placaDeVideo && placaDeVideo.barramento) ? placaDeVideo.barramento : '', [Validators.required, Validators.min(1)]],
              descricao: [(placaDeVideo && placaDeVideo.descricao) ? placaDeVideo.descricao : '', Validators.required],
            }),
            this.formBuilder.group({
              energia: [(placaDeVideo && placaDeVideo.energia) ? placaDeVideo.energia : '', [Validators.required, Validators.min(0)]],
              clockBase: [(placaDeVideo && placaDeVideo.clockBase) ? placaDeVideo.clockBase : '', [Validators.required, Validators.min(0)]],
              clockBoost: [(placaDeVideo && placaDeVideo.clockBoost) ? placaDeVideo.clockBoost : '', [Validators.required, Validators.min(0)]],
              suporteRayTracing: [(placaDeVideo && placaDeVideo.suporteRayTracing) ? placaDeVideo.suporteRayTracing : false],
              memoria: this.formBuilder.group({
                tipoMemoria: [(placaDeVideo && placaDeVideo.memoria?.tipoMemoria) ? placaDeVideo.memoria.tipoMemoria : '', Validators.required],
                capacidade: [(placaDeVideo && placaDeVideo.memoria?.capacidade) ? placaDeVideo.memoria.capacidade : '', [Validators.required, Validators.min(1)]],
                larguraBanda: [(placaDeVideo && placaDeVideo.memoria?.larguraBanda) ? placaDeVideo.memoria.larguraBanda : '', [Validators.required, Validators.min(1)]],
                velocidadeMemoria: [(placaDeVideo && placaDeVideo.memoria?.velocidadeMemoria) ? placaDeVideo.memoria.velocidadeMemoria : '', [Validators.required, Validators.min(1)]],
              }),
            }),
            this.formBuilder.group({
              tamanho: this.formBuilder.group({
                largura: [(placaDeVideo && placaDeVideo.tamanho?.largura) ? placaDeVideo.tamanho.largura : '', [Validators.required, Validators.min(1)]],
                altura: [(placaDeVideo && placaDeVideo.tamanho?.altura) ? placaDeVideo.tamanho.altura : '', [Validators.required, Validators.min(1)]],
                comprimento: [(placaDeVideo && placaDeVideo.tamanho?.comprimento) ? placaDeVideo.tamanho.comprimento : '', [Validators.required, Validators.min(1)]],
              }),
              saidas: this.formBuilder.array(
                placaDeVideo?.saidas?.length
                  ? placaDeVideo.saidas.map(saida => this.createSaidaFormGroup(saida))
                  : [this.createSaidaFormGroup()]
              )
            }),
            this.formBuilder.group({
              listaImagem: this.formBuilder.array([])
            })
          ])
        });


        this.idFornecedorSelecionado = placaDeVideo?.idFornecedor ?? null;


      }
    });
  }
  ngOnInit(): void {
    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedor = data;
      this.initializeForm();
    });
  }


  carregarImagemSelecionada(event: any) {
  this.selectedFile = event.target.files[0];

  if (this.selectedFile) {
    this.fileName = this.selectedFile.name;

    // carregando image preview
    const reader = new FileReader();
    reader.onload = e => this.imagePreview = reader.result;
    reader.readAsDataURL(this.selectedFile);

    // Adiciona o arquivo ao FormArray
    const formArray = this.formGroup.get('formArray') as FormArray;
    const listaImagemFormArray = formArray.at(3).get('listaImagem') as FormArray;
    listaImagemFormArray.push(this.formBuilder.control(this.selectedFile));
  }
}


  /*
  // Método para adicionar uma imagem manualmente ao FormArray
  adicionarImagem(imagem: File): void {
    const imagensFormArray = this.formGroup.get('formArray')?.get([3])?.get('listaImagem') as FormArray;
   
    if (imagensFormArray) {
      imagensFormArray.push(this.formBuilder.control(imagem));
    } else {
      console.error('FormArray ou listaImagem não encontrada.');
    }
  }
   
  // Método para remover uma imagem do FormArray e da lista
  removerImagem(index: number): void {
    const imagensFormArray = this.formGroup.get('formArray')?.get([3])?.get('listaImagem') as FormArray;
   
    if (imagensFormArray) {
      imagensFormArray.removeAt(index);
      this.listaImagens.splice(index, 1);
      this.imagePreview.splice(index, 1);
    }
    // Método para gerar a visualização da imagem antes do upload
    getImagePreview(file: File): string {
      return URL.createObjectURL(file);
    }
  }*/






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
    return (this.formGroup.get('formArray') as FormArray).at(2).get('saidas') as FormArray;
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

  private uploadImage(placaId: number) {
    const formArray = this.formGroup.get('formArray') as FormArray;
    const listaImagemFormArray = formArray.at(3).get('listaImagem') as FormArray;
    const listaImagem = listaImagemFormArray.controls.map(control => control.value);

    if (!listaImagem || listaImagem.length === 0) {
      this.voltarPagina();
      return;
    }

    let imagensEnviadas = 0;

    listaImagem.forEach((imagem, index) => {
      this.placaDeVideoService.uploadImage(placaId, imagem.name, imagem).subscribe({
        next: () => {
          imagensEnviadas++;
          console.log(`Imagem ${index + 1} enviada com sucesso!`);
          if (imagensEnviadas === listaImagem.length) {
            this.voltarPagina();
          }
        },
        error: (err) => {
          console.error(`Erro ao fazer o upload da imagem ${index + 1}:`, err);
          // Você pode continuar enviando as outras ou parar tudo aqui, depende da regra de negócio.
          this.snackbarService.showMessage('Placa salva, mas houve erro ao enviar uma ou mais imagens.', false);
          this.voltarPagina();
        }
      });
    });
  }


  trackByFn(index: number, item: any): number {
    return item; // ou use um identificador único
  }

  voltarPagina() {
    this.location.back();
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

    const placaDeVideo: PlacaDeVideo = {
      id: step1.id,
      modelo: step1.modelo,
      categoria: step1.categoria,
      preco: step1.preco,
      resolucao: step1.resolucao,
      descricao: step1.descricao,
      barramento: step1.barramento,
      idFan: step1.idFan,
      idFornecedor: step1.idFornecedor,
      energia: step2.energia,
      clockBase: step2.clockBase,
      clockBoost: step2.clockBoost,
      suporteRayTracing: step2.suporteRayTracing,
      memoria: {
        tipoMemoria: step2.memoria.tipoMemoria,
        capacidade: step2.memoria.capacidade,
        larguraBanda: step2.memoria.larguraBanda,
        velocidadeMemoria: step2.memoria.velocidadeMemoria,
      },
      tamanho: {
        largura: step3.tamanho.largura,
        altura: step3.tamanho.altura,
        comprimento: step3.tamanho.comprimento,
      },
      saidas: step3.saidas,
      listaImagem: []
    };

    // Decide a operação (insert ou update)
    const operacao = placaDeVideo.id == null
      ? this.placaDeVideoService.insert(placaDeVideo)
      : this.placaDeVideoService.update(placaDeVideo);

    operacao.subscribe({
      next: (placaCadastrada) => {
        this.uploadImage(placaCadastrada.id); // Chama o método de upload
      },
      error: (error) => {
        console.error("Erro ao salvar a placa de vídeo:", error);
        this.snackbarService.showMessage("Erro ao salvar a placa de vídeo.", false);
      }
    });
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
    barramento: {
      required: 'A barramento deve ser informada.',
      min: 'Informe pelo menos um item de barramento.',
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
