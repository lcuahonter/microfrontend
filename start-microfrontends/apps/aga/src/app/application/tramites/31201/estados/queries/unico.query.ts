import { UnicoState, UnicoStore } from '../renovacion.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @service
 * @name UnicoQuery
 * @description
 * Servicio para consultar el estado de la solicitud `Solicitud`.
 * Utiliza el patrón Query de Akita para gestionar y consultar el estado de la solicitud en la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class UnicoQuery extends Query<UnicoState> {

  /**
   * @observable
   * @name selectSolicitud$
   * @description
   * Observable para seleccionar el estado completo de la solicitud.
   * Permite observar los cambios en el estado de la solicitud a medida que se actualiza.
   * @returns {Observable<UnicoState>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @name UnicoQuery
   * @description
   * Constructor del servicio `UnicoQuery`. Inicializa la consulta con el `UnicoStore`.
   * @param {UnicoStore} store El store que contiene el estado de `UnicoState`.
   * El constructor invoca al constructor base de `Query` pasando el `UnicoStore`.
   */
  constructor(
    protected override store: UnicoStore) {
    super(store);
  }
}
