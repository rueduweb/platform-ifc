import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';

import { articleSchema, prepareEmptyArticle } from '../../data/models/article.model';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { UsersApi } from '../../../user/data/services/users-api';
import { Articles } from '../../data/services/articles';
import { Router } from '@angular/router';

import { CurrentUser, UserModel } from '../../../user/data/models/user.model';

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

  protected readonly currentUser = signal<CurrentUser | null>(null);

  protected readonly users = signal<UserModel[]>([]);

  readonly isAdmin = computed(
    () => this.currentUser()?.role === 'ADMIN'
  );

  protected changeAuthor(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);

    this.article.update(article => ({
      ...article,
      authorId: value
    }));
  }

  constructor() { // à ajouter parce que authorId est obligatoire.
    effect(() => {
      const user = this.currentUser();

      if (user && !this.isAdmin()) {
        this.article.update(article => ({
          ...article,
          authorId: user.id,
        }));
      }
    });
  }

  ngOnInit(): void {
    this.articles.clearSelection();

    this.usersService.getCurrentUser().subscribe({
      next: user => {
        this.currentUser.set(user);

        if (user.role === 'ADMIN') {
          this.usersService.getUsers().subscribe({
            next: users => {
              this.users.set(users);
            }
          });
        } else {
          this.users.set([{
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            articles: user.articles,
            createdAt: null,
            updatedAt: null
          }]);

          this.article.update(article => ({
            ...article,
            authorId: user.id
          }));
        }
      }
    });
  }


  onSubmit(): void {
    this.articleForm().markAsTouched();

    if (!this.articleForm().valid()) {
      return;
    }

    if (this.articleForm().dirty()) {
      this.articles.clearSelection();
    }

    this.articles.create(
      this.article(),
      () => {
        this.resetArticle();
      }
    );
  }

  onCancel(): void {
    this.resetArticle();
    this.router.navigate(['/article']);
  }

  private resetArticle(): void {
    const currentUser = this.currentUser();

    this.article.set({
      ...prepareEmptyArticle(),
      authorId: currentUser?.role === 'USER' ? currentUser.id : 0
    });

    this.articleForm().reset();
  }

}
