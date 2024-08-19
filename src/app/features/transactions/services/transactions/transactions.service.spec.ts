import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import { ResponseApi, TransactionsHttpService } from '../../../../shared';
import { NotificationsService } from '../../../../shared/services/notifications/notifications.service';
import {
  PaymentTransaction,
  PaymentTransactionStatusEnum,
} from '../../../../shared/models/transaction';
import { of, throwError } from 'rxjs';
import { PaymentTransactionsFilters } from '../../models/payment-transactions-filters';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionsHttpService: jasmine.SpyObj<TransactionsHttpService>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    const transactionsHttpServiceSpy = jasmine.createSpyObj(
      'TransactionsHttpService',
      ['getTransactions'],
    );
    const notificationsServiceSpy = jasmine.createSpyObj(
      'NotificationsService',
      ['showMessage'],
    );

    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionsHttpService,
          useValue: transactionsHttpServiceSpy,
        },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
      ],
    });

    service = TestBed.inject(TransactionsService);
    transactionsHttpService = TestBed.inject(
      TransactionsHttpService,
    ) as jasmine.SpyObj<TransactionsHttpService>;
    notificationsService = TestBed.inject(
      NotificationsService,
    ) as jasmine.SpyObj<NotificationsService>;
  });

  it('should fetch transactions and update state on success', fakeAsync(() => {
    const mockTransactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        status: PaymentTransactionStatusEnum.Completed,
        createdAt: '2021-09-17',
        currency: 'USD',
        description: 'description',
      },
    ];
    const mockResponse: ResponseApi<PaymentTransaction> = {
      items: mockTransactions,
      totalNumberOfItems: 20,
      currentPage: 0,
      hasNext: true,
      numberOfPages: 4,
      pageSize: 5,
    };

    transactionsHttpService.getTransactions.and.returnValue(of(mockResponse));

    service.fetchTransactions();
    tick(300); // Simulate the delay

    expect(service.isLoading()).toBe(false);
    expect(service.transactions()).toEqual(mockTransactions);
    expect(service.resultsLength()).toBe(20);
    expect(transactionsHttpService.getTransactions).toHaveBeenCalledTimes(1);
  }));

  it('should handle error when fetching transactions', fakeAsync(() => {
    transactionsHttpService.getTransactions.and.returnValue(
      throwError(() => new Error('test')),
    );

    service.fetchTransactions();
    tick(300); // Simulate the delay

    expect(service.isLoading()).toBe(false);
    expect(service.transactions()).toEqual([]);
    expect(notificationsService.showMessage).toHaveBeenCalledWith(
      'Failed to load transactions. Please try again later.',
    );
  }));

  it('should set filters and fetch transactions', fakeAsync(() => {
    const filters: PaymentTransactionsFilters = {
      status: PaymentTransactionStatusEnum.Completed,
      createdAtStart: new Date('2023-01-01'),
      createdAtEnd: new Date('2023-12-31'),
    };

    spyOn(service, 'fetchTransactions');

    service.setFilters(filters);
    tick(300); // Simulate the delay

    expect(service.currentPage()).toBe(0);
    expect(service.fetchTransactions).toHaveBeenCalledTimes(1);
  }));

  it('should set current page and fetch transactions', fakeAsync(() => {
    spyOn(service, 'fetchTransactions');

    service.setCurrentPage(2);
    tick(300); // Simulate the delay

    expect(service.currentPage()).toBe(2);
    expect(service.fetchTransactions).toHaveBeenCalledTimes(1);
  }));
});
