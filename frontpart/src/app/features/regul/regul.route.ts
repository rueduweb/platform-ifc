import { Routes } from '@angular/router';
;
export const REGUL_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestion Licences',
    loadComponent: () =>
      import('./pages/regul-list/regul-list').then((r) => r.RegulList)
  },
  {
    path: 'regul',
    title: 'Régularisation',
    loadComponent: () =>
      import('./pages/regul-form/regul-form').then((r) => r.RegulForm)
  }
];
