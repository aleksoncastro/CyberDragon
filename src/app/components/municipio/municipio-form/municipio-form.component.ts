import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MunicipioService } from '../../../services/municipio.service';
import { EstadoService } from '../../../services/estado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Municipio } from '../../../models/municipio.model';
import { MatCardModule } from '@angular/material/card';
import { PageResponse } from '../../../interfaces/pageresponse';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-municipio-form',
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, MatCardModule, CommonModule],
  templateUrl: './municipio-form.component.html',
  styleUrl: './municipio-form.component.css'
})
export class MunicipioFormComponent {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(private formBuilder: FormBuilder,
    private municipioService: MunicipioService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService) {

    // incicializando
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null]
    });

  }


  ngOnInit(): void {
    this.estadoService.findAll().subscribe((data: PageResponse<Estado>) => {
      this.estados = data.results;  // Agora, estamos acessando 'results' para obter o array de Estados
      console.log("Estados carregados:", this.estados); // Verifique se os estados estão sendo carregados corretamente
      this.initializeForm();
    });
  }


  initializeForm(): void {
    const municipio: Municipio = this.activatedRoute.snapshot.data['municipio'] || { id: null, nome: '', estado: null };

    if (municipio.estado) {
      console.log("Município carregado:", municipio);
    }

    this.formGroup = this.formBuilder.group({
      id: [municipio.id],
      nome: [municipio.nome, Validators.required],
      estado: [municipio.estado ? municipio.estado.id : null, Validators.required], // Armazena apenas o ID do estado
    });

    console.log("Formulário inicializado:", this.formGroup.value);
  }


  salvar(): void {
    if (this.formGroup.valid) {
      const municipio: Municipio = {
        id: this.formGroup.value.id,
        nome: this.formGroup.value.nome,
        estado: this.estados.find(e => e.id === this.formGroup.value.estado)!, // Converte ID de volta para objeto Estado
      };

      if (municipio.id) {
        this.municipioService.update(municipio).subscribe(() => {
          this.snackbarService.showMessage('Municipio Atualizado!', true);
          this.router.navigate(['/admin/municipios']);
        });
      } else {
        this.municipioService.insert(municipio).subscribe(() => {
          this.snackbarService.showMessage('Municipio Adicionado!', true);
          this.router.navigate(['/admin/municipios']);
        });
      }
    }
  }


  excluir() {
    if (this.formGroup.valid) {
      const municipios = this.formGroup.value;
      if (municipios.id != null) {
        this.municipioService.delete(municipios).subscribe({
          next: () => {
            this.snackbarService.showMessage('Erro ao excluir o municipio!', false);
            this.router.navigateByUrl('/admin/municipioss');
          },
          error: (err) => {
            console.log('Erro ao excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

}

