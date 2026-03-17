import { Solicitud32615TercerosState, Tramite32615TercerosStore } from '../../estados/tramites/tramite32615_terceros.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32615 relacionada con terceros.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32615TercerosQuery extends Query<Solicitud32615TercerosState> {

  /**
   * Observable que selecciona el estado completo de la solicitud relacionada con terceros.
   * @returns {Observable<Solicitud32615TercerosState>} El estado completo de la solicitud de terceros.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32615TercerosQuery.
   * @param {Tramite32615TercerosStore} store - El store que contiene el estado de la solicitud 32615 de terceros.
   */
  constructor(
    protected override store: Tramite32615TercerosStore) {
    super(store);
  }
}
