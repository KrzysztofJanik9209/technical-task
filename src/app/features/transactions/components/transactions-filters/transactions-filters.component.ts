import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentTransactionStatusEnum } from '../../../../shared/models/transaction';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { TransactionsService } from '../../services/transactions/transactions.service';

@Component({
  selector: 'app-transactions-filters',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './transactions-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsFiltersComponent implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);

  public formGroup: FormGroup;
  public isLoading: Signal<boolean> = this._transactionsService.isLoading;

  public readonly statusLabels = Object.values(
    PaymentTransactionStatusEnum,
  ).map((value: string) => ({ value, label: value.toLowerCase() }));

  public ngOnInit(): void {
    this._createForm();
  }

  public onSubmitFilters(): void {
    this._transactionsService.setFilters(this.formGroup.getRawValue());
  }

  public onClearFilters(): void {
    this.formGroup.reset();
    this.onSubmitFilters();
  }

  private _createForm(): void {
    this.formGroup = new FormGroup({
      status: new FormControl<PaymentTransactionStatusEnum | null>(null),
      createdAtStart: new FormControl<Date | null>(null),
      createdAtEnd: new FormControl<Date | null>(null),
    });
  }
}
