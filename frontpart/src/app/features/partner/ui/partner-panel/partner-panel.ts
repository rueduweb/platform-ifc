import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import type { Partner } from '../../data/models/partner.model';
import { Partners } from '../../data/services/partner';
import { Router } from '@angular/router';

export type UserRole =
  | 'ADMIN'
  | 'USER'
  | 'OTHER';

@Component({
  selector: 'app-partner-panel',
  imports: [],
  templateUrl: './partner-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerPanel {

  private readonly partnersStore = inject(Partners);

  private readonly router = inject(Router);
  /*
   * ======================
   * INPUT
   * ======================
   */

  readonly partner = input.required<Partner>();

  readonly userRole = input<UserRole>('OTHER');

  readonly canModify = signal<boolean>(true);
  /* readonly canModify = computed(() => {
    const role = this.userRole();

    return role === 'ADMIN' || role === 'USER';
  }); */

  /*
   * ======================
   * OUTPUTS
   * ======================
   */

  readonly edit = output<Partner>();

  readonly remove = output<Partner>();

  /*
   * ======================
   * SOCIAL MEDIA
   * ======================
   */
  readonly socialMediaLinks = computed(() => {

    const value = this.partner().socialMedia;

    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map(link => link.trim())
      .filter(Boolean);
  });

  /*
   * ======================
   * MEDIA
   * ======================
   */

  readonly hasVideo = computed(() => !!this.partner().video);

  readonly hasLogo = computed(() => !!this.partner().logo);

  /*
   * ======================
   * ACTIONS
   * ======================
   */

  onEdit(id: number): void {
    // this.edit.emit(this.partner());
    console.log('Modifier le partenaire :', id);

    // naviguer vers /partner/edit/:id
    void this.router.navigate(['/partner', 'edit', id]);
  }


  onRemove(id: number): void {
    // this.remove.emit(this.partner());
    console.log('Supprimer le partenaire :', id);

    // Confirmation
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?');
    if (!confirmed) {
      console.log('Suppression annulée.');
      return;
    }
    // Suppression via partnersStore
    try {

      this.partnersStore.delete(id);

      console.log('Partenaire supprimé :',id);

    } catch (error) {

      console.error('Erreur lors de la suppression du partenaire :', error);

    }
  }
}
