import { Article } from "../../../article/data/models/article.model";

export type UserRole = 'USER' | 'ADMIN';

export type UserModel = {
	id: number;
	username: string;
	email: string;
	role: UserRole;
	articles: Article[] | null;
  createdDate: string | null;
  updatedDate: string | null;
};

export type CurrentUser = {
  id: number;
  username: string;
  email: string;
  articles: Article[] | null;
  role?: UserRole;
};

// Création d'un utilisateur
export type CreateUserRequest = {
  username: string;
  password: string;
  email: string;
  role: UserRole;
};
// Modification utilisateur
export type UpdateCurrentUserRequest = {
  username?: string;
  email?: string;
  password?: string;
};
// Modification utilisateur par ADMIN
export type UpdateUserRequest = {
  username?: string;
  email?: string;
  password?: string;
  role?: UserRole;
};

// State pour le store
export type UsersState = {
  users: UserModel[];
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
};
