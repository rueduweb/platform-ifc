import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AddRegulPieceRequest,
  CreateRegulRequest,
  Regul,
  UpdateRegulPieceRequest,
  UpdateRegulRequest,
} from '../models/regul.model';

@Service()
export class RegulApi {
  private readonly http = inject(HttpClient);

  private readonly endpoint = 'http://localhost:3000/api/reguls';

  getAll(): Observable<Regul[]> {
    return this.http.get<Regul[]>(this.endpoint);
  }

  getById(id: number): Observable<Regul> {
    return this.http.get<Regul>(`${this.endpoint}/${id}`);
  }

  getByLicense(license: string): Observable<Regul | null> {
    return this.http.get<Regul | null>(
      `${this.endpoint}/by-licence/${encodeURIComponent(license)}`,
    );
  }

  create(payload: CreateRegulRequest): Observable<Regul> {
    return this.http.post<Regul>(this.endpoint, payload);
  }

  update(id: number, payload: UpdateRegulRequest): Observable<Regul> {
    return this.http.patch<Regul>(
      `${this.endpoint}/${id}`,
      payload
    );
  }

  addPiece(
    regulId: number,
    payload: AddRegulPieceRequest,
  ): Observable<Regul> {
    return this.http.post<Regul>(
      `${this.endpoint}/${regulId}/pieces`,
      payload,
    );
  }

  updatePiece(
    regulId: number,
    pieceId: number,
    payload: UpdateRegulPieceRequest,
  ): Observable<Regul> {
    return this.http.patch<Regul>(
      `${this.endpoint}/${regulId}/pieces/${pieceId}`,
      payload,
    );
  }

  delete(regulId: number): Observable<Regul> {
    return this.http.delete<Regul>(`${this.endpoint}/${regulId}`);
  }
}

