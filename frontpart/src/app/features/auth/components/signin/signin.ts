import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';

import {
  email,
  form,
  FormField,
  FormRoot,
  required
} from '@angular/forms/signals';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SigninFormModel } from '../../data/models/auth.model';

import { Auth } from '../../data/services/auth';

@Component({
  selector: 'app-signin',
  imports: [
    FormField, FormRoot,
    RouterLink
  ],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signin {
  protected readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = this.auth.loading;
  readonly error = this.auth.error;

  readonly signinModel = signal<SigninFormModel>({
    email: '',
    password: '',
  });

  readonly signinForm = form(
    this.signinModel,
    (path) => {
      required(path.email, {
        message: 'L’adresse email est obligatoire.',
      });

      email(path.email, {
        message: 'Veuillez saisir une adresse email valide.',
      });

      required(path.password, {
        message: 'Le mot de passe est obligatoire.',
      });
    },

    {
      submission: {
        action: async () => {
          const { email, password } = this.signinModel();

          const authenticated = await this.auth.signin({ email, password });

          if (!authenticated) {
            return {
              kind: 'server',
              message: this.auth.error() ?? 'Connexion impossible.'
            };
          }

          const returnUrl = this.getSafeReturnUrl();

          await this.router.navigateByUrl(returnUrl);

          return undefined;
        },
      },
    },
  );

  readonly authState = this.auth;

  private getSafeReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

    if (
      returnUrl &&
      returnUrl.startsWith('/') &&
      !returnUrl.startsWith('//')
    ) {
      return returnUrl;
    }

    return '/home';
  }

}

