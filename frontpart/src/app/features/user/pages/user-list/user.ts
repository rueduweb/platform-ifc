import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import { UserModel } from '../../data/models/user.model';
import { Users } from '../../data/services/users';

import { UserCardComponent } from '../../ui/user-card/user-card';
import { UserRoleModal } from '../../ui/user-role-modal/user-role-modal';
import { Auth } from '../../../auth/data/services/auth';

@Component({
  selector: 'app-user',
  imports: [ UserCardComponent, UserRoleModal ],
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

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    await this.usersStore.loadUsers();
  }

  async onDeleteUser(user: UserModel): Promise<void> {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.username}" ?`);

    if (!confirmed) {
      return;
    }

    await this.usersStore.deleteUser(user.id);
  }

  onEditUser(user: UserModel): void { // Affichage Popup
    this.selectedUser.set(user);
  }

  async onSaveRole(event: {
    role: UserModel['role'];
    resolve: (result: {
      success: boolean;
      error?: string;
    })=> void;
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
        error: this.usersStore.error() ?? 'Impossible de modifier le rôle.'
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
