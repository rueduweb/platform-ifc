import { Article } from "../../../article/data/models/article.model";

export type User = {
	id: number;
	username: string;
	password: string;
	email: string;
	role: string;
	articles: Article[] | null;
};
