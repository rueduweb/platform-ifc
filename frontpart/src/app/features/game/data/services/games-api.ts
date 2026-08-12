import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { GameDto } from '../models/game-dto';
import { Game } from '../models/game.model';

export type CreateGame = Omit<Game, 'id'>;
export type UpdateGame = Partial<CreateGame>;

@Injectable({
  providedIn: 'root',
})
export class GamesApi {

  private readonly http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/api/games';

  getAll(): Observable<Game[]> {
    return this.http.get<GameDto[]>(this.API_URL)
    .pipe(
      map((games) =>
        games.map((game) => this.toGame(game))
      ),
    );
  }

  getById(id: number): Observable<Game> {
    return this.http.get<GameDto>(`${this.API_URL}/${id}`)
    .pipe(
      map((game) => this.toGame(game)),
    );
  }

  create(game: CreateGame): Observable<Game> {
    return this.http.post<GameDto>(this.API_URL, game)
    .pipe(
      map((game) => this.toGame(game)),
    );
  }

  update(id: number, game: UpdateGame): Observable<Game> {
    return this.http.patch<GameDto>(`${this.API_URL}/${id}`, game)
    .pipe(
      map((game) => this.toGame(game)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  private toGame(game: GameDto): Game {
    return {
      ...game,
      date: new Date(game.date),
    };
  }
}
