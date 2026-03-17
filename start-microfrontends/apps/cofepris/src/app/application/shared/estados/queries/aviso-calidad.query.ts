/**
 * @file Servicio para consultar el estado de la solicitud de Aviso de Calidad.
 * Este servicio utiliza Akita para manejar el estado de la aplicación.
 */

import { AvisocalidadStore, SolicitudState } from '../../estados/stores/aviso-calidad.store'; 
import { Injectable } from '@angular/core'; // Importa el decorador Injectable de Angular.
import { Query } from '@datorama/akita'; // Importa Query de Akita para realizar consultas al estado.

/**
 * @Injectable Marca esta clase como un servicio que puede ser inyectado en otros componentes o servicios.
 * @providedIn 'root' Indica que este servicio está disponible en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })

/**
 * @class AvisocalidadQuery
 * Servicio para realizar consultas al estado de Aviso de Calidad.
 * Extiende la clase Query de Akita.
 */
export class AvisocalidadQuery extends Query<SolicitudState> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * @property selectSolicitud$
   * Observable para seleccionar el estado completo de la solicitud.
   * @returns {Observable<SolicitudState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state; // Devuelve el estado completo.
  });

  /**
   * @constructor
   * @param store Inyección del store de Aviso de Calidad.
   */
  constructor(
    protected override store: AvisocalidadStore) { // Sobrescribe el store protegido.
    super(store); // Llama al constructor de la clase base Query.
  }
}