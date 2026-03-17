import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Solicitud290201State, Solicitud290201Store } from '../tramites/tramites290201.store';

@Injectable({ providedIn: 'root' })
export class Solicitud290201Query extends Query<Solicitud290201State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
    selectIdSolicitud$ = this.select(state => state.id_solicitud);
    isSubmitted$ = this.select(state => state.isSubmitted);

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud290201Store) {
    super(store);
  }
}
