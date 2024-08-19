import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, delay, EMPTY, map, Observable } from 'rxjs';
import { ResponseApi, TransactionsHttpService } from '../../../../shared';
import { PaymentTransaction } from '../../../../shared/models/transaction';
import { PaymentTransactionsQueryParamsDto } from '../../../../shared/models/payment-transactions-query-params-dto.model';
import { toPaymentTransactionsFiltersDto } from '../../utils/to-payment-transactions-filters-dto';
import { PaymentTransactionsFilters } from '../../models/payment-transactions-filters';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private readonly _transactionsHttp = inject(TransactionsHttpService);
  private readonly _notificationsService = inject(NotificationsService);

  public get transactions(): Signal<PaymentTransaction[]> {
    return this._transactions.asReadonly();
  }

  public get isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  public get resultsLength(): Signal<number> {
    return this._resultsLength.asReadonly();
  }

  public get pageSize(): Signal<number> {
    return this._pageSize.asReadonly();
  }

  public get currentPage(): Signal<number> {
    return this._currentPage.asReadonly();
  }

  private _transactions = signal<PaymentTransaction[]>([]);
  private _currentPage = signal<number>(0);
  private _filters = signal<PaymentTransactionsFilters>({
    status: null,
    createdAtStart: null,
    createdAtEnd: null,
  });

  private _isLoading = signal<boolean>(false);
  private _resultsLength = signal<number>(0);
  private _pageSize = signal<number>(5);

  public fetchTransactions(): void {
    const filters = toPaymentTransactionsFiltersDto(
      this._filters(),
      this._currentPage(),
    );

    this._isLoading.set(true);
    this._getTransactions(filters)
      .pipe(
        // delay - added to show loader on table
        delay(300),
        map((transactions: ResponseApi<PaymentTransaction>) => {
          this._isLoading.set(false);

          this._transactions.set(transactions.items);

          if (!transactions.items?.length) {
            this.resetPaginatorProperties();
            return [];
          }

          this._resultsLength.set(transactions.totalNumberOfItems);

          return transactions.items;
        }),
        catchError(() => {
          this._isLoading.set(false);
          this.resetPaginatorProperties();
          this._notificationsService.showMessage(
            'Failed to load transactions. Please try again later.',
          );
          return EMPTY;
        }),
      )
      .subscribe();
  }

  public setFilters(filters: PaymentTransactionsFilters): void {
    this._filters.set(filters);
    this._currentPage.set(0);
    this.fetchTransactions();
  }

  public setCurrentPage(page: number): void {
    this._currentPage.set(page);
    this.fetchTransactions();
  }

  private _getTransactions(
    queryParams: PaymentTransactionsQueryParamsDto,
  ): Observable<ResponseApi<PaymentTransaction>> {
    return this._transactionsHttp.getTransactions(queryParams);
  }

  private resetPaginatorProperties(): void {
    this._currentPage.set(0);
    this._resultsLength.set(0);
  }
}
