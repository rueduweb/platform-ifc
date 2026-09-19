import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import {
  AddPieceRegulDto,
  CreateRegulDto,
  Regul,
  UpdatePieceRegulDto,
  PieceRegul
} from '../models/regul.model';

type PieceRegulApiResponse = Omit<PieceRegul, 'date'> & {
  date: string;
};

type RegulApiResponse = Omit<
  Regul,
  'items' | 'createdAt' | 'updatedAt'
> & {
  items: PieceRegulApiResponse[];
  createdAt: string;
  updatedAt: string;
};

@Service()
export class RegulsApi {
  private readonly http = inject(HttpClient);

  private readonly endpoint = 'http://localhost:3000/api/reguls';

  /**
   * NEW SERVICE APi according new backend API - 17/09/2026
   */
  /**
   * Création d'une régul.
   */
  createRegul(dto: CreateRegulDto): Observable<Regul> {
    return this.http
      .post<RegulApiResponse>(this.endpoint, dto)
      .pipe(map((regul) => this.mapRegul(regul)));
  }

  /**
   * Récupération de toutes les réguls.
   */
  getReguls(): Observable<Regul[]> {
    return this.http
      .get<RegulApiResponse[]>(this.endpoint)
      .pipe(
        map((reguls) => reguls.map((regul) => this.mapRegul(regul))),
      );
  }


  /**
   * Récupération d'une régul par son identifiant.
   */
  getRegul(id: number): Observable<Regul> {
    return this.http
      .get<RegulApiResponse>(`${this.endpoint}/${id}`)
      .pipe(map((regul) => this.mapRegul(regul)));
  }

  /**
   * Ajout d'une pièce à une régul.
   */
  addPieceRegul(regulId: number, dto: AddPieceRegulDto): Observable<Regul> {
    return this.http
      .post<RegulApiResponse>(
        `${this.endpoint}/${regulId}/pieces`,
        dto,
      )
      .pipe(
        map((regul) => this.mapRegul(regul)),
      );
  }


  /**
   * Modification d'une pièce d'une régul.
   */
  updatePieceRegul(regulId: number,pieceId: number, dto: UpdatePieceRegulDto):  Observable<Regul> {
    return this.http
      .patch<RegulApiResponse>(
        `${this.endpoint}/${regulId}/pieces/${pieceId}`,
        dto,
      )
      .pipe(
        map((regul) => this.mapRegul(regul)),
      );
  }


  /**
   * Suppression d'une pièce d'une régul.
   */
  deletePieceRegul(regulId: number, pieceId: number): Observable<Regul> {
    return this.http.delete<RegulApiResponse>(
      `${this.endpoint}/${regulId}/pieces/${pieceId}`,
    ).pipe(map((regul) => this.mapRegul(regul)));
  }

  /**
   * fonctions de mapping
   */
  private mapRegul(regul: RegulApiResponse): Regul {
    return {
      ...regul,
      items: regul.items.map((piece) => this.mapPieceRegul(piece)),
      createdAt: new Date(regul.createdAt),
      updatedAt: new Date(regul.updatedAt)
    };
  }

  private mapPieceRegul(piece: PieceRegulApiResponse): PieceRegul {
    return {
      ...piece,
      date: new Date(piece.date)
    };
  }
}
