import { Routes } from '@angular/router';
;
export const REGUL_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestion Licences',
    loadComponent: () =>
      import('./pages/regul-list/regul-list').then((r) => r.RegulList)
  }
];
