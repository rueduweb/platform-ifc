import { Component, effect, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../data/models/article.model';
import { Articles } from '../../data/services/articles';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css',
})
export class ArticleDetail {

  readonly articles = inject(Articles);

  readonly id = input.required<string>();

  readonly editable = input(false);

  readonly edit = output<Article>();

  readonly remove = output<Article>();

  constructor() {

    effect(() => {
      this.articles.selectArticle(+this.id());
    });

  }

}
