import { PaymentTransactionsQueryParamsDto } from '../../../shared/models/payment-transactions-query-params-dto.model';
import { PaymentTransactionsFilters } from '../models/payment-transactions-filters';


export function toPaymentTransactionsFiltersDto(filters: PaymentTransactionsFilters, page: number): PaymentTransactionsQueryParamsDto {
  return {
    page,
    status: filters.status ?? undefined,
    createdAtStart: formatDate(filters.createdAtStart),
    createdAtEnd: formatDate(filters.createdAtEnd),
  }
}

function formatDate(date: Date | null): string | undefined {
  if (!date) {
    return undefined
  }

  return date.toISOString().split('T')[0]
}