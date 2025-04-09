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
  placadevideo: any[] = []; 
  idPlacaSelecionada: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private loteService: LoteService,
    private router: Router,
    private placaDeVideoService: PlacaDeVideoService,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {

    
    const lote: Lote = this.activatedRoute.snapshot.data['lote'];
    
    
    // Inicializando o formulário com valores, caso existam
    this.formGroup = this.formBuilder.group({
      id: [lote ? lote.id : null],
      codigo: [lote ? lote.codigo : '', Validators.required],
      estoque: [lote ? lote.estoque : '', [Validators.required, Validators.min(1)]],
      dataFabricacao: [lote ? lote.dataFabricacao : '', Validators.required],
      placaDeVideo: [lote?.idPlacaDeVideo ?? '', Validators.required]
    });
    console.log("Lote inicializado:", this.formGroup.value);
    console.log("Placas de vídeo carregadas:", this.placadevideo);
    this.placaDeVideoService.findAll().subscribe({
      next: (placas) => {
        this.placadevideo = placas;
      },
      error: (err) => {
        console.error('Erro ao buscar placas de vídeo', err);
      }
    });
    
  }

  atualizarIdPlaca(id: number) {
    this.idPlacaSelecionada = id;
    this.formGroup.patchValue({ placaDeVideo: id }); // Atualiza o formGroup
    console.log("Placa selecionada: ", this.idPlacaSelecionada);
    console.log("Valor atualizado no formGroup: ", this.formGroup.value);
  }

  salvar() {
    console.log("Método salvar() chamado!");
  
    if (!this.formGroup.valid) {
      console.warn("Formulário inválido! Verifique os campos.");
      return;
    }
  
    const formValue = this.formGroup.value;
  
    console.log("Valores do formulário:", formValue);
    console.log("ID da placa selecionada:", this.idPlacaSelecionada);
  
    const lote: Lote = {
      id: formValue.id,
      codigo: formValue.codigo,
      estoque: formValue.estoque,
      dataFabricacao: formValue.dataFabricacao,
      idPlacaDeVideo: this.idPlacaSelecionada ?? 0 // Usa 0 se estiver nulo
    };
  
    console.log("Lote a ser enviado:", JSON.stringify(lote, null, 2));
  
    if (lote.id == null) {
      console.log("Chamando API para INSERIR novo lote...");
      this.loteService.insert(lote).subscribe({
        next: () => {
          console.log("Lote salvo com sucesso!");
          this.snackbarService.showMessage("Lote Salvo!", true);
          this.router.navigateByUrl("/lotes");
        },
        error: (errorResponse) => {
          console.error("Erro ao salvar o lote:", errorResponse);
          this.snackbarService.showMessage("Erro ao salvar o lote!", false);
        }
      });
    } else {
      console.log("Chamando API para ATUALIZAR lote...");
      this.loteService.update(lote).subscribe({
        next: () => {
          console.log("Lote atualizado com sucesso!");
          this.snackbarService.showMessage("Lote Atualizado!", true);
          this.router.navigateByUrl("/lotes");
        },
        error: (errorResponse) => {
          console.error("Erro ao atualizar o lote:", errorResponse);
          this.snackbarService.showMessage("Erro ao atualizar o lote!", false);
        }
      });
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
