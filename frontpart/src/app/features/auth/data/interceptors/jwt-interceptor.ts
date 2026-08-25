import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';

import {
  inject,
} from '@angular/core';

import {
  Router,
} from '@angular/router';

import {
  catchError,
  throwError,
} from 'rxjs';

import {
  Auth,
} from '../services/auth';

const AUTH_API_URL =
  'http://localhost:3000/api/auth';

export const jwtInterceptor: HttpInterceptorFn = (
  request,
  next,
) => {
  const auth = inject(Auth);
  const router = inject(Router);

  /*
   * Les endpoints d'authentification
   * ne nécessitent pas de JWT.
   */
  const isAuthRequest =
    request.url === `${AUTH_API_URL}/signin` ||
    request.url === `${AUTH_API_URL}/signup`;

  if (isAuthRequest) {
    return next(request);
  }

  /*
   * Récupération du token depuis le store Auth.
   */
  const token = auth.accessToken();

  /*
   * Aucun token :
   * on laisse passer la requête telle quelle.
   */
  if (!token) {
    return next(request);
  }

  /*
   * HttpRequest est immutable.
   * On doit donc créer une copie.
   */
  const authenticatedRequest =
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      /*
       * Le backend indique que le JWT
       * n'est plus valide.
       */
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401
      ) {
        const returnUrl = router.url;

        auth.logout();

        void router.navigate(
          ['/auth/signin'],
          {
            queryParams: {
              returnUrl,
            },
          },
        );
      }

      return throwError(
        () => error,
      );
    }),
  );
};

