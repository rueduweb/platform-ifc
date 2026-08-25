import {
  Service,
  computed,
  inject,
  signal,
} from '@angular/core';

import {
  HttpErrorResponse,
} from '@angular/common/http';

import {
  firstValueFrom,
  Observable,
} from 'rxjs';

import {
  AuthState,
  AuthUser,
  SigninRequest,
  SignupRequest,
} from '../models/auth.model';

import { AuthApi } from '../services/auth-api';
import { AuthStorage } from '../services/auth-storage';

/**
 * Type pour les réponses d'erreur backend
 */
type ApiErrorBody = {
  message?: string | string[];
  error?: string;
};

@Service()
export class Auth {
  private readonly authApi = inject(AuthApi);
  private readonly authStorage = inject(AuthStorage);

  private readonly state =
    signal<AuthState>(this.restoreState());

  readonly user = computed(
    () => this.state().user,
  );

  readonly accessToken = computed(
    () => this.state().accessToken,
  );

  readonly loading = computed(
    () => this.state().loading,
  );

  readonly error = computed(
    () => this.state().error,
  );

  readonly authenticated = computed(
    () => this.state().accessToken !== null,
  );

  readonly isAdmin = computed(
    () => this.state().user?.role === 'ADMIN',
  );

  async signup(
    request: SignupRequest,
  ): Promise<boolean> {
    const response = await this.request(
      this.authApi.signup(request),
    );

    if (!response) {
      return false;
    }

    const user: AuthUser = {
      ...response.user,
      role: 'USER',
    };

    this.setAuthentication(
      user,
      response.access_token,
    );

    return true;
  }

  async signin(
    request: SigninRequest,
  ): Promise<boolean> {
    const response = await this.request(
      this.authApi.signin(request),
    );

    if (!response) {
      return false;
    }

    this.setAuthentication(
      response.user,
      response.access_token,
    );

    return true;
  }

  logout(): void {
    this.authStorage.clear();

    this.state.set({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
    });
  }

  clearError(): void {
    this.state.update(state => ({
      ...state,
      error: null,
    }));
  }

  private setAuthentication(
    user: AuthUser,
    accessToken: string,
  ): void {
    this.authStorage.save({
      user,
      accessToken,
    });

    this.state.set({
      user,
      accessToken,
      loading: false,
      error: null,
    });
  }

  private restoreState(): AuthState {
    const session = this.authStorage.load();

    return {
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      loading: false,
      error: null,
    };
  }

  private async request<T>(
    request$: Observable<T>,
  ): Promise<T | null> {
    this.state.update(state => ({
      ...state,
      loading: true,
      error: null,
    }));

    try {
      return await firstValueFrom(request$);
    } catch (error) {
      this.state.update(state => ({
        ...state,
        error: this.getErrorMessage(error),
      }));

      return null;
    } finally {
      this.state.update(state => ({
        ...state,
        loading: false,
      }));
    }
  }

  private getErrorMessage(error: unknown): string {

    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorBody;

      if (typeof body.message === 'string') {
        return body.message;
      }

      if (Array.isArray(body.message)) {
        return body.message.join(' ');
      }

      if (typeof body.error === 'string') {
        return body.error;
      }

      if (error.status === 401) {
        return 'Email ou mot de passe incorrect.';
      }

      if (error.status === 409) {
        return 'Ce compte existe déjà.';
      }

      if (error.status === 0) {
        return 'Le serveur est inaccessible.';
      }

      return `Erreur serveur (${error.status}).`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Une erreur est survenue.';
  }

}
