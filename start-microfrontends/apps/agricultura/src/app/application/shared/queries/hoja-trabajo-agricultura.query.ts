import { HojaTrabajoAgriculturaStore } from '../estados/hoja-trabajo-agricultura.store';
import { HojaTrabajoModel } from '../../core/models/hoja-trabajo/hoja-trabajo.model';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class HojaTrabajoAgriculturaQuery extends Query<HojaTrabajoModel> {
  constructor(protected override store: HojaTrabajoAgriculturaStore) {
    super(store);
  }
  selectHojaTrabajo$ = this.select((store) => store);
}
