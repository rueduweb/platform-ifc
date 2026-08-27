import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  linkedSignal,
  signal
} from '@angular/core';

import {
  form,
  FormField,
  required,
  submit
} from '@angular/forms/signals';

import { UserModel } from '../../data/models/user.model';

import { SaveRoleEvent, SaveRoleResult } from './user-role-modal.types';

@Component({
  selector: 'app-user-role-modal',
  imports: [FormField],
  templateUrl: './user-role-modal.html',
  styleUrl: './user-role-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserRoleModal {

  readonly user = input.required<UserModel>();

  readonly save = output<SaveRoleEvent>();

  readonly close = output<void>();

  readonly saveError = signal<string | null>(null);

  protected readonly formModel = linkedSignal(() => ({
    role: this.user().role,
  }));

  protected readonly roleForm = form(
    this.formModel,
    (path) => { required(path.role); }
  );

  protected async onSubmit(): Promise<void> {

    // On efface une éventuelle ancienne erreur
    this.saveError.set(null);

    const success = await submit(
      this.roleForm,
      async (form) => {

        const role = form().value().role;

        const result = await new Promise<SaveRoleResult>((resolve) => {
          this.save.emit({ role, resolve });
        });

        if (!result.success) {
          this.saveError.set(result.error ?? 'Impossible de modifier le rôle.');

          return;
        }

      }
    );

  }

  protected onClose(): void {
    this.close.emit();
  }
}


