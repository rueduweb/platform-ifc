import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { articleSchema, prepareEmptyArticle } from '../../data/models/article.model';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { UsersApi } from '../../../user/data/services/users-api';
import { Articles } from '../../data/services/articles';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-form',
  imports: [FormField, FormRoot],
  templateUrl: './article-form.html',
  styleUrl: './article-form.css',
})
export class ArticleForm implements OnInit {
  private readonly usersService = inject(UsersApi);
  private readonly articles = inject(Articles);
  private readonly router = inject(Router);

  readonly editing = computed(() => this.articles.selectedArticle() !== null);

  readonly article = signal(prepareEmptyArticle());

  protected readonly articleForm = form(this.article, articleSchema);

  protected readonly users = toSignal(
    this.usersService.getUsers(), { initialValue: [] }
  );

  protected changeAuthor(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);

    this.article.update(article => ({
      ...article,
      authorId: value
    }));
  }

  ngOnInit(): void {
    this.articles.clearSelection();
  }

  onSubmit(): void {

    this.articleForm().markAsTouched();

    if (!this.articleForm().valid()) {
      return;
    }

    if(this.articleForm().dirty()) {
      this.articles.clearSelection();
    }

    this.articles.create(this.article());
    this.article.set(prepareEmptyArticle());
    this.articleForm().reset();

  }

  onCancel(): void {
    this.article.set(prepareEmptyArticle());
    this.router.navigate(['/article']);
  }

}
