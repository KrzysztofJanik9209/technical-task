import { Routes } from '@angular/router';
import { TransactionsPageComponent } from './containers/transactions-page/transactions-page.component';

export const TRANSACTIONS_ROUTES: Routes = [
  {
    path: '',
    component: TransactionsPageComponent,
  },
];
