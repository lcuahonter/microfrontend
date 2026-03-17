import { Solicitud32614TercerosState, Tramite32614TercerosStore } from '../tramites/tramite32614_terceros.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la solicitud 32614 relacionada con terceros.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32614TercerosQuery extends Query<Solicitud32614TercerosState> {

  /**
   * Observable que selecciona el estado completo de la solicitud relacionada con terceros.
   * @returns {Observable<Solicitud32614TercerosState>} El estado completo de la solicitud de terceros.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32614TercerosQuery.
   * @param {Tramite32614TercerosStore} store - El store que contiene el estado de la solicitud 32614 de terceros.
   */
  constructor(
    protected override store: Tramite32614TercerosStore) {
    super(store);
  }
}
