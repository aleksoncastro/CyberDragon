import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-cadastrar-cliente',
  standalone: true,
  templateUrl: './dialog-cadastrar-cliente.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogCadastrarClienteComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogCadastrarClienteComponent>,
    private router: Router
  ) {}

  irParaCadastro(): void {
    this.dialogRef.close();
    this.router.navigate(['/cliente/informacoes']);
  }

  fechar(): void {
    this.dialogRef.close();
  }
}
