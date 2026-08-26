import { Component, inject, OnInit, signal } from '@angular/core';

import { Router } from '@angular/router';

import { Partners } from '../../data/services/partner';
import { PartnerPanel } from '../../ui/partner-panel/partner-panel';
import { Partner } from '../../data/models/partner.model';
import { Auth } from '../../../auth/data/services/auth';

@Component({
  selector: 'app-partner',
  imports: [PartnerPanel],
  templateUrl: './partner.html',
  styleUrl: './partner.css',
})
export class PartnerList implements OnInit {

  protected readonly today = signal<Date>(new Date());

  readonly partnersStore = inject(Partners);

  private readonly router = inject(Router);

  protected readonly auth = inject(Auth);

  ngOnInit(): void {
    this.partnersStore.load();
  }

  newPartner(): void {
    this.router.navigate(['/partner/new']);
  }

  editPartner(id: number): void {
    this.router.navigate(['/partner/edit', id]);
  }

  async deletePartner(id: number): Promise<void> {
    const confirmed = window.confirm('Voulez-vous vraiment supprimer ce partenaire ?');

    if (!confirmed) {
      return;
    }

    await this.partnersStore.delete(id);
  }
}
