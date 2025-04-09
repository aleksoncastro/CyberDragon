import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-placadevideo-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './placadevideo-form.component.html',
  styleUrl: './placadevideo-form.component.css'
})
export class PlacaDeVideoFormComponent {
  fornecedor: any[] = [];
  formGroup: FormGroup;
  idFornecedorSelecionado: number | null = null;

  constructor(private formBuilder: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
    private fornecedorService: FornecedorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService) {

    const placaDeVideo: PlacaDeVideo = this.activatedRoute.snapshot.data['placadevideo'];

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
      idFan: [placaDeVideo?.idFan || '', [Validators.required, Validators.min(1)]],
      idFornecedor: [placaDeVideo?.idFornecedor ?? '', Validators.required],
      memoria: this.formBuilder.group({
        tipoMemoria: [placaDeVideo?.memoria?.tipoMemoria || '', Validators.required],
        capacidade: [placaDeVideo?.memoria?.capacidade || '', [Validators.required, Validators.min(1)]],
        larguraBanda: [placaDeVideo?.memoria?.larguraBanda || '', [Validators.required, Validators.min(1)]],
        velocidadeMemoria: [placaDeVideo?.memoria?.velocidadeMemoria || '', [Validators.required, Validators.min(1)]],
      }),
      tamanho: this.formBuilder.group({
        largura: [placaDeVideo?.tamanho?.largura || '', [Validators.required, Validators.min(1)]],
        altura: [placaDeVideo?.tamanho?.altura || '', [Validators.required, Validators.min(1)]],
        comprimento: [placaDeVideo?.tamanho?.comprimento || '', [Validators.required, Validators.min(1)]],
      }),
      saidas: this.formBuilder.array(
        placaDeVideo?.saidas?.map(saida => this.createSaidaFormGroup(saida)) || []
      )
    });
    console.log("PlacaDeVideo inicializada:", this.formGroup.value);
    this.fornecedorService.findAll().subscribe({
      next: (fornecedores) => {
        this.fornecedor = fornecedores;
        console.log("Fornecedores carregados:", this.fornecedor);
      },
      error: (err) => {
        console.error('Erro ao buscar fornecedores', err);
      }
    });
  }

  atualizarIdFornecedor(id: number) {
    this.idFornecedorSelecionado = id;
    this.formGroup.patchValue({idFornecedor : id});
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
    return this.formGroup.get('saidas') as FormArray;
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
    console.log("Método salvar() da Placa de Vídeo chamado!");
  
    if (!this.formGroup.valid) {
      console.warn("Formulário inválido! Verifique os campos.");
      return;
    }
  
    const formValue = this.formGroup.value;
    console.log("Valores do formulário:", formValue);
  
    const placaDeVideo: PlacaDeVideo = {
      id: formValue.id,
      modelo: formValue.modelo,
      categoria: formValue.categoria,
      preco: formValue.preco,
      resolucao: formValue.resolucao,
      energia: formValue.energia,
      descricao: formValue.descricao,
      compatibilidade: formValue.compatibilidade,
      clockBase: formValue.clockBase,
      clockBoost: formValue.clockBoost,
      suporteRayTracing: formValue.suporteRayTracing,
      idFan: formValue.idFan, // CORRIGIDO: era ididFan
      idFornecedor: formValue.idFornecedor, // CORRIGIDO: era idFornecedor
      memoria: {
        tipoMemoria: formValue.memoria.tipoMemoria, // CORRIGIDO: tipoMemoriaMemoria → tipoMemoria
        capacidade: formValue.memoria.capacidade,
        larguraBanda: formValue.memoria.larguraBanda,
        velocidadeMemoria: formValue.memoria.velocidadeMemoria,
      },
      tamanho: {
        largura: formValue.tamanho.largura,
        altura: formValue.tamanho.altura,
        comprimento: formValue.tamanho.comprimento,
      },
      saidas: formValue.saidas,
      listaImagem: []
    };
  
    console.log("Objeto PlacaDeVideo a ser enviado:", JSON.stringify(placaDeVideo, null, 2));
  
    if (placaDeVideo.id == null) {
      console.log("Chamando API para INSERIR nova placa de vídeo...");
      this.placaDeVideoService.insert(placaDeVideo).subscribe({
        next: () => {
          console.log("Placa de vídeo salva com sucesso!");
          this.router.navigateByUrl("/placadevideo");
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
          this.router.navigateByUrl("/placadevideo");
        },
        error: (errorResponse) => {
          console.error("Erro ao atualizar a placa de vídeo:", errorResponse);
        }
      });
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
