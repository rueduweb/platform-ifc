import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Player } from '../models/player.model';
import { map, Observable } from 'rxjs';

@Service()
export class PlayersApi {

  private readonly http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/api/players';

  getPlayers(): Observable<Player[]> {
    return this.http
      .get<Player[]>(this.API_URL)
      .pipe(
        map(players => players.map(player => this.mapPlayer(player)))
      );
  }


  getPlayer(id: number): Observable<Player> {
    return this.http
      .get<Player>(`${this.API_URL}/${id}`)
      .pipe(
        map(player => this.mapPlayer(player))
      );
  }

  createPlayer(player: Omit<Player, 'id'>): Observable<Player> {
    return this.http
      .post<Player>(this.API_URL, player)
      .pipe(
        map(player => this.mapPlayer(player))
      );
  }


  updatePlayer(id: number, changes: Partial<Omit<Player, 'id'>>): Observable<Player> {
    return this.http
      .patch<Player>(`${this.API_URL}/${id}`, changes)
      .pipe(
        map(player => this.mapPlayer(player))
      );
  }

  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }


  private mapPlayer(player: Player): Player {
    return {
      ...player,
      dob: new Date(player.dob)
    };
  }

}
