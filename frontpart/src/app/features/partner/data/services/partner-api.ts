import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

import type { Partner } from '../models/partner.model';
import type { CreatePartnerDto, UpdatePartnerDto } from '../models/partner-dto.model';

const URL_API = 'http://localhost:3000/api/partners';

@Service()
export class PartnersApi {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Partner[]> {
    return this.http.get<Partner[]>(URL_API);
  }

  getById(id: number): Observable<Partner> {
    return this.http.get<Partner>(`${URL_API}/${id}`);
  }

  create(dto: CreatePartnerDto): Observable<Partner> {
    return this.http.post<Partner>(URL_API, dto);
  }

  update(id: number, dto: UpdatePartnerDto,): Observable<Partner> {
    return this.http.patch<Partner>(`${URL_API}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${URL_API}/${id}`);
  }
}

