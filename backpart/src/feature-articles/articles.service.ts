import { Injectable, NotFoundException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { DatabaseService } from 'src/database/database.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    return await this.databaseService.article.create({
      data: createArticleDto,
      include: {
        author: true,
      },
    });
  }

  async findAll(): Promise<Article[]> {
    return await this.databaseService.article.findMany({
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number): Promise<Article | null> {
    const article = await this.databaseService.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.databaseService.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    return await this.databaseService.article.update({
      where: {
        id,
      },
      data: updateArticleDto,
      include: {
        author: true,
      },
    });
  }

  async remove(id: number): Promise<Article> {
    const article = await this.databaseService.article.findUnique({
      where: { id },
    });
    if (!article) {
      throw new NotFoundException('Article not found.');
    }
    return await this.databaseService.article.delete({
      where: { id },
    });
  }
}
