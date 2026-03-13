import { RequerimientosStates, SolicitudRequerimientosState } from "../estados/requerimientos.store";
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @injectable
 * @name SolicitudRequerimientoQuery
 * @description Servicio de consulta (Query) de Akita para gestionar y observar el estado de los requerimientos de solicitud.
 *
*/
@Injectable({ providedIn: 'root' })
export class SolicitudRequerimientoQuery extends Query<SolicitudRequerimientosState> {

  /**
   * Este servicio permite acceder al estado completo de los requerimientos de solicitud a través del observable `selectSolicitud$`.
   * Está diseñado para ser inyectado en toda la aplicación mediante el decorador `@Injectable` con el alcance `root`.
   * 
   * @property {Observable<SolicitudRequerimientosState>} selectSolicitud$ - Observable que emite el estado actual de los requerimientos de solicitud.
   * 
  */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  /**
  * @constructor
   * @param {RequerimientosStates} store - Store de Akita que contiene el estado de los requerimientos de solicitud.
   */
  constructor(
    protected override store: RequerimientosStates) {
    super(store);
  }
}