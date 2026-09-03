import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AddRegulPieceRequest,
  CreateRegulRequest,
  Regul,
  UpdateRegulRequest,
} from '../models/regul.model';

@Service()
export class RegulApi {
  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/regulations';

  getAll(): Observable<Regul[]> {
    return this.http.get<Regul[]>(this.endpoint);
  }

  getById(id: number): Observable<Regul> {
    return this.http.get<Regul>(`${this.endpoint}/${id}`);
  }

  getByLicence(licence: string): Observable<Regul | null> {
    return this.http.get<Regul | null>(
      `${this.endpoint}/by-licence/${encodeURIComponent(licence)}`,
    );
  }

  create(payload: CreateRegulRequest): Observable<Regul> {
    return this.http.post<Regul>(this.endpoint, payload);
  }

  update(
    id: number,
    payload: UpdateRegulRequest,
  ): Observable<Regul> {
    return this.http.patch<Regul>(
      `${this.endpoint}/${id}`,
      payload,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

  addPiece(
    id: number,
    payload: AddRegulPieceRequest,
  ): Observable<Regul> {
    return this.http.post<Regul>(
      `${this.endpoint}/${id}/pieces`,
      payload,
    );
  }
}

