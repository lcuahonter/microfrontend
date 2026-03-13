import { Solicitud32616State, Tramite32616Store } from '../../estados/tramites/tramite32616.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Servicio para consultar el estado de la solicitud 32616.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32616Query extends Query<Solicitud32616State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * @returns {Observable<Solicitud32616State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32616Query.
   * @param {Tramite32616Store} store - El store que contiene el estado de la solicitud 32616.
   */
  constructor(
    protected override store: Tramite32616Store) {
    super(store);
  }
}
