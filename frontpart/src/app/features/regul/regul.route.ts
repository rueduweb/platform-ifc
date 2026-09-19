import { Routes } from '@angular/router';
;
export const REGUL_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestion Licences',
    loadComponent: () =>
      import('./pages/reguls/reguls').then((r) => r.Reguls)
  },
  {
    path: 'regul',
    title: 'Régularisation',
    loadComponent: () =>
      import('./pages/regul-form/regul-form').then((r) => r.RegulForm)
  },
  {
    path: 'regul/:id/edit',
    title: 'Modifier Régularisation',
    loadComponent: () =>
      import('./pages/regul-form/regul-form').then((r) => r.RegulForm)
  }
];
