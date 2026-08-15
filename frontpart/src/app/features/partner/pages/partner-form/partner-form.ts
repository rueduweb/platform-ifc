import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import {
  form,
  FormField,
  FormRoot,
} from '@angular/forms/signals';

import { Partners } from '../../data/services/partner';

import type {
  Partner,
  PartnerFormModel,
} from '../../data/models/partner.model';

import {
  partnerFormEmpty,
  partnerFormSchema,
} from '../../data/models/partner.model';

import type {
  CreatePartnerDto,
  UpdatePartnerDto,
} from '../../data/models/partner-dto.model';


@Component({
  selector: 'app-partner-form',

  imports: [FormRoot, FormField],

  templateUrl: './partner-form.html',

  styleUrl: './partner-form.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnerForm implements OnInit {

  readonly store = inject(Partners);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);


  /*
   * ======================
   * FORM MODEL
   * ======================
   */

  protected readonly model = signal<PartnerFormModel>({ ...partnerFormEmpty });

  /*
   * ======================
   * SIGNAL FORM
   * ======================
   */

  protected readonly form = form(this.model, partnerFormSchema);


  /*
   * ======================
   * PARTNER ID
   * ======================
   */

  protected readonly partnerId = signal<number | null>(null);


  /*
   * ======================
   * COMPUTED
   * ======================
   */

  protected readonly isEditMode = computed(() => this.partnerId() !== null);

  protected readonly title = computed(
    () =>
      this.isEditMode()
        ? 'Modifier un partenaire'
        : 'Nouveau partenaire',
  );

  /*
   * ======================
   * INIT
   * ======================
   */

  ngOnInit(): void {
    this.initialize();
  }

  private async initialize(): Promise<void> {

    const id = this.route.snapshot.paramMap.get('id');

    /*
     * CREATE
     */

    if (id === null) {
      this.model.set({ ...partnerFormEmpty });

      return;
    }

    /*
     * EDIT
     */

    const partnerId = Number(id);

    if (!Number.isInteger(partnerId) || partnerId <= 0) {
      this.goBack();

      return;
    }

    this.partnerId.set(partnerId);

    const partner = await this.store.getById(partnerId);

    if (partner === null) {
      this.goBack();

      return;
    }

    this.model.set(this.partnerToFormModel(partner));

  }


  /*
   * ======================
   * BACKEND → FORM
   * ======================
   *
   * string | null
   *       ↓
   * string[]
   */

  private partnerToFormModel(partner: Partner): PartnerFormModel {

    return {
      name: partner.name,

      description: partner.description,

      email: partner.email,

      phone: partner.phone ?? '',

      logo: partner.logo ?? '',

      video: partner.video ?? '',

      activity: partner.activity,

      address: partner.address,

      contact: partner.contact ?? '',

      socialMedia: this.socialMediaToArray(
        partner.socialMedia,
      ),
    };
  }


  /*
   * =======================
   * SOCIAL MEDIA to convert
   * =======================
   */

  /**
   * ACTION sur le champ socialMedia
   */

  addSocialLink(): void {
    this.model.update(model => ({
      ...model,
      socialMedia: [...model.socialMedia, ''],
    }));
  }

  removeSocialLink(index: number): void {
    this.model.update(model => ({
      ...model,
      socialMedia: model.socialMedia.filter((_, i) => i !== index)
    }));
  }


  private socialMediaToArray(value: string | null): string[] {

    if (!value) {
      return [];
    }

    return value
      .split(',')
      .map(value => value.trim())
      .filter(Boolean);
  }


  private socialMediaToString(values: string[]): string | null {

    const result = values
      .map(value => value.trim())
      .filter(Boolean)
      .join(', ');

    return result || null;
  }


  /*
   * ======================
   * FORM → DTO
   * ======================
   *
   * string[]
   *    ↓
   * string | null
   */

  private toDto(value: PartnerFormModel): CreatePartnerDto {

    return {
      name: value.name,

      description: value.description,

      email: value.email,

      phone: value.phone || null,

      logo: value.logo || null,

      video: value.video || null,

      activity: value.activity,

      address: value.address,

      contact: value.contact || null,

      socialMedia: this.socialMediaToString(
        value.socialMedia,
      ),
    };
  }


  /*
   * ======================
   * SUBMIT
   * ======================
   */

  async submit(): Promise<void> {

    /*
     * Ne rien envoyer si le formulaire
     * est invalide.
     */

    if (this.form().invalid()) {
      return;
    }

    const dto = this.toDto(this.model());

    /*
      CREATION
     */

    if (this.partnerId() === null) {

      const result = await this.store.create(dto);

      if (result !== null) {
        this.goBack();
      }

      return;
    }


    /*
      CAS DE MODIFICATION
     */

    const id = this.partnerId();

    if (id === null) {
      return;
    }


    const updateDto: UpdatePartnerDto = dto;

    const result = await this.store.update(
      id,
      updateDto
    );


    if (result !== null) {
      this.goBack();
    }

  }


  /*
   * ======================
   * CANCEL
   * ======================
   */

  cancel(): void {
    this.goBack();
  }


  /*
   * ======================
   * NAVIGATION
   * ======================
   */

  private goBack(): void {
    this.router.navigate(['/partner']);
  }

}
