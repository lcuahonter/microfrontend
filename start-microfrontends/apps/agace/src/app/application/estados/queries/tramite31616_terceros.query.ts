import { Solicitud31616TercerosState, Tramite31616TercerosStore } from '../../estados/tramites/tramite31616_terceros.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 31616 relacionada con terceros.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31616TercerosQuery extends Query<Solicitud31616TercerosState> {

  /**
   * Observable que selecciona el estado completo de la solicitud relacionada con terceros.
   * @returns {Observable<Solicitud31616TercerosState>} El estado completo de la solicitud de terceros.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite31616TercerosQuery.
   * @param {Tramite31616TercerosStore} store - El store que contiene el estado de la solicitud 31616 de terceros.
   */
  constructor(
    protected override store: Tramite31616TercerosStore) {
    super(store);
  }
}
