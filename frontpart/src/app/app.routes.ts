import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home'},
  {
    path: 'home',
    title: 'Accueil',
		loadComponent: () =>
		import('./home/home').then((h) => h.Home)
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
    title: 'Equipe',
		loadComponent: () =>
		import('./features/team/team').then((t) => t.Team)
  },
  {
    path: 'partner',
    title: 'Partenariat',
		loadComponent: () =>
		import('./features/partner/partner').then((p) => p.Partner)
  },
  {
    path: 'dashboard',
    title: 'Tableau de bord',
		loadComponent: () =>
		import('./features/dashboard/dashboard').then((d) => d.Dashboard)
  }

];
