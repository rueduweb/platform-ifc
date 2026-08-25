import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = (
  _route,
  state,
) => {
  const auth = inject(Auth);
  const router = inject(Router);

  /*
   * Pas authentifié :
   * on demande d'abord une connexion.
   */
  if (!auth.authenticated()) {
    return router.createUrlTree(
      ['/auth/signin'],
      {
        queryParams: {
          returnUrl: state.url,
        },
      },
    );
  }

  /*
   * Authentifié mais pas ADMIN.
   */
  if (!auth.isAdmin()) {
    return router.parseUrl('/forbidden');
  }

  /*
   * Authentifié + ADMIN.
   */
  return true;
};

