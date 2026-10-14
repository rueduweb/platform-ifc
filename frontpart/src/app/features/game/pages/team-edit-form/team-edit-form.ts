import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  signal,
} from '@angular/core';

import {
  form,
  FormField,
  submit,
  required,
  validate
} from '@angular/forms/signals';

import { RankedTeam } from '../../../../shared/ui/championship-ranking/models/ranked-team.model';
import { TeamUpdate } from '../../data/models/team-update.model';
import { Team } from '../../../../shared/ui/championship-ranking/models/team.model';

@Component({
  selector: 'app-team-edit-form',
  imports: [FormField],
  templateUrl: './team-edit-form.html',
  styleUrl: './team-edit-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamEditForm {
  readonly team = input.required<Team>();

  readonly saved = output<Team>();
  readonly cancelled = output<void>();

  readonly model = signal<Team>({
    id: 0,
    name: '',
    nbW: 0,
    nbD: 0,
    nbL: 0,
    nbGoal: 0,
    nbConce: 0,
  });

  readonly teamForm = form(this.model, (path) => {
    required(path.name, {
      message: 'Le nom de l’équipe est obligatoire.',
    });

    validate(path.name, ({ value }) =>
      value().trim().length === 0
        ? {
            kind: 'blankName',
            message: 'Le nom ne peut pas être vide.',
          }
        : undefined,
    );

    const nonNegativeInteger = (
      field: typeof path.nbW,
    ) => {
      validate(field, ({ value }) => {
        const currentValue = value();

        return (
          !Number.isInteger(currentValue) ||
          currentValue < 0
        )
          ? {
              kind: 'nonNegativeInteger',
              message: 'Saisis un entier positif ou nul.',
            }
          : undefined;
      });
    };

    nonNegativeInteger(path.nbW);
    nonNegativeInteger(path.nbD);
    nonNegativeInteger(path.nbL);
    nonNegativeInteger(path.nbGoal);
    nonNegativeInteger(path.nbConce);
  });

  constructor() {
    effect(() => {
      this.model.set({ ...this.team() });
    });
  }

  save(event: SubmitEvent): void {
    event.preventDefault();

    if (!this.teamForm().valid()) {
      return;
    }

    this.saved.emit({
      ...this.model(),
      name: this.model().name.trim(),
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
