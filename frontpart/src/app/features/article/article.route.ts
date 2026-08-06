import { Routes } from '@angular/router';

export const ARTICLE_ROUTES: Routes = [
  {
    path: '',
    title: 'Articles',
    loadComponent: () =>
      import('./pages/article-list/article').then((m) => m.ArticleList)
  },
  {
    path: 'add',
    title: 'Ajout article',
    loadComponent: () =>
      import('./pages/article-form/article-form').then((m) => m.ArticleForm)
  },
  {
    path: ':id',
    title: 'Article',
    loadComponent: () =>
      import('./pages/article-detail/article-detail').then((m) => m.ArticleDetail)
  },
  {
    path: ':id/edit',
    title: 'Modification',
    loadComponent: () =>
      import('./pages/article-edit/article-edit').then((m) => m.ArticleEdit)
  }
];
