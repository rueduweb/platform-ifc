import { Routes } from '@angular/router';
import { adminGuard } from '../auth/data/guards/admin-guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Tableau de bord',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard').then((g) => g.Dashboard)
  },
];
