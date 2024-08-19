import { HttpParams } from '@angular/common/http';

export abstract class BaseHttpService {
  public static parseObjValuesToStringParam(obj: Record<string, any>): string {
    return Object.values(obj)
      .filter((k) => !!obj[k])
      .map((val) => val.toString())
      .join(',');
  }
  public parseToHttpParams(
    params: Record<string, any>,
    httpParams: HttpParams = new HttpParams(),
  ): HttpParams {
    Object.keys(params)
      .filter(
        (key: string) => !isNullOrUndefined(params[key]) && params[key] !== '',
      )
      .forEach((key: string) => {
        const val = this.parseValueToParams(params[key]);
        httpParams = httpParams.append(key, val);
      });
    return httpParams;
  }

  public parseValueToParams(val: unknown): string {
    switch (true) {
      case Array.isArray(val):
        return (val as []).join(',');
      case val instanceof Date:
        return (val as Date).toISOString();
      case val !== null && typeof val === 'object':
        return BaseHttpService.parseObjValuesToStringParam(
          val as Record<string, unknown>,
        );
    }
    return `${val}`;
  }
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
