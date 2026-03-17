import { Solicitud31616State, Tramite31616Store } from '../../estados/tramites/tramite31616.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 31616.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31616Query extends Query<Solicitud31616State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * @returns {Observable<Solicitud31616State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite31616Query.
   * @param {Tramite31616Store} store - El store que contiene el estado de la solicitud 31616.
   */
  constructor(
    protected override store: Tramite31616Store) {
    super(store);
  }
}
