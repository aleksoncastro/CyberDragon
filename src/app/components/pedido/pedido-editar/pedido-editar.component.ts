import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pedido } from '../../../models/pedido.model';
import { ActivatedRoute, Router} from '@angular/router';
import { PedidoADMService } from '../../../services/pedidoADM.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pedido-editar',
  imports: [CommonModule, NgIf, NgFor, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatCardModule],
  templateUrl: './pedido-editar.component.html',
  styleUrl: './pedido-editar.component.css'
})
export class PedidoEditarComponent {
  form!: FormGroup;
  pedido!: Pedido;
  statusOptions = [
    { id: 1, label: 'Aguardando Pagamento' },
    { id: 2, label: 'Processando' },
    { id: 3, label: 'Enviado' },
    { id: 4, label: 'Entregue' },
    { id: 5, label: 'Cancelado' },
  ];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private pedidoService: PedidoADMService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // Pega o id do pedido na rota
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Inicializa o form com status vazio e obrigatório
    this.form = this.fb.group({
      status: [null, Validators.required]
    });

    // Busca o pedido pelo id para preencher o form
    this.pedidoService.findById(id).subscribe(pedido => {
      this.pedido = pedido;

      // Pega o último status e define no form
      const ultimoStatus = pedido.statusPedido?.length
        ? pedido.statusPedido[pedido.statusPedido.length - 1].status.id
        : null;

      this.form.patchValue({ status: ultimoStatus });
    });
  }

  cancelar() {
    this.router.navigateByUrl('/admin/pedidos-list');
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const statusId = this.form.value.status;  // já é number
    this.pedidoService.changeStatus(this.pedido.id!, statusId).subscribe({
      next: () => {
        alert('Status atualizado com sucesso!');
        this.cancelar();  // volta para lista após sucesso
      },
    });
  }
}

