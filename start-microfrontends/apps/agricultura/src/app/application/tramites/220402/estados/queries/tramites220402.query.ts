import { Solicitud220402State, Solicitud220402Store } from '../tramites/tramites220402.store';import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud220402Query extends Query<Solicitud220402State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud220402Store) {
    super(store);
  }
}
