import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../data/models/article.model';

@Component({
  selector: 'app-article-card',
  imports: [RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {

  readonly article = input.required<Article>();

  readonly editable = input(false);

  readonly edit = output<Article>();

  readonly remove = output<number>();

  readonly firstElement = input(false);

  readonly preview = computed(() => {

    const txt = this.article().content;

    if (txt.length < 160)
      return txt;

    return txt.substring(0, 160) + '...';

  });

  onEdit(event: Event): void {
    event.preventDefault();
    this.edit.emit(this.article());
  }

  onDelete(event: Event): void {
    event.preventDefault();
    this.remove.emit(this.article().id);
  }

}
