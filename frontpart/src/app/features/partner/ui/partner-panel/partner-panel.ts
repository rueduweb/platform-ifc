import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import type { Partner } from '../../data/models/partner.model';

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
  /*
   * ======================
   * INPUT
   * ======================
   */

  readonly partner = input.required<Partner>();

  readonly userRole = input<UserRole>('OTHER');

  readonly canModify = computed(() => {
    const role = this.userRole();

    return role === 'ADMIN' || role === 'USER';
  });

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

  onEdit(): void {
    this.edit.emit(this.partner());
  }


  onRemove(): void {
    this.remove.emit(this.partner());
  }
}
