import { PaymentTransactionStatusEnum } from '../../../shared/models/transaction';

export interface PaymentTransactionsFilters {
  status:  PaymentTransactionStatusEnum | null;
  createdAtStart: Date | null;
  createdAtEnd: Date | null;
}