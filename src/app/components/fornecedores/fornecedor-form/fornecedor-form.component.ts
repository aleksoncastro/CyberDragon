import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FornecedorService } from '../../../services/fornecedor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-fornecedor-form',
  imports: [MatCardModule, MatFormField, MatLabel, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './fornecedor-form.component.html',
  styleUrl: './fornecedor-form.component.css'
})

export class FornecedoresFormComponent implements OnInit {
  formGroup!: FormGroup;
  id?: number;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.fornecedorService.buscarPorId(this.id).subscribe((fornecedor) => {
        this.formGroup.patchValue(fornecedor);
      });
    }
  }

  salvar(): void {
    if (this.id) {
      this.fornecedorService.atualizar(this.id, this.formGroup.value).subscribe(() => {
        this.router.navigate(['/fornecedores']);
      });
    } else {
      this.fornecedorService.salvar(this.formGroup.value).subscribe(() => {
        this.router.navigate(['/fornecedores']);
      });
    }
  }
}