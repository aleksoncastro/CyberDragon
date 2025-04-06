import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FornecedorService } from '../../../services/fornecedor.service';
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
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-placadevideo-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule, MatOptionModule, MatSelectModule],
  templateUrl: './placadevideo-form.component.html',
  styleUrl: './placadevideo-form.component.css'
})
export class PlacaDeVideoFormComponent {
  fornecedores: any[] = [];
  formGroup: FormGroup;
  idFornecedorSelecionado: number | null = null;


  constructor(private formBuilder: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
    private router: Router,
    private fornecedorService: FornecedorService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService) {

    const placaDeVideo: PlacaDeVideo = this.activatedRoute.snapshot.data['placadevideo'];

    this.fornecedorService.findAll().subscribe(data => {
      this.fornecedores = data;

      if (placaDeVideo?.fornecedor?.id) {
        this.idFornecedorSelecionado = placaDeVideo.fornecedor.id;
      }
    });

    this.formGroup = this.formBuilder.group({
      id: [(placaDeVideo && placaDeVideo.id) ? placaDeVideo.id : null],
      modelo: [placaDeVideo?.modelo || '', Validators.required],
      categoria: [placaDeVideo?.categoria || '', Validators.required],
      preco: [placaDeVideo?.preco || '', [Validators.required, Validators.min(0)]],
      resolucao: [placaDeVideo?.resolucao || '', Validators.required],
      energia: [placaDeVideo?.energia || '', [Validators.required, Validators.min(0)]],
      descricao: [placaDeVideo?.descricao || '', Validators.required],
      compatibilidade: [placaDeVideo?.compatibilidade || '', [Validators.required, Validators.min(1)]],
      clockBase: [placaDeVideo?.clockBase || '', [Validators.required, Validators.min(0)]],
      clockBoost: [placaDeVideo?.clockBoost || '', [Validators.required, Validators.min(0)]],
      suporteRayTracing: [placaDeVideo?.suporteRayTracing || false],
      fan: [placaDeVideo?.fan || '', [Validators.required, Validators.min(1)]],
      memoria: this.formBuilder.group({
        tipo: [placaDeVideo?.memoria?.tipo || '', Validators.required],
        capacidade: [placaDeVideo?.memoria?.capacidade || '', [Validators.required, Validators.min(1)]],
      }),
      tamanho: this.formBuilder.group({
        largura: [placaDeVideo?.tamanho?.largura || '', [Validators.required, Validators.min(1)]],
        altura: [placaDeVideo?.tamanho?.altura || '', [Validators.required, Validators.min(1)]],
      }),
      fornecedor: [placaDeVideo?.fornecedor?.id ?? '', [Validators.required, Validators.min(1)]],
      saidas: this.formBuilder.array(
        (placaDeVideo?.saidas && placaDeVideo.saidas.length > 0)
          ? placaDeVideo.saidas.map(saida => this.createSaidaFormGroup(saida))
          : [this.createSaidaFormGroup()] // <-- cria uma saída se estiver vazio
      )
    });
  }

  createSaidaFormGroup(saida?: any): FormGroup {
    return this.formBuilder.group({
      tipo: [saida?.tipo || '', Validators.required],
      quantidade: [saida?.quantidade || '', [Validators.required, Validators.min(1)]],
    });
  }
  getSaidas(): FormArray {
    return this.formGroup.get('saidas') as FormArray;
  }

  atualizarIdFornecedor(id: number) {
    this.idFornecedorSelecionado = id;
    this.formGroup.patchValue({ fornecedor: id }); // Atualiza o campo no formulário
    console.log('Fornecedor selecionado:', id);
  }

  // Método para adicionar uma nova saída de vídeo ao array
  adicionarSaida(): void {
    this.getSaidas().push(
      this.formBuilder.group({
        tipo: ['', Validators.required],
        quantidade: [0, Validators.required]
      })
    );
  }

  removerSaida(index: number) {
    (this.formGroup.get('saidas') as FormArray).removeAt(index);
  }

  salvar() {
    console.log(this.formGroup.valid);
    console.log(this.formGroup.value);

    if (this.formGroup.valid) {
      // Extrai os dados do formulário
      const formValue = this.formGroup.value;

      // Garante que o ID do fornecedor seja um número válido
      const fornecedorId = Number(formValue.fornecedor);

      // Validação extra: se o ID não for positivo, não envia
      const fornecedorObj = fornecedorId > 0 ? { id: fornecedorId } : null;

      // Monta o objeto final
      const placaDeVideo = {
        ...formValue,
        fornecedor: fornecedorObj
      };

      if (placaDeVideo.id == null) {
        this.placaDeVideoService.insert(placaDeVideo).subscribe({
          next: () => {
            this.router.navigateByUrl('/placadevideo');
            this.snackbarService.showMessage('Placa de Vídeo Salva!', true);
          },
          error: (errorResponse) => {
            this.snackbarService.showMessage('Erro ao incluir a placa de vídeo!', false);
            console.log('Erro ao incluir: ' + JSON.stringify(errorResponse));
          }
        });
      } else {
        this.placaDeVideoService.update(placaDeVideo).subscribe({
          next: () => {
            this.snackbarService.showMessage('Placa de Vídeo Atualizada!', true);
            this.router.navigateByUrl('/placadevideo');
          }
        });
      }
    }
  }

  excluir() {
    const placaDeVideo = this.formGroup.value;
    if (placaDeVideo.id != null) {
      this.placaDeVideoService.delete(placaDeVideo).subscribe({
        next: () => {
          this.snackbarService.showMessage('Placa de Vídeo Excluída!', true);
          this.router.navigateByUrl('/placadevideo')
        },
        error: (err) => {
          this.snackbarService.showMessage('Erro ao excluir a placa de vídeo!', false);
          console.log('Erro ao excluir' + JSON.stringify(err))
        }
      });
    }
  }
}
