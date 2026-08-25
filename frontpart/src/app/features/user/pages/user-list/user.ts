import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { UserModel } from '../../data/models/user.model';
import { Users } from '../../data/services/users';

import { UserCardComponent } from '../../ui/user-card/user-card';

@Component({
  selector: 'app-user',
  imports: [ UserCardComponent ],
  templateUrl: './user.html',
  styleUrl: './user.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class User implements OnInit {

  private readonly usersStore = inject(Users);

  readonly users = this.usersStore.users;

  readonly loading = this.usersStore.loading;

  readonly error = this.usersStore.error;

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    await this.usersStore.loadUsers();
  }

  async onDeleteUser(user: UserModel): Promise<void> {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer l'utilisateur "${user.username}" ?`
    );

    if (!confirmed) {
      return;
    }

    await this.usersStore.deleteUser(user.id);
  }

  onEditUser(user: UserModel): void {
    console.log('Modifier utilisateur :', user);

    // Exemple :
    // this.router.navigate(['/users', user.id, 'edit']);
  }

}
