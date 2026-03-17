import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud150102State } from './solicitud150102.store';
import { Solicitud150102Store } from './solicitud150102.store';

/**
 * @description Servicio que implementa una consulta (`Query`) para acceder al estado de la solicitud.
 * Utiliza la librería Akita para gestionar el estado de la aplicación.
 */
@Injectable({ providedIn: 'root' })
/**
 * @description Servicio que implementa una consulta (`Query`) para acceder al estado de la solicitud.
 * Utiliza la librería Akita para gestionar el estado de la aplicación.
 */
export class Solicitud150102Query extends Query<Solicitud150102State> {
  /**
   * @description Observable que permite seleccionar el estado completo de la solicitud.
   * @returns El estado actual de la solicitud (`Solicitud150102State`).
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @description Constructor que inicializa la consulta (`Query`) con el store de la solicitud.
   * @param solicitud150102Store Instancia del store que contiene el estado de la solicitud.
   */
  constructor(protected solicitud150102Store: Solicitud150102Store) {
    super(solicitud150102Store); // Inicializa el Query con el store proporcionado
  }
}
