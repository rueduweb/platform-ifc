import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import {
  FormField,
  FormRoot,
  form,
  submit,
} from '@angular/forms/signals';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  Player,
  PlayerFormModel,
  playerSchema,
  prepareEmptyPlayer,
} from '../../data/models/player.model';

import { Players } from '../../data/services/players';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    FormField,
    FormRoot,
  ],
  templateUrl: './player-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerForm implements OnInit {

  // ===========================================================================
  // DEPENDENCIES
  // ===========================================================================

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly playersStore = inject(Players);

  private readonly destroyRef = inject(DestroyRef);

  // ===========================================================================
  // STATE
  // ===========================================================================

  /**
   * ID du joueur en cours de modification.
   *
   * null => création
   */
  private readonly playerId = signal<number | null>(null);

  /**
   * true  => modification
   * false => création
   */
  readonly isEdit = signal(false);

  /**
   * true pendant la sauvegarde.
   */
  readonly saving = signal(false);

  /**
   * Modèle du formulaire.
   *
   * dob est une string YYYY-MM-DD car <input type="date">
   * manipule une chaîne.
   */
  readonly playerModel = signal<PlayerFormModel>(prepareEmptyPlayer());

  // ===========================================================================
  // OPTIONS
  // ===========================================================================
  readonly positions = signal<string[]>([
    'Gardien','Arrière','Latéral','Milieu','Ailier','Attaquant'
  ]);

  // ===========================================================================
  // FORM
  // ===========================================================================

  readonly playerForm = form(this.playerModel, playerSchema);

  // ===========================================================================
  // ON INIT
  // ===========================================================================

  ngOnInit(): void {
     this.initialize();
  }

  // ===========================================================================
  // INITIALIZATION
  // ===========================================================================

  private async initialize(): Promise<void> {

    const idParam = this.route.snapshot.paramMap.get('id');


    // CREATION

    if (!idParam) {

      this.playerId.set(null);

      this.isEdit.set(false);

      this.playerModel.set(
        prepareEmptyPlayer(),
      );

      return;
    }

    // VALIDATION DE L'ID

    const id = Number(idParam);

    if (!Number.isSafeInteger(id) || id <= 0) {

      console.error(
        'ID joueur invalide :',
        idParam,
      );

      await this.router.navigate(['/team']);

      return;
    }


    // MODIFICATION

    this.playerId.set(id);

    this.isEdit.set(true);

    await this.loadPlayer(id);
  }


  // LOAD PLAYER

  private async loadPlayer(id: number): Promise<void> {

    try {

      /**
       * Ici il faut disposer d'une méthode loadPlayer()
       * qui retourne le Player, ou récupérer le joueur autrement
       * depuis le store.
       */
      const player = await this.playersStore.getPlayer(id);

      if (!player) {

        console.error(`Joueur ${id} introuvable.`,);

        await this.router.navigate(['/team']);

        return;
      }

      this.playerModel.set(
        this.toFormModel(player),
      );

    } catch (error) {

      console.error(
        `Impossible de charger le joueur ${id}.`,
        error,
      );

      await this.router.navigate(['/team']);
    }
  }


  // SUBMIT

  protected async onSubmit(): Promise<void> {

    if (this.saving()) {
      return;
    }

    await submit(
      this.playerForm,

      async () => {

        this.saving.set(true);

        try {

          const formValue = this.playerModel();

          // -------------------------------------------------------------------
          // DONNEES COMMUNES CREATION / MODIFICATION
          // -------------------------------------------------------------------

          const player = this.toApiModel(formValue);

          // -------------------------------------------------------------------
          // MODIFICATION
          // -------------------------------------------------------------------

          if (this.isEdit()) {

            const id = this.playerId();

            if (id === null) {

              console.error(
                'Impossible de modifier le joueur : ID absent.',
              );

              return;
            }

            await this.playersStore.updatePlayer(
              id,
              player,
            );

          } else {

            // ---------------------------------------------------------------
            // CREATION
            // ---------------------------------------------------------------

            await this.playersStore.addPlayer(
              player,
            );
          }

          // -------------------------------------------------------------------
          // RETOUR A LA LISTE
          // -------------------------------------------------------------------

          await this.router.navigate([
            '/team',
          ]);

        } catch (error) {

          /**
           * Ne jamais exposer directement l'erreur backend
           * dans le template.
           */
          console.error(
            'Erreur lors de la sauvegarde du joueur.',
            error,
          );

        } finally {

          this.saving.set(false);
        }
      },
    );
  }

  // ===========================================================================
  // CANCEL
  // ===========================================================================

  protected async onCancel(): Promise<void> {

    await this.router.navigate([
      '/team',
    ]);
  }

  // ===========================================================================
  // FORM -> API
  // ===========================================================================

  private toApiModel(
    value: PlayerFormModel,
  ): Omit<Player, 'id'> {

    return {

      firstname: value.firstname.trim(),

      lastname: value.lastname.trim(),

      email: value.email
        .trim()
        .toLowerCase(),

      address: value.address.trim(),

      age: value.age,

      dob: this.dateStringToDate(
        value.dob,
      ),

      position: value.position.trim(),

      nbGoal: value.nbGoal,

      nbAssist: value.nbAssist,

      nbGame: value.nbGame,
    };
  }

  // ===========================================================================
  // PLAYER -> FORM
  // ===========================================================================

  private toFormModel(
    player: Player,
  ): PlayerFormModel {

    return {

      firstname: player.firstname,

      lastname: player.lastname,

      email: player.email,

      address: player.address,

      age: player.age,

      dob: this.dateToDateString(
        player.dob,
      ),

      position: player.position,

      nbGoal: player.nbGoal,

      nbAssist: player.nbAssist,

      nbGame: player.nbGame,
    };
  }

  // ===========================================================================
  // DATE
  // ===========================================================================

  private dateStringToDate(
    value: string,
  ): Date {

    const [
      year,
      month,
      day,
    ] = value
      .split('-')
      .map(Number);

    return new Date(
      year,
      month - 1,
      day,
    );
  }

  private dateToDateString(
    date: Date,
  ): string {

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      date.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
