import { Solicitud32616TercerosState, Tramite32616TercerosStore } from '../../estados/tramites/tramite32616_terceros.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32616 relacionada con terceros.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32616TercerosQuery extends Query<Solicitud32616TercerosState> {

  /**
   * Observable que selecciona el estado completo de la solicitud relacionada con terceros.
   * @returns {Observable<Solicitud32616TercerosState>} El estado completo de la solicitud de terceros.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32616TercerosQuery.
   * @param {Tramite32616TercerosStore} store - El store que contiene el estado de la solicitud 32616 de terceros.
   */
  constructor(
    protected override store: Tramite32616TercerosStore) {
    super(store);
  }
}
