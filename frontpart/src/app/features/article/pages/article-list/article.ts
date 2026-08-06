import { Component, inject, OnInit } from '@angular/core';
import { Articles } from '../../data/services/articles';
import { ArticleCard } from '../../ui/article-card/article-card';
import { Router } from '@angular/router';
import { Article } from '../../data/models/article.model';
@Component({
  selector: 'app-article',
  imports: [ArticleCard],
  templateUrl: './article.html',
  styleUrl: './article.css',
})
export class ArticleList implements OnInit {
  readonly articlesService = inject(Articles);
  readonly router = inject(Router);

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

}
