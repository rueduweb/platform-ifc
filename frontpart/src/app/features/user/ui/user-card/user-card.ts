import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

import { UserModel } from '../../data/models/user.model';

import { TitleCasePipe } from '@angular/common';
import { CustomDateFormatPipe } from '../../../../shared/pipes/custom-date-format.pipe';

@Component({
  selector: 'app-user-card',
  imports: [TitleCasePipe, CustomDateFormatPipe],
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  readonly user = input.required<UserModel>();

  readonly edit = output<UserModel>();
  readonly remove = output<UserModel>();
  readonly toggleVisibility = output<UserModel>();
  readonly articlesCount = computed(() => this.user().articles?.length ?? 0);

  /**
   * Permet d'utiliser createdDate / updatedDate si le backend
   * les fournit, sans modifier immédiatement UserModel.
   */
  protected get createdDate(): string | null {
    return this.userAsExtended.createdAt ?? null;
  }

  protected get updatedDate(): string | null {
    return this.userAsExtended.updatedAt ?? null;
  }

  protected get articleCount(): number {
    return this.user().articles?.length ?? 0;
  }

  private get userAsExtended(): UserModel & {
    createdDate?: string;
    updatedDate?: string;
  } {
    return this.user() as UserModel & {
      createdDate?: string;
      updatedDate?: string;
    };
  }

  protected onEdit(): void {
    this.edit.emit(this.user());
  }

  protected onRemove(): void {
    this.remove.emit(this.user());
  }

  protected onToggleVisibility(): void {
    this.toggleVisibility.emit(this.user());
  }
}
