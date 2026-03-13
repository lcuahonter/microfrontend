import { Solicitud32614State, Tramite32614Store } from '../tramites/tramite32614.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Servicio para consultar el estado de la solicitud 32614.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32614Query extends Query<Solicitud32614State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * @returns {Observable<Solicitud32614State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio Tramite32614Query.
   * @param {Tramite32614Store} store - El store que contiene el estado de la solicitud 32614.
   */
  constructor(
    protected override store: Tramite32614Store) {
    super(store);
  }
}
