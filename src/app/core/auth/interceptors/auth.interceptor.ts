import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const username = 'user';
  const password = 'userPass';
  const authHeader = 'Basic ' + btoa(`${username}:${password}`);

  const authReq = req.clone({
    setHeaders: {
      Authorization: authHeader,
    },
  });

  return next(authReq);
};
