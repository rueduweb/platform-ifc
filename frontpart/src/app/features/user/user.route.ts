
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    title: 'Liste des utilisateurs',
    loadComponent: () =>
      import('./pages/user-list/user').then((u) => u.User)
  }
];
