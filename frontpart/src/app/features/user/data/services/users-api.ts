import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CreateUserRequest,
  CurrentUser,
  UpdateCurrentUserRequest,
  UpdateUserRequest,
  UserModel,
} from '../models/user.model';

@Service()
export class UsersApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/users';

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  getUser(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.apiUrl}/me`);
  }

  createUser(request: CreateUserRequest): Observable<UserModel> {
    return this.http.post<UserModel>(
      this.apiUrl,
      request,
    );
  }

  updateCurrentUser(request: UpdateCurrentUserRequest): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.apiUrl}/me`, request);
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<UserModel> {
    return this.http.patch<UserModel>(`${this.apiUrl}/${id}`, request);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
