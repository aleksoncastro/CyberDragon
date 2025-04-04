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

@Component({
  selector: 'app-placadevideo-form',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './placadevideo-form.component.html',
  styleUrl: './placadevideo-form.component.css'
})
export class PlacaDeVideoFormComponent {
  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private placaDeVideoService: PlacaDeVideoService,
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
      fan: [placaDeVideo?.fan || '', [Validators.required, Validators.min(1)]],
      memoria: this.formBuilder.group({
        tipo: [placaDeVideo?.memoria?.tipo || '', Validators.required],
        capacidade: [placaDeVideo?.memoria?.capacidade || '', [Validators.required, Validators.min(1)]],
      }),
      tamanho: this.formBuilder.group({
        largura: [placaDeVideo?.tamanho?.largura || '', [Validators.required, Validators.min(1)]],
        altura: [placaDeVideo?.tamanho?.altura || '', [Validators.required, Validators.min(1)]],
      }),
      fornecedor: this.formBuilder.group({
        id: [placaDeVideo?.fornecedor?.id || null, Validators.required],
        nome: [placaDeVideo?.fornecedor?.nome || '', Validators.required],
      }),
      saidas: this.formBuilder.array(
        placaDeVideo?.saidas?.map(saida => this.createSaidaFormGroup(saida)) || []
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
    if (this.formGroup.valid) {
      const placaDeVideo = this.formGroup.value;
      if (placaDeVideo.id == null) {
        this.placaDeVideoService.insert(placaDeVideo).subscribe({
          next: () => {
            this.router.navigateByUrl('/placadevideo')
            this.snackbarService.showMessage('Placa de Vídeo Salva!', true);
          },
          error: (errorResponse) => {
            this.snackbarService.showMessage('Erro ao incluir a placa de vídeo!', false);
            console.log('Erro ao incluir' + JSON.stringify(errorResponse))
          }
        });
      } else {
        this.placaDeVideoService.update(placaDeVideo).subscribe({
          next: () => {
            this.snackbarService.showMessage('Placa de Vídeo Atualizada!', true);
            this.router.navigateByUrl('/placadevideo')
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
