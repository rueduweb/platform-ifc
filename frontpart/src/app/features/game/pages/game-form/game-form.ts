import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { FormField, FormRoot, form, submit } from '@angular/forms/signals';

import { Games } from '../../data/services/games';
import { CreateGame } from '../../data/services/games-api';

import { ActivatedRoute, Router } from '@angular/router';

import {
  GameFormModel,
  gameSchema,
  prepareEmptyGame
} from '../../data/models/game.model';

@Component({
  selector: 'app-game-form',
  imports: [FormField,FormRoot,],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameForm implements OnInit{

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly gamesStore = inject(Games);

  // MODE
  private readonly gameId = signal<number | null>(null);
  protected readonly isEditMode = signal(false);

  // Modèle de données manipulé par le formulaire.
  protected readonly gameModel = signal<GameFormModel>(prepareEmptyGame());

  // Formulaire Signal Forms.
  protected readonly gameForm = form(this.gameModel, gameSchema);

  // STATE
  protected readonly saving = signal(false);


  // SELECT OPTIONS
  protected readonly locations = [
    'Stade Léon Biancotto',
    'Complexe Lenglen'
  ];

  protected readonly gameDays = [
    'J01','J02','J03','J04','J05','J06',
    'J07','J08','J09','J10','J11','J12',
    'J13','J14','J15','J16','J17','J18',
    'J19','J20','J21','J22','J23','J24',
    'J25','J26'
  ];

  // INIT
  async ngOnInit(): Promise<void> {

    const idParam = this.route.snapshot.paramMap.get('id');

    // CREATION
    if (!idParam) {

      this.isEditMode.set(false);

      this.gameId.set(null);

      this.gameModel.set(
        prepareEmptyGame()
      );

      return;
    }
    // MODIFICATION
    const id = Number(idParam);

    if (!Number.isInteger(id) || id <= 0) {

      console.error(
        'ID de game invalide :',
        idParam,
      );

      await this.router.navigate([
        '/championship',
      ]);

      return;
    }

    this.isEditMode.set(true);

    this.gameId.set(id);

    await this.loadGame(id);

  }
  // LOAD GAME
  private async loadGame(id: number): Promise<void> {
    this.saving.set(true);

    try {

      const game = await this.gamesStore.getGame(id);

      // Conversion modèle métier vers modèle du form
      const formModel: GameFormModel = {

        location: game.location,

        date: this.formatDateForForm(
          game.date,
        ),

        gameNum: game.gameNum,

        homeTeam: game.homeTeam,

        awayTeam: game.awayTeam,

        nbGoalHome: game.nbGoalHome,

        nbGoalAway: game.nbGoalAway,

        note: game.note,

        forfeit: game.forfeit
      }
      // REMPLISSAGE DU FORM
      this.gameModel.set(formModel);

    } catch(error) {

      console.error(
        'Impossible de charger le match :',
        error,
      );

      await this.router.navigate([
        '/championship',
      ]);

    } finally {
      this.saving.set(false);
    }

  }
  // Convertir la date métier en valeur compatible
  // avec <input type="datetime-local"/>
  // 2026-08-12T20:30:00 => 2026-08-12T20:30
  private formatDateForForm(date: Date | string,): string {

    const value = date instanceof Date ? date : new Date(date);

    if (Number.isNaN(value.getTime())) {
      return '';
    }

    const year = value.getFullYear();

    const month = String(value.getMonth() + 1).padStart(2, '0');

    const day = String(value.getDate()).padStart(2, '0');

    const hours = String(value.getHours()).padStart(2, '0');

    const minutes =String(value.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;

  }

  // SUBMIT
  protected async onSubmit(): Promise<void> {

    await submit(
      this.gameForm,

      async () => {

        this.saving.set(true);

        try {

          const formValue = this.gameModel();


          // -------------------------------------------------------------------
          // DONNEES COMMUNES CREATION / MODIFICATION
          // -------------------------------------------------------------------

          const game: CreateGame = {
            location: formValue.location,

            date: new Date(formValue.date),

            gameNum: formValue.gameNum,

            homeTeam: formValue.homeTeam,

            awayTeam: formValue.awayTeam,

            nbGoalHome: formValue.nbGoalHome,

            nbGoalAway: formValue.nbGoalAway,

            note: formValue.note,

            forfeit: formValue.forfeit,
          };

          // CAS DE MODIFICATION
          if (this.isEditMode()) {

            const id = this.gameId();


            if (id === null) {

              console.error('Impossible de modifier le match : ID absent.');

              return;
            }

            console.log('Match à modifier :', id, game);

            await this.gamesStore.updateGame(id, game);

          } else { // CAS DE CREATION

            console.log('Match à créer :', game);

            await this.gamesStore.createGame(game);

          }

          // RETOUR à la liste
          await this.router.navigate(['/championship']);

        } finally {

          this.saving.set(false);

        }
      },
    );
  }

  // CANCEL
  protected cancel(): void {
    void this.router.navigate(['/championship']);
  }

  // RESET
  protected reset(): void {

    this.gameModel.set(prepareEmptyGame());
  }
}
