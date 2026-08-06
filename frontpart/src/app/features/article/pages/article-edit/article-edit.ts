import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { articleSchema, prepareEmptyArticle } from '../../data/models/article.model';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { UsersApi } from '../../../user/data/services/users-api';
import { Articles } from '../../data/services/articles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-edit',
  imports: [FormField, FormRoot],
  templateUrl: './article-edit.html',
  styleUrl: './article-edit.css',
})
export class ArticleEdit {
  private readonly usersService = inject(UsersApi);
  private readonly articles = inject(Articles);
  private readonly router = inject(Router);

  readonly article = signal(prepareEmptyArticle());

  protected readonly articleEditForm = form(this.article, articleSchema);

  protected readonly users = toSignal(
    this.usersService.getAll(), { initialValue: [] }
  );

  protected changeAuthor(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);

    this.article.update(article => ({
      ...article,
      authorId: value
    }));
  }

  constructor() {
    effect(() => {

      const selected = this.articles.selectedArticle();
      if (!selected) {
        this.article.set(prepareEmptyArticle());
        return;
      }

      this.article.set({
        title: selected.title,
        description: selected.description,
        content: selected.content,
        authorId: selected.authorId
      });
    });
  }

  onSubmit(): void {
    this.articleEditForm().markAsTouched();

    if(!this.articleEditForm().valid()) {
      return;
    }

    const selected = this.articles.selectedArticle();

    if (selected) {
      this.articles.update({id: selected.id, ...this.article()});
      this.articles.clearSelection();
      this.articleEditForm().reset();
      this.router.navigate(['/article']);
    }
  }

  onCancel(): void {
    this.article.set(prepareEmptyArticle());
    this.router.navigate(['/article']);
  }
}
