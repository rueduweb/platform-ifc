import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { UserModel } from '../../data/models/user.model';
import { Users } from '../../data/services/users';

import { UserCardComponent } from '../../ui/user-card/user-card';
import { UserRoleModal } from '../../ui/user-role-modal/user-role-modal';
import { Auth } from '../../../auth/data/services/auth';

@Component({
  selector: 'app-user',
  imports: [UserCardComponent, UserRoleModal],
  templateUrl: './user.html',
  styleUrl: './user.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class User implements OnInit {

  private readonly usersStore = inject(Users);
  protected readonly auth = inject(Auth);

  readonly users = this.usersStore.users;
  readonly loading = this.usersStore.loading;
  readonly error = this.usersStore.error;

  protected readonly selectedUser = signal<UserModel | null>(null);

  // Suppression d'un utilisateur
  protected readonly userToDelete = signal<UserModel | null>(null);
  protected readonly targetUserId = signal<number | null>(null);
  protected readonly deleting = signal(false);
  protected readonly deleteError = signal<string | null>(null);

  // Destinataires possibles : uniquement les utilisateurs USER
  protected readonly availableTargets = () =>
    this.users().filter(
      user =>
        user.role === 'USER' &&
        user.id !== this.userToDelete()?.id
    );

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    await this.usersStore.loadUsers();
  }

  // Ouvre la modale de suppression
  onDeleteUser(user: UserModel): void {
    this.userToDelete.set(user);
    this.targetUserId.set(null);
    this.deleteError.set(null);
  }

  // Récupère le destinataire sélectionné
  onTargetChange(value: string): void {
    this.targetUserId.set(
      value === '' ? null : Number(value)
    );
  }

  // Ferme la modale de suppression
  onCloseDeleteModal(): void {
    if (this.deleting()) {
      return;
    }

    this.userToDelete.set(null);
    this.targetUserId.set(null);
    this.deleteError.set(null);
  }

  // Confirme et exécute la suppression

  async confirmDeleteUser(): Promise<void> {
    const user = this.userToDelete();
    const targetId = this.targetUserId();

    if (!user || targetId === null) {
      this.deleteError.set(
        'Veuillez sélectionner un utilisateur destinataire.'
      );
      return;
    }

    if (!Number.isInteger(targetId) || targetId <= 0) {
      this.deleteError.set('Destinataire invalide.');
      return;
    }

    if (user.id === targetId) {
      this.deleteError.set(
        'Un utilisateur ne peut pas recevoir ses propres articles.'
      );
      return;
    }

    const targetUser = this.users().find(
      u => u.id === targetId && u.role === 'USER'
    );

    if (!targetUser) {
      this.deleteError.set(
        'L’utilisateur destinataire est introuvable ou invalide.'
      );
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);

    try {
      const result = await this.usersStore.deleteUser(
        user.id,
        targetId
      );

      if (!result) {
        this.deleteError.set(
          this.usersStore.error() ??
          'Impossible de supprimer cet utilisateur.'
        );
        return;
      }

      this.userToDelete.set(null);
      this.targetUserId.set(null);

      alert(
        `Utilisateur "${user.username}" supprimé avec succès.\n\n` +
        `${result.transferredArticlesCount} article(s) transféré(s) ` +
        `à "${targetUser.username}".`
      );

    } catch {
      this.deleteError.set(
        'Une erreur est survenue lors de la suppression.'
      );
    } finally {
      this.deleting.set(false);
    }
  }


  // Modification du rôle
  onEditUser(user: UserModel): void {
    this.selectedUser.set(user);
  }

  async onSaveRole(event: {
    role: UserModel['role'];
    resolve: (result: {
      success: boolean;
      error?: string;
    }) => void;
  }): Promise<void> {

    const user = this.selectedUser();

    if (!user) {
      event.resolve({
        success: false,
        error: 'Aucun utilisateur sélectionné.'
      });
      return;
    }

    const updatedUser = await this.usersStore.updateUser(
      user.id,
      {
        role: event.role
      }
    );

    if (!updatedUser) {
      event.resolve({
        success: false,
        error: this.usersStore.error() ??
          'Impossible de modifier le rôle.'
      });
      return;
    }

    event.resolve({ success: true });
    this.selectedUser.set(null);
  }

  onCloseRoleModal(): void {
    this.selectedUser.set(null);
  }
}
