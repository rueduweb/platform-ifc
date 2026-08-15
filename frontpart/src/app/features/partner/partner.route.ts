import { Routes } from '@angular/router';

export const PARTNER_ROUTES: Routes = [
  {
    path: '',
    title: 'Liste des partenaires',
    loadComponent: () =>
      import('./pages/partner-list/partner').then((p) => p.PartnerList)
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/partner-form/partner-form').then(p => p.PartnerForm)
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./pages/partner-form/partner-form').then(p => p.PartnerForm)
  }
];
