/**
 * @nombre TramiteStoreQuery
 * @descripción Esta clase es una consulta (Query) de Akita que permite obtener el estado del store `TramiteStore`.
 * Se utiliza para seleccionar y acceder a los datos del estado de la aplicación relacionados con `TramiteState`.
 * 
 * @autor [Tu Nombre]
 * @fecha [Fecha de Creación]
 */

import { TramiteState, TramiteStore } from './tramite220702.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Clase que representa una consulta (Query) de Akita para el estado del store `TramiteStore`.
 * @export
 * @class TramiteStoreQuery
 * @extends {Query<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
export class TramiteStoreQuery extends Query<TramiteState> {

  /**
   * Crea una instancia de TramiteStoreQuery.
   * @constructor
   * @param {TramiteStore} store - Inyección del store que maneja el estado de `TramiteState`.
   */
  constructor(protected override store: TramiteStore) {
    super(store);
  }

  /**
   * Selector que permite obtener el estado completo de `TramiteState`.
   * @property {Observable<TramiteState>} selectSolicitudTramite$
   */
  selectSolicitudTramite$ = this.select((state) => {
    return state;
  });
}