import { Routes } from '@angular/router';

export const PLAYER_ROUTES: Routes = [
  {
    path: '',
    title: 'Equipe',
    loadComponent: () =>
      import('./pages/team/team').then((t) => t.Team)
  },
  {
    path: 'player-add',
    title: 'Ajout Joueur',
    loadComponent: () =>
      import('./pages/player-form/player-form').then((p) => p.PlayerForm)
  },
  {
    path: 'player-edit/:id',
    title: 'Edition Joueur',
    loadComponent: () =>
      import('./pages/player-form/player-form').then((p) => p.PlayerForm)
  }
];
