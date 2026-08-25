import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (_route, state ) => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.authenticated()) {
    return true;
  }

  return router.createUrlTree(
    ['/auth/signin'],
    {
      queryParams: {
        returnUrl: state.url,
      },
    },
  );
};

