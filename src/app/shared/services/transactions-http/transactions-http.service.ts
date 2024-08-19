import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../../models';
import { PaymentTransaction } from '../../models/transaction';
import { environment } from '../../../../environment/environment';
import { PaymentTransactionsQueryParamsDto } from '../../models/payment-transactions-query-params-dto.model';
import { BaseHttpService } from '../base-http/base-http.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsHttpService extends BaseHttpService {
  private readonly _http = inject(HttpClient);

  public getTransactions(
    queryParams: PaymentTransactionsQueryParamsDto,
  ): Observable<ResponseApi<PaymentTransaction>> {
    const params = this.parseToHttpParams(queryParams);
    const url = `${environment.apiDomain}/payments`;

    return this._http.get<ResponseApi<PaymentTransaction>>(url, { params });
  }
}
