import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Pedido, UpdateStatusPedido } from '../../../models/pedido.model';

@Component({
  selector: 'app-pedidos-status-modal',
  standalone: true,
  templateUrl: './pedido-status-modal.component.html',
  styleUrls: ['./pedido-status-modal.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,         // <-- IMPORTANTE!
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ]
})
export class PedidosStatusModalComponent {
  statusSelecionadoId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<PedidosStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      pedido: Pedido,
      statusOptions: UpdateStatusPedido[]
    }
  ) {}

  confirmar(): void {
    if (this.statusSelecionadoId) {
      const status = this.data.statusOptions.find(s => s.status.id === this.statusSelecionadoId);
      if (status) {
        this.dialogRef.close(status);
      }
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
