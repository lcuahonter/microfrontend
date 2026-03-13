import {
  Solicitud31910State,
  Tramite31910Store,
} from '../stores/tramite31910.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado del Tramite31910.
 * 
 * @export
 * @class Tramite31910Query
 * @extends {Query<Solicitud31910State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite31910Query extends Query<Solicitud31910State> {
  /**
   * Observable para seleccionar el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Crea una instancia de Tramite31910Query.
   * El store para consultar el estado.
   */
  constructor(protected override store: Tramite31910Store) {
    super(store);
  }
}