import { Solicitud230101State, Solicitud230101Store } from '../tramites/tramites230101.store';import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud230101Query extends Query<Solicitud230101State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud230101Store) {
    super(store);
  }
}
