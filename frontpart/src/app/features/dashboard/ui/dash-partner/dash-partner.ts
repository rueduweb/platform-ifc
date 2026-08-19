import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

import {
  DashPartners as DashPartnerModel,
} from '../../data/models/dash-partner.model';

@Component({
  selector: 'app-dash-partner',
  templateUrl: './dash-partner.html',
  styleUrl: './dash-partner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashPartner {

  readonly data = input.required<DashPartnerModel>();

}

