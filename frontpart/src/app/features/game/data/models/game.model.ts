import {
  maxLength,
  min,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

export type Game = {
  id: number;
  location: string;
  date: Date;
  gameNum: string;
  homeTeam: string;
  awayTeam: string;
  nbGoalHome: number;
  nbGoalAway: number;
  note: string;
  forfeit: boolean;
};

type SortDirection = 'asc' | 'desc';

export type GamesState = {
  games: Game[];

  loading: boolean;
  error: string | null;

  search: string;

  page: number;
  pageSize: number;

  sortColumn: keyof Game;
  sortDirection: SortDirection;
};

/*
 Modèle utilisé lors de la création d'un match.
 */
export type AddGameItem = Omit<Game, 'id'>;

/**
 * Modèle utilisé spécifiquement par le formulaire.
 *
 * datetime-local manipule une chaîne de caractères
 * au format :
 *
 * YYYY-MM-DDTHH:mm
 *
 * alors que le modèle métier Game utilise un Date.
 */
export type GameFormModel = Omit<AddGameItem, 'date'> & {
  date: string;
};

/**
 * Initialise un formulaire vide.
 */
export const prepareEmptyGame = (): GameFormModel => ({
  location: '',
  date: '',
  gameNum: '',
  homeTeam: '',
  awayTeam: '',
  nbGoalHome: 0,
  nbGoalAway: 0,
  note: '',
  forfeit: false,
});

/**
 * Schéma de validation du formulaire d'ajout/modification
 * d'un match.
 */
export const gameSchema = schema<GameFormModel>((path) => {

  // ---------------------------------------------------------------------------
  // CHAMPS OBLIGATOIRES
  // ---------------------------------------------------------------------------

  required(path.location, {
    message: 'Le lieu est obligatoire.',
  });

  required(path.date, {
    message: 'La date et l’heure sont obligatoires.',
  });

  required(path.gameNum, {
    message: 'La journée est obligatoire.',
  });

  required(path.homeTeam, {
    message: 'L’équipe locale est obligatoire.',
  });

  required(path.awayTeam, {
    message: 'L’équipe visiteuse est obligatoire.',
  });


  // ---------------------------------------------------------------------------
  // BUTS
  // ---------------------------------------------------------------------------

  min(path.nbGoalHome, 0, {
    message: 'Le nombre de buts ne peut pas être négatif.',
  });

  min(path.nbGoalAway, 0, {
    message: 'Le nombre de buts ne peut pas être négatif.',
  });


  // ---------------------------------------------------------------------------
  // LONGUEURS
  // ---------------------------------------------------------------------------

  maxLength(path.homeTeam, 100, {
    message: 'Le nom de l’équipe locale est trop long.',
  });

  maxLength(path.awayTeam, 100, {
    message: 'Le nom de l’équipe visiteuse est trop long.',
  });

  maxLength(path.location, 200, {
    message: 'Le lieu est trop long.',
  });

  maxLength(path.note, 1000, {
    message: 'La note est trop longue.',
  });


  // ---------------------------------------------------------------------------
  // DATE / HEURE
  // ---------------------------------------------------------------------------

  validate(path.date, ({ value }) => {

    const dateValue = value();

    // Le required() s'occupe déjà du cas vide.
    if (!dateValue) {
      return null;
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        kind: 'invalidDate',
        message: 'La date et l’heure sont invalides.',
      };
    }

    return null;
  });
});



