import { Service } from '@angular/core';

import {
  AuthUser,
} from '../models/auth.model';

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};

const AUTH_STORAGE_KEY = 'app.auth.session.v1';

@Service()
export class AuthStorage {
  load(): AuthSession | null {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const raw = window.localStorage.getItem(
        AUTH_STORAGE_KEY,
      );

      if (!raw) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      if (!this.isAuthSession(parsed)) {
        this.clear();
        return null;
      }

      return parsed;
    } catch {
      this.clear();
      return null;
    }
  }

  save(session: AuthSession): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify(session),
      );
    } catch {
      // La session mémoire reste utilisable
      // même si localStorage est indisponible.
    }
  }

  clear(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.removeItem(
        AUTH_STORAGE_KEY,
      );
    } catch {
      // Rien à faire.
    }
  }

  private isAuthSession(value: unknown): value is AuthSession {
    if (
      typeof value !== 'object' ||
      value === null
    ) {
      return false;
    }

    const candidate =
      value as Record<string, unknown>;

    if (
      typeof candidate['accessToken'] !== 'string' ||
      !candidate['accessToken']
    ) {
      return false;
    }

    if (
      typeof candidate['user'] !== 'object' ||
      candidate['user'] === null
    ) {
      return false;
    }

    const user =
      candidate['user'] as Record<string, unknown>;

    return (
      typeof user['id'] === 'number' &&
      typeof user['username'] === 'string' &&
      typeof user['email'] === 'string' &&
      typeof user['role'] === 'string'
    );
  }

}

