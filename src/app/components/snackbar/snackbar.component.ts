import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  imports: [MatIconModule, NgClass],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  message: string;
  type: 'success' | 'error';
  icon: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; type: 'success' | 'error'; icon: string }
  ) {
    this.message = data.message;
    this.type = data.type;
    this.icon = data.icon;
  }
}