import { Forbidden } from './shared/pages/forbidden/forbidden';
import { Routes } from '@angular/router';
import { NotFound } from './shared/pages/not-found/not-found';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  {
    path: 'home',
    title: 'Accueil',
		loadComponent: () =>
		import('./home/home').then((h) => h.Home)
  },
  {
    path: 'auth',
    title: 'Auth',
    loadChildren: () =>
      import('./features/auth/auth.route').then(
        (a) => a.AUTH_ROUTES
      )
  },
  {
    path: 'article',
    loadChildren: () =>
      import('./features/article/article.route').then(
        (m) => m.ARTICLE_ROUTES
      )
  },
  {
    path: 'championship',
		loadChildren: () =>
		import('./features/game/game.route').then(
      (g) => g.GAME_ROUTES
    )
  },
  {
    path: 'team',
		loadChildren: () =>
		import('./features/player/player.route').then(
      (p) => p.PLAYER_ROUTES
    )
  },
  {
    path: 'partner',
    loadChildren: () =>
		import('./features/partner/partner.route').then(
      (p) => p.PARTNER_ROUTES
    )
  },
  {
    path: 'dashboard',
		loadChildren: () =>
		import('./features/dashboard/dashboard.route').then(
      (d) => d.DASHBOARD_ROUTES
    )
  },
  {
    path: 'user',
    loadChildren: () =>
    import('./features/user/user.route').then(
      (u) => u.USER_ROUTES
    )
  },
  {
    path: 'forbidden',
    component: Forbidden
  },
  {
    path: '**',
    component: NotFound
  }

];
