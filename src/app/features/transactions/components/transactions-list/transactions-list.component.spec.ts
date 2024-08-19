import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionsListComponent } from './transactions-list.component';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { BreakpointObserverService } from '../../../../shared/services/breakpoint-observer/breakpoint-observer.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, DatePipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  PaymentTransaction,
  PaymentTransactionStatusEnum,
} from '../../../../shared/models/transaction';

describe('TransactionsListComponent', () => {
  let component: TransactionsListComponent;
  let fixture: ComponentFixture<TransactionsListComponent>;
  let transactionsService: jasmine.SpyObj<TransactionsService>;
  let breakpointObserverService: jasmine.SpyObj<BreakpointObserverService>;

  beforeEach(() => {
    const transactionsServiceSpy = jasmine.createSpyObj('TransactionsService', [
      'transactions',
      'resultsLength',
      'isLoading',
      'pageSize',
      'currentPage',
      'setCurrentPage',
    ]);
    const breakpointObserverServiceSpy = jasmine.createSpyObj(
      'BreakpointObserverService',
      ['isMobile'],
    );

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        AsyncPipe,
        DatePipe,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: TransactionsService, useValue: transactionsServiceSpy },
        {
          provide: BreakpointObserverService,
          useValue: breakpointObserverServiceSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsListComponent);
    component = fixture.componentInstance;
    transactionsService = TestBed.inject(
      TransactionsService,
    ) as jasmine.SpyObj<TransactionsService>;
    breakpointObserverService = TestBed.inject(
      BreakpointObserverService,
    ) as jasmine.SpyObj<BreakpointObserverService>;
  });

  it('should test the table', (done) => {
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

    transactionsService.transactions.and.returnValue(mockTransactions);
    transactionsService.resultsLength.and.returnValue(1);
    transactionsService.isLoading.and.returnValue(false);
    transactionsService.pageSize.and.returnValue(5);
    transactionsService.currentPage.and.returnValue(0);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const tableRows = fixture.nativeElement.querySelectorAll('tr');

      expect(tableRows.length).toBe(2);

      const row1 = tableRows[1];
      expect(row1.cells[0].innerHTML.trim()).toBe('Sep 17, 2021');
      expect(row1.cells[1].innerHTML.trim()).toBe('description');
      expect(row1.cells[2].innerHTML.trim()).toBe('1');
      expect(row1.cells[3].innerHTML.trim()).toBe('USD');
      expect(row1.cells[4].innerHTML.trim()).toBe('100');
      expect(row1.cells[5].innerHTML.trim()).toBe('COMPLETED');

      done();
    });
  });

  it('should display "No data matching the filter." when there is no data', (done) => {
    transactionsService.transactions.and.returnValue([]);
    transactionsService.resultsLength.and.returnValue(0);
    transactionsService.isLoading.and.returnValue(false);
    transactionsService.pageSize.and.returnValue(5);
    transactionsService.currentPage.and.returnValue(0);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const tableRows = fixture.nativeElement.querySelectorAll('tr');

      expect(tableRows.length).toBe(2);

      const row1 = tableRows[1];
      expect(row1.cells[0].innerHTML.trim()).toBe(
        'No data matching the filter.',
      );

      done();
    });
  });
});
