import {
  email,
  min,
  pattern,
  required,
  schema,
  validate,
} from '@angular/forms/signals';

export type Player = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  age: number;
  dob: Date;
  position: string;
  nbGoal: number;
  nbAssist: number;
  nbGame: number;
};

export type PlayersState = {
	players: Player[];
	loading: boolean;
	error: string | null;
}

export type AddPlayerItem = Omit<Player, 'id'>;

/**
 * Modèle utilisé spécifiquement par le formulaire.
 *
 * <input type="date"> manipule une chaîne :
 *
 * YYYY-MM-DD
 *
 * alors que le modèle métier Player utilise Date.
 */
export type PlayerFormModel = Omit<AddPlayerItem, 'dob'> & {
  dob: string;
};

export const prepareEmptyPlayer = (): PlayerFormModel => ({
  firstname: '',
  lastname: '',
  email: '',
  address: '',
  age: 0,
  dob: '',
  position: '',
  nbGoal: 0,
  nbAssist: 0,
  nbGame: 0,
});

export const playerSchema = schema<PlayerFormModel>((path) => {

  // ---------------------------------------------------------------------------
  // CHAMPS OBLIGATOIRES
  // ---------------------------------------------------------------------------

  required(path.firstname, {
    message: 'Le prénom est obligatoire.',
  });

  required(path.lastname, {
    message: 'Le nom est obligatoire.',
  });

  required(path.email, {
    message: 'L\'email est obligatoire.',
  });

  required(path.address, {
    message: 'L\'adresse est obligatoire.',
  });

  required(path.age, {
    message: 'L\'âge est obligatoire.',
  });

  required(path.dob, {
    message: 'La date de naissance est obligatoire.',
  });

  required(path.position, {
    message: 'Le poste est obligatoire.',
  });

  // ---------------------------------------------------------------------------
  // EMAIL
  // ---------------------------------------------------------------------------

  email(path.email, {
    message: 'L\'email n\'est pas valide.',
  });

  // ---------------------------------------------------------------------------
  // STATISTIQUES
  // ---------------------------------------------------------------------------

  min(path.age, 0, {
    message: 'L\'âge ne peut pas être négatif.',
  });

  min(path.nbGoal, 0, {
    message: 'Le nombre de buts ne peut pas être négatif.',
  });

  min(path.nbAssist, 0, {
    message: 'Le nombre de passes décisives ne peut pas être négatif.',
  });

  min(path.nbGame, 0, {
    message: 'Le nombre de matchs ne peut pas être négatif.',
  });

  // ---------------------------------------------------------------------------
  // NOM / PRÉNOM
  // ---------------------------------------------------------------------------

  pattern(
    path.firstname,
    /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
    {
      message: 'Le prénom contient des caractères invalides.',
    },
  );

  pattern(
    path.lastname,
    /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u,
    {
      message: 'Le nom contient des caractères invalides.',
    },
  );

  // ---------------------------------------------------------------------------
  // DATE DE NAISSANCE
  // ---------------------------------------------------------------------------

  validate(path.dob, ({ value }) => {

    const dateValue = value();

    if (!dateValue) {
      return null;
    }

    /**
     * Pour <input type="date">, le format attendu est :
     *
     * YYYY-MM-DD
     */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return {
        kind: 'invalidDate',
        message: 'La date est invalide.',
      };
    }

    /**
     * Construction locale de la date.
     *
     * On évite new Date('YYYY-MM-DD') qui interprète
     * la chaîne comme une date UTC.
     */
    const [year, month, day] =
      dateValue.split('-').map(Number);

    const date = new Date(
      year,
      month - 1,
      day,
    );

    /**
     * Vérifie que la date existe réellement.
     *
     * Exemple :
     * 2026-02-31 -> invalide
     */
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return {
        kind: 'invalidDate',
        message: 'La date est invalide.',
      };
    }

    return null;
  });
});
