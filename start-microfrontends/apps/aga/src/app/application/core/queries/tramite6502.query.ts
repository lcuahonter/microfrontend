
import { Solicitud6502State, Tramite6502Store } from '../estados/tramites/tramite6502.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 6502.
 */
@Injectable({ providedIn: 'root' })
export class Tramite6502Query extends Query<Solicitud6502State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * @returns {Observable<Solicitud6502State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite6502Query.
   * @param {Tramite6502Store} store - El store que contiene el estado de la solicitud 6502.
   */
  constructor(
    protected override store: Tramite6502Store) {
    super(store);
  }
}
