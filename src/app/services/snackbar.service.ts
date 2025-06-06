import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 3;

  constructor(private snackbar: MatSnackBar) { }

  showMessage(message: string, isSuccess: boolean = true): void {
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      panelClass: isSuccess ? 'success-snackbar' : 'error-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }



  showSuccess(message: string): void {
    this.snackbar.openFromComponent(SnackbarComponent,{
      data:{
        message,
        type: 'success',
        icon: 'check_circle',
      },
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-container', 'success']
    })
  }

  showError(message: string): void {  
    this.snackbar.openFromComponent(SnackbarComponent,{
      data:{
        message,
        type: 'error',
        icon: 'error',
      },
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snackbar-container', 'error']
    })
  }


}
