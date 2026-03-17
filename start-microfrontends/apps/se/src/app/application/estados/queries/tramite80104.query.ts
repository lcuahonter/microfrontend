import { Solicitud80104State, Tramite80104Store } from '../tramites/tramite80104.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
@Injectable({ providedIn: 'root' })
export class Tramite80104Query extends Query<Solicitud80104State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite80104Store) {
    super(store);
  }
}