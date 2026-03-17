/**
 * Query de Akita para consultar el estado del trámite 110102.
 * Permite seleccionar y observar los cambios en el estado del store.
 */

import { Tramite110102State, Tramite110102Store } from "../store/tramite110102.store";
import { Injectable } from "@angular/core";
import { Query } from '@datorama/akita';

/**
 * Servicio que expone métodos de consulta sobre el estado del trámite 110102.
 * @export
 * @class Tramite110102Query
 * @extends {Query<Tramite110102State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite110102Query extends Query<Tramite110102State> {

  /**
   * Observable que emite el estado completo del trámite 110102.
   * @type {Observable<Tramite110102State>}
   */
  selectTramite110102$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor que recibe el store del trámite 110102.
   * @param {Tramite110102Store} store - Store de Akita para el trámite 110102.
   */
  constructor(
    protected override store: Tramite110102Store
  ) {
    super(store);
  }
}