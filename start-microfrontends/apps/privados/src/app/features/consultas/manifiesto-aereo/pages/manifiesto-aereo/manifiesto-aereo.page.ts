import { Component } from '@angular/core';
import { ManifiestoAereoFormComponent } from '../../components/manifiesto-aereo-form/manifiesto-aereo-form.component';

@Component({
  selector: 'app-manifiesto-aereo',
  standalone: true,
  imports: [ManifiestoAereoFormComponent],
  templateUrl: './manifiesto-aereo.page.html',
})
export class ManifiestoAereoPage {}
