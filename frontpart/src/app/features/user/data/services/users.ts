import {
  Service,
  computed,
  inject,
  signal,
} from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

import {
  CreateUserRequest,
  CurrentUser,
  UpdateCurrentUserRequest,
  UpdateUserRequest,
  UserModel,
  UsersState,
} from '../models/user.model';

import { UsersApi } from '../services/users-api';

@Service()
export class Users {
  private readonly usersApi = inject(UsersApi);

  private readonly state = signal<UsersState>({
    users: [],
    currentUser: null,
    loading: false,
    error: null
  });

  readonly users = computed(() => this.state().users);
  readonly currentUser = computed(() => this.state().currentUser);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);

  async loadUsers(): Promise<void> {
    const users = await this.request(this.usersApi.getUsers());

    if (!users) {
      return;
    }

    this.patchState({ users });
  }

  async getUser(id: number): Promise<UserModel | null> {
    return this.request(this.usersApi.getUser(id));
  }

  async createUser(request: CreateUserRequest): Promise<UserModel | null> {
    const createdUser = await this.request(this.usersApi.createUser(request));

    if (!createdUser) {
      return null;
    }

    this.updateUsers(users => [...users, createdUser]);

    return createdUser;
  }

  async updateUser(id: number, request: UpdateUserRequest): Promise<UserModel | null> {
    const updatedUser = await this.request(this.usersApi.updateUser(id, request));

    if (!updatedUser) {
      return null;
    }

    this.replaceUser(updatedUser);

    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deleted = await this.request(this.usersApi.deleteUser(id));

    if (deleted === null) {
      return false;
    }

    this.updateUsers(users => users.filter(user => user.id !== id));

    return true;
  }

  // Methodes sur current user
  async loadCurrentUser(): Promise<void> {
    const currentUser = await this.request(this.usersApi.getCurrentUser());

    if (!currentUser) {
      return;
    }

    this.patchState({ currentUser });
  }

  async updateCurrentUser(request: UpdateCurrentUserRequest): Promise<CurrentUser | null> {
    const currentUser = await this.request(this.usersApi.updateCurrentUser(request));

    if (!currentUser) {
      return null;
    }

    this.patchState({
      currentUser,
    });

    return currentUser;
  }

  // HELPERS ============================

  private replaceUser(user: UserModel): void {
    this.updateUsers(users =>
      users.map(current => current.id === user.id ? user : current)
    );
  }

  private updateUsers(updater: (users: UserModel[]) => UserModel[]): void {
    this.state.update(state => ({
      ...state,
      users: updater(state.users)
    }));
  }

  private patchState(patch: Partial<UsersState>): void {
    this.state.update(state => ({
      ...state,
      ...patch
    }));
  }

  // HTTP REQUEST HELPER ================

  private async request<T>(request$: Observable<T>): Promise<T | null> {
    this.patchState({
      loading: true,
      error: null
    });

    try {
      return await firstValueFrom(request$);
    } catch (error) {
      this.patchState({error: this.getErrorMessage(error)});

      return null;
    } finally {
      this.patchState({
        loading: false,
      });
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Une erreur est survenue.';
  }
}
