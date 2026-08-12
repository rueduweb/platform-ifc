import { Routes } from '@angular/router';

export const PLAYER_ROUTES: Routes = [
  {
    path: '',
    title: 'Equipe',
    loadComponent: () =>
      import('./pages/team/team').then((t) => t.Team)
  }
];
