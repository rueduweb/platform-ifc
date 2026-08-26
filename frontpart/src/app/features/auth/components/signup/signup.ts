import {
  Component,
  inject,
  signal,
} from '@angular/core';

import {
  email,
  FormField,
  form,
  minLength,
  required,
  FormRoot,
  validate,
} from '@angular/forms/signals';

import { Router, RouterLink } from '@angular/router';

import {
  SignupFormModel,
} from '../../data/models/auth.model';

import { Auth } from '../../data/services/auth';

@Component({
  selector: 'app-signup-form',
  imports: [
    FormField,
    FormRoot,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);

  readonly auth = this.authService;

  readonly signupModel = signal<SignupFormModel>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  readonly signupForm = form(
    this.signupModel,
    path => {
      required(path.username, {
        message: 'Le pseudo est obligatoire.',
      });

      required(path.email, {
        message: "L'adresse email est obligatoire.",
      });

      email(path.email, {
        message: "L'adresse email n'est pas valide.",
      });

      required(path.password, {
        message: 'Le mot de passe est obligatoire.',
      });

      minLength(path.password, 8, {
        message: 'Le mot de passe doit contenir au moins 8 caractères.',
      });

      required(path.confirmPassword, {
        message: 'Veuillez confirmer votre mot de passe.',
      });

      validate(
        path.confirmPassword,
        ({ value, valueOf }) => {
          if (value() !== valueOf(path.password)) {
            return {
              kind: 'passwordMismatch',
              message: 'Les mots de passe ne correspondent pas.',
            };
          }

          return null;
        },
      );
    },

    {
      submission: {
        action: async () => {
          const { username, email, password } = this.signupModel();

          const authenticated = await this.auth.signup({ username, email, password });

          if (!authenticated) {
            return {
              kind: 'server',
              message: this.auth.error() ?? 'Création du compte impossible.'
            };
          }

          return undefined;
        },
      },
    },

  );

}
