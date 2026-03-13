import { Solicitud80306State, Tramite80306Store } from '../tramites/tramite80306.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite80306Query extends Query<Solicitud80306State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite80306Store) {
    super(store);
  }
}
