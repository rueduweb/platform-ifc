import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { Player } from '../../data/models/player.model';

/*
  Rôle de l'utilisateur actuellement connecté.

  VISITOR : consultation uniquement

  USER : consultation + modification/suppression

  ADMIN : consultation + modification/suppression
 */
export type PlayerCardRole =
  | 'ADMIN'
  | 'USER'
  | 'VISITOR';

@Component({
  selector: 'app-player-card',
  imports: [],
  templateUrl: './player-card.html',
  styleUrl: './player-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerCard {

  // Joueur affiché dans la carte.
  readonly player = input.required<Player>();

  /*
    Rôle de l'utilisateur connecté.
    Par défaut :
    VISITOR => aucun bouton Edit/Delete.
   */
  readonly role = input<PlayerCardRole>('ADMIN');

  /*
   Demande de modification du joueur.
   */
  readonly edit = output<Player>();

  /*
   Demande de suppression du joueur.
   */
  readonly delete = output<Player>();

  /*
    Détermine si les boutons Edit/Delete doivent être affichés.

   IMPORTANT :
   cette méthode contrôle uniquement l'interface.
   L'autorisation réelle doit être vérifiée côté backend.
   */
  protected canManage(): boolean {

    const role = this.role();

    return role === 'ADMIN'
      || role === 'USER';
  }

  /*
   Construit le chemin de la photo à partir de l'ID du joueur.

   Exemple :
   player.id = 12
   => assets/images/j12.jpg
   */
  protected playerImage(): string {

    return `assets/images/j${this.player().id}.jpg`;
  }

  /*
   Demande d'édition.
   */
  protected onEdit(): void {

    if (!this.canManage()) {
      return;
    }

    this.edit.emit(this.player());
  }


  /*
   Demande de suppression.
   */
  protected onDelete(): void {

    if (!this.canManage()) {
      return;
    }

    this.delete.emit(this.player());
  }
}
