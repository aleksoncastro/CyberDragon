import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-municipio-form',
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
      MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, MatCardModule, CommonModule],
  templateUrl: './municipio-form.component.html',
  styleUrl: './municipio-form.component.css'
})
export class MunicipioFormComponent implements OnInit {
  formGroup: FormGroup;
  estados: Estado[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private municipioService: MunicipioService,
    private estadoService: EstadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Inicializando
    this.formGroup = this.formBuilder.group({
      id: [null],
      nome: ['', Validators.required],
      estado: [null]
    });
  }
  
  
  
  ngOnInit(): void {
    this.estadoService.findAll().subscribe(estados => {
      this.estados = estados;
      console.log('Estados carregados:', this.estados);
      this.initializeForm();
    });
  }
  
  initializeForm(){
   const municipio: Municipio = this.activatedRoute.snapshot.data['municipio'];

   //selecionando o estado
   const estado = this.estados.find(e => e.id === (municipio?.estado?.id || null));

   this.formGroup = this.formBuilder.group({
    id: [(municipio && municipio.id) ? municipio.id : null],
    nome: [(municipio && municipio.nome) ? municipio.nome : '', Validators.required],
    estado:[estado],
   })
    
  }

  onSubmit() {
    if (this.formGroup.valid) {
      // Busca o estado selecionado a partir do ID
      const estadoSelecionado = this.estados.find(e => e.id === this.formGroup.value.estado);
  
      if (!estadoSelecionado) {
        console.error('Erro: Estado não encontrado!');
        return;
      }
  
      const municipio: Municipio = {
        id: this.formGroup.value.id,
        nome: this.formGroup.value.nome,
        estado: estadoSelecionado // ✅ Agora enviamos o objeto completo
      };
  
      console.log('Enviando para API:', municipio); // ✅ Confirmação dos dados
  
      this.municipioService.insert(municipio).subscribe({
        next: (municipioCadastrado) => console.log('Sucesso:', municipioCadastrado),
        error: (e) => console.error('Erro ao gravar:', e)
      });
    }
  }
  
  
  
}

