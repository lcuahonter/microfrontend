import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud150101State } from './solicitud150101.store';
import { Solicitud150101Store } from './solicitud150101.store';

/**
 * @description Servicio de consulta para el estado de la solicitud 150101.
 * Proporciona métodos para seleccionar y observar el estado completo de la solicitud.
 * 
 * @template Solicitud150101State - Representa la estructura del estado de la solicitud.
 * 
 * @example
 * // Uso del servicio para observar el estado completo de la solicitud
 * solicitud150101Query.seleccionarSolicitud$.subscribe((estado) => {
 *   console.log(estado);
 * });
 * 
 * @providedIn root
 */
@Injectable({ 
  providedIn: 'root'
})
export class Solicitud150101Query extends Query<Solicitud150101State> {
  /**
   * @description Observable que selecciona el estado completo de la solicitud.
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * @param solicitud150101Store - Instancia del store de Solicitud150101.
   */
  constructor(protected solicitud150101Store: Solicitud150101Store) {
    super(solicitud150101Store);
  }
}
