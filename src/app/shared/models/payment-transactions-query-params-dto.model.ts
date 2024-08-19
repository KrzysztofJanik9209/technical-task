import { PaymentTransactionStatusEnum } from './transaction';

export interface PaymentTransactionsQueryParamsDto {
  createdAtStart?: string;
  createdAtEnd?: string;
  page?: number;
  size?: number;
  status?: PaymentTransactionStatusEnum;
}