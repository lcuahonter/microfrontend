import { Solicitud150103State,Solicitud150103Store } from './solicitud150103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @description
 * Servicio que implementa una consulta (`Query`) para acceder al estado de la solicitud 150103.
 * Utiliza la librería Akita para facilitar la gestión y observación del estado de la aplicación.
 *
 * Este servicio expone selectores que permiten a los componentes suscribirse y reaccionar ante
 * cambios en el estado de la solicitud.
 *
 * @example
 * constructor(private solicitudQuery: Solicitud150103Query) {
 *   this.solicitudQuery.seleccionarSolicitud$.subscribe(state => {
 *     console.log('Estado actualizado', state);
 *   });
 * }
 */
@Injectable({ providedIn: 'root' })
export class Solicitud150103Query extends Query<Solicitud150103State> {
  /**
   * @property seleccionarSolicitud$
   * @description Observable que emite el estado completo de la solicitud.
   * Puede ser usado en componentes para reaccionar a cualquier cambio de estado.
   *
   * @returns Observable del estado `Solicitud150103State`
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inicializa el Query a partir del store correspondiente.
   * Utiliza la clase base `Query` de Akita para observar el estado de la solicitud.
   *
   * @param solicitud150103Store Instancia del store que mantiene el estado de la solicitud.
   */
  constructor(protected solicitud150103Store: Solicitud150103Store) {
    super(solicitud150103Store);
  }
}
