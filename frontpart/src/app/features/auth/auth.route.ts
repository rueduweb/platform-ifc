import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Connexion',
    loadComponent: () =>
      import('./components/signin/signin').then((s) => s.Signin)
  },
  {
    path: 'register',
    title: 'Enregistrement',
    loadComponent: () =>
      import('./components/signup/signup').then((s) => s.Signup)
  }
];
