import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentTransaction } from '../../../../shared/models/transaction';
import { BreakpointObserverService } from '../../../../shared/services/breakpoint-observer/breakpoint-observer.service';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsListComponent {
  private readonly _transactionsService = inject(TransactionsService);
  private readonly _breakpointObserverService = inject(
    BreakpointObserverService,
  );

  public readonly displayedColumns: string[] = [
    'createdAt',
    'description',
    'id',
    'currency',
    'amount',
    'status',
  ];

  public readonly transactions: Signal<PaymentTransaction[]> =
    this._transactionsService.transactions;
  public readonly resultsLength: Signal<number> =
    this._transactionsService.resultsLength;
  public readonly isLoading: Signal<boolean> =
    this._transactionsService.isLoading;
  public readonly pageSize: Signal<number> = this._transactionsService.pageSize;
  public readonly currentPage: Signal<number> =
    this._transactionsService.currentPage;
  public readonly isMobile: Signal<boolean> =
    this._breakpointObserverService.isMobile;

  public onPageChange(pageEvent: PageEvent): void {
    this._transactionsService.setCurrentPage(pageEvent.pageIndex);
  }
}
