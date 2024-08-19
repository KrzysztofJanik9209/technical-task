export interface PaymentTransaction {
  amount: number;
  createdAt: string;
  currency: string;
  description: string;
  id: string;
  status: PaymentTransactionStatusEnum;
}

export enum PaymentTransactionStatusEnum {
  Captured = 'CAPTURED',
  Completed = 'COMPLETED',
  Created = 'CREATED',
  Failed = 'FAILED',
  Settled = 'SETTLED'
}