import { Component, computed, inject, OnInit } from '@angular/core';
import { Articles } from '../../data/services/articles';
import { ArticleCard } from '../../ui/article-card/article-card';
import { Router } from '@angular/router';
import { Article } from '../../data/models/article.model';
import { Auth } from '../../../auth/data/services/auth';
@Component({
  selector: 'app-article',
  imports: [ArticleCard],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class ArticleList implements OnInit {
  readonly articlesService = inject(Articles);
  readonly auth = inject(Auth);
  readonly router = inject(Router);

  readonly currentUserId = computed(() => {
    return this.auth.user()?.id ?? null;
  });

  ngOnInit(): void {
    this.articlesService.loadArticles();
  }
  onAdd(): void {
    this.router.navigate(['/article', 'add']);
  }
  onEdit(article: Article): void {
    this.articlesService.selectArticle(article.id);
    this.router.navigate(['/article', article.id, 'edit']);
  }
  onDelete(id: number): void {
    this.articlesService.delete(id);
  }

  canManageArticle(article: Article): boolean {
    const user = this.auth.user();

    if (!user) {
      return false;
    }

    return (
      user.role === 'ADMIN' ||
      article.authorId === user.id
    );
  }


}
