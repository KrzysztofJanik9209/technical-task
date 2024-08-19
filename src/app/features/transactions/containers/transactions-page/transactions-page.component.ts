import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  Signal,
} from '@angular/core';
import { TransactionsListComponent } from '../../components/transactions-list/transactions-list.component';
import { TransactionsFiltersComponent } from '../../components/transactions-filters/transactions-filters.component';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { AsyncPipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreakpointObserverService } from '../../../../shared/services/breakpoint-observer/breakpoint-observer.service';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    TransactionsListComponent,
    TransactionsFiltersComponent,
    AsyncPipe,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-3">
      <span class="text-2xl">Payment Transactions</span>
    </div>

    <div class="mb-3">
      <mat-accordion>
        <mat-expansion-panel [expanded]="!isMobile()">
          <mat-expansion-panel-header>
            <mat-panel-title> Filters </mat-panel-title>
          </mat-expansion-panel-header>

          <app-transactions-filters />
        </mat-expansion-panel>
      </mat-accordion>
    </div>

    <app-transactions-list />
  `,
})
export class TransactionsPageComponent implements OnInit {
  private readonly _transactionsService = inject(TransactionsService);
  public readonly isMobile: Signal<boolean> = inject(BreakpointObserverService)
    .isMobile;

  public ngOnInit(): void {
    this._transactionsService.fetchTransactions();
  }
}
