import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MunicipioService } from '../../../services/municipio.service';
import { EstadoService } from '../../../services/estado.service';
import { Router } from '@angular/router';
import { Estado } from '../../../models/estado.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-municipio-form',
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
      MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule],
  templateUrl: './municipio-form.component.html',
  styleUrl: './municipio-form.component.css'
})
export class MunicipioFormComponent {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(private formBuilder: FormBuilder,
              private municipioService: MunicipioService,
              private estadoService: EstadoService,
              private router: Router) {

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      estadoId: ['', Validators.required]
    });

    this.estadoService.findAll().subscribe(data => {
      this.estados = data;
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const novoMunicipio = this.formGroup.value;
      this.municipioService.insert(novoMunicipio).subscribe({
        next: (municipioCadastrado) => {
          console.log(JSON.stringify(municipioCadastrado));
          // this.router.navigateByUrl('/municipios');
        },
        error: (e) => {
          console.log('Erro ao gravar ' + JSON.stringify(e));
        }
      });
    }
  }
}

