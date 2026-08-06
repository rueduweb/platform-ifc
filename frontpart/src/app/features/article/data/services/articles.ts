import { computed, inject, Service, signal } from '@angular/core';
import { ArticlesApi } from './articles-api';
import { Article, ArticlesState } from '../models/article.model';
import { Observable } from 'rxjs';

@Service()
export class Articles {
  private readonly api = inject(ArticlesApi);

  private readonly state = signal<ArticlesState>({ // the state stays in the signal
    articles: [],
    selectedId: null,
    loading: false,
    error: null
  });

  // Selectors
  readonly articles = computed(() => this.state().articles);

  readonly loading = computed(() => this.state().loading);

  readonly selectedArticle = computed(() => {

    const { articles, selectedId } = this.state();

    return articles.find(a => a.id === selectedId) ?? null;

  });

  readonly error = computed(() => this.state().error);

  readonly count = computed(() => this.articles().length);

  readonly sortedArticles = computed(() =>
    [...this.articles()]
        .sort((a,b)=>a.title.localeCompare(b.title))
  );

  // Actions

  loadArticles(): void {
    this.handleRequest(
      this.api.getAll(),
      articles => ({ articles })
    );
  }

  loadOne(id: number): void {
    this.handleRequest(
      this.api.getOneById(id),
      (article, state) => {

        const exists = state.articles.some(a => a.id === article.id);

        return {
          articles: exists
            ? state.articles.map(a =>
                a.id === article.id ? article : a
              )
            : [...state.articles, article],
          selectedId: article.id
        };

      }
    );
  }

  create(article: Omit<Article, 'id'>): void {
    this.handleRequest(
      this.api.create(article),
      (article, state) => ({
        articles: [...state.articles, article],
        selectedId: article.id,
      })
    );
  }

  update(article: Article): void {
    this.handleRequest(
      this.api.update(article),
      (article, state) => ({
        articles: state.articles.map(a => a.id === article.id ? article : a)
      })
    );
  }

  delete(id: number): void {
    this.handleRequest(
      this.api.delete(id),
      (_, state) => ({
        articles: state.articles.filter(a => a.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      })
    );
  }

  selectArticle(id: number): void {
    this.patchState({
      selectedId: id
    });

    if(this.selectedArticle()) { return; }

    this.loadOne(id);
  }

  clearSelection(): void {
    this.patchState({
      selectedId: null
    });
  }
  // function handle request
  private handleRequest<T>(
    request$: Observable<T>,
    onSuccess: (
      value: T,
      state: ArticlesState
    ) => Partial<ArticlesState>
  ): void {

    this.startLoading();

    request$.subscribe({
      next: value => {
        this.patchState(state => ({
          ...onSuccess(value, state),
          loading: false
        }));
      },
      error: () => this.setError('Erreur serveur')
    });

  }
  // function to simulate the patchState() of @ngrx/signals
  private patchState(
    patch:
      | Partial<ArticlesState>
      | ((state: ArticlesState) => Partial<ArticlesState>)
  ) {
    this.state.update(state => ({
      ...state,
      ...(typeof patch === 'function' ? patch(state) : patch)
    }));
  }
  // Helpers
  private startLoading() {
    this.patchState({
      loading: true,
      error: null
    });
  }

  private setError(message: string) {
    this.patchState({
      loading: false,
      error: message
    });
  }

}
