import { Solicitud32615State, Tramite32615Store } from '../../estados/tramites/tramite32615.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32615.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32615Query extends Query<Solicitud32615State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * @returns {Observable<Solicitud32615State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32615Query.
   * @param {Tramite32615Store} store - El store que contiene el estado de la solicitud 32615.
   */
  constructor(
    protected override store: Tramite32615Store) {
    super(store);
  }
}
