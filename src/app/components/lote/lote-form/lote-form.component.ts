import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoteService } from '../../../services/lote.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../services/snackbar.service';
import { Lote } from '../../../models/lote.model';
import { NgIf, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PlacaDeVideoService } from '../../../services/placadevideo.service';

@Component({
  selector: 'app-lote-form',
  imports: [NgIf, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatDatepickerModule, MatOptionModule, MatNativeDateModule, MatSelectModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }  // Para datas no formato brasileiro
  ],
  templateUrl: './lote-form.component.html',
  styleUrls: ['./lote-form.component.css']
})
export class LoteFormComponent implements OnInit {
  formGroup!: FormGroup;
  lotes: Lote[] = [];
  placadevideo: any[] = []; // Array para armazenar as placas de vídeo

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private router: Router,
    private placaDeVideoService: PlacaDeVideoService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {

    // Obter o lote se estiver editando
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];

    // Inicializando o formulário com valores, caso existam
    this.formGroup = this.formBuilder.group({
      id: [lote ? lote.id : null],
      codigo: [lote ? lote.codigo : '', Validators.required],
      estoque: [lote ? lote.estoque : '', [Validators.required, Validators.min(1)]],
      dataFabricacao: [lote ? lote.dataFabricacao : '', Validators.required],
      placaDeVideo: [lote ? lote.idPlacaDeVideo : null, Validators.required]
 // Corrigido para usar o ID da placa
    });

    this.placaDeVideoService.findAll().subscribe({
      next: (placas) => {
        this.placadevideo = placas;
      },
      error: (err) => {
        console.error('Erro ao buscar placas de vídeo', err);
      }
    });
    
  }

  salvar() {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;

      const lote: Lote = {
        id: formValue.id,
        codigo: formValue.codigo,
        estoque: formValue.estoque,
        dataFabricacao: formValue.dataFabricacao,
        idPlacaDeVideo: formValue.placaDeVideo
      };
      
      if (lote.id == null) {
        // Chamar o serviço para criar um novo lote
        console.log('JSON enviado para o backend:', JSON.stringify(lote, null, 2));

        this.loteService.insert(lote).subscribe({
          next: () => {
            this.snackbarService.showMessage('Lote Salvo!', true);
            this.router.navigateByUrl('/lotes');
          },
          error: (errorResponse) => {
            this.snackbarService.showMessage('Erro ao salvar o lote!', false);
            console.log('Erro ao salvar' + JSON.stringify(errorResponse));
          }
        });
      } else {
        // Chamar o serviço para atualizar o lote existente
        this.loteService.update(lote).subscribe({
          next: () => {
            this.snackbarService.showMessage('Lote Atualizado!', true);
            this.router.navigateByUrl('/lotes');
          },
          error: (errorResponse) => {
            this.snackbarService.showMessage('Erro ao atualizar o lote!', false);
            console.log('Erro ao atualizar' + JSON.stringify(errorResponse));
          }
        });
      }
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const lote = this.formGroup.value;
      if (lote.id != null) {
        this.loteService.delete(lote.id).subscribe({
          next: () => {
            this.router.navigateByUrl('/lotes');
          },
          error: (err) => {
            console.log('Erro ao excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }
}
