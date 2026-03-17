import {
  Solicitud260605State,
  Tramite260605Store,
} from '../tramites/tramite260605.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado del Tramite260605.
 * 
 * @export
 * @class Tramite260605Query
 * @extends {Query<Solicitud260605State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite260605Query extends Query<Solicitud260605State> {
  /**
   * Observable para seleccionar el estado completo de la solicitud.
   * 
   * @type {Observable<Solicitud260605State>}
   * @memberof Tramite260605Query
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Crea una instancia de Tramite260605Query.
   * 
   * @param {Tramite260605Store} store - El store para consultar el estado.
   * @memberof Tramite260605Query
   */
  constructor(protected override store: Tramite260605Store) {
    super(store);
  }
}