import { Solicitud80314State, Tramite80314Store } from '../tramites/tramite80314.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite80314Query extends Query<Solicitud80314State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite80314Store) {
    super(store);
  }
}
