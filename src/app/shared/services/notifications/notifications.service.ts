import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly _snackBar = inject(MatSnackBar);

  public showMessage(
    message: string,
    duration = 5000,
    actionLabel = 'Close',
  ): void {
    const config: MatSnackBarConfig = {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    };

    this._snackBar.open(message, actionLabel, config);
  }
}
