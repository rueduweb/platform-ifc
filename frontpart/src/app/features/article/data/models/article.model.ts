import { min, required, schema } from '@angular/forms/signals';
export type Article = {
  id: number;
  title: string;
  description: string;
  content: string;
  authorId: number;
}

export type ArticlesState = {
  articles: Article[];
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}

export type AddArticleItem = Omit<Article, 'id'>;

export const prepareEmptyArticle = (): AddArticleItem => ({
  title: '',
  description: '',
  content: '',
  authorId: 0
})

export const articleSchema = schema<AddArticleItem>(schema => {
  required(schema.title, { message: 'Le titre est obligatoire.'});
  required(schema.description, { message: 'La description est obligatoire.'});
  required(schema.content, { message: 'Le contenu est obligatoire.'});
  required(schema.authorId, { message: 'Veuillez choisir un auteur.'});
  min(schema.authorId, 1, { message: 'L\'id doit être supérieur à 0.'});
})
