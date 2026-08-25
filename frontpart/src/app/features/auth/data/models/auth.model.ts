import { UserRole } from '../../../user/data/models/user.model';

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
};

export type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

export type SigninRequest = {
  email: string;
  password: string;
};

export type SignupResponse = {
  user: {
    id: number;
    username: string;
    email: string;
  };
  access_token: string;
};

export type SigninResponse = {
  user: AuthUser;
  access_token: string;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
};

/* Signal Form Auth */
export type SignupFormModel = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SigninFormModel = {
  email: string;
  password: string;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};

