import { Routes } from '@angular/router';

export const GAME_ROUTES: Routes = [
  {
    path: '',
    title: 'Liste des matchs',
    loadComponent: () =>
      import('./pages/game-list/game').then((g) => g.Game)
  },
  {
    path: 'game-add',
    title: 'Ajout match',
    loadComponent: () =>
      import('./pages/game-form/game-form').then((m) => m.GameForm)
  },
  {
    path: 'game/:id/edit',
    title: 'Edition match',
    loadComponent: () =>
      import('./pages/game-form/game-form').then((m) => m.GameForm)
  }
];
