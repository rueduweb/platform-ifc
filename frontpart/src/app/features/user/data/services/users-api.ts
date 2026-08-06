import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Service()
export class UsersApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/users';

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
