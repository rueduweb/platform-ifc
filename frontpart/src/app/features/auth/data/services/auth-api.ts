import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  SigninRequest,
  SigninResponse,
  SignupRequest,
  SignupResponse,
} from '../models/auth.model';

@Service()
export class AuthApi {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.API_BASE_URL}/auth`;

  signup(request: SignupRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, request);
  }

  signin(request: SigninRequest): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(`${this.apiUrl}/signin`, request);
  }
}
