import { Tramite420102State, Tramite420102Store } from './tramite420102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite420102Query
 * @description Servicio de consulta (Query) para el estado del trámite 420102.
 * Proporciona observables para acceder a diferentes partes del estado del trámite.
 * Utiliza Akita para la gestión reactiva del estado.
 *
 * @example
 * ```typescript
 * constructor(private tramite420102Query: Tramite420102Query) {}
 *
 * this.tramite420102Query.selectSolicitud$.subscribe((estado) => {
 *   console.log('Estado del trámite:', estado);
 * });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class Tramite420102Query extends Query<Tramite420102State> {
  /**
   * @constructor
   * @description Constructor que inicializa el query con el store correspondiente.
   *
   * @param {Tramite420102Store} store - Instancia del store para el trámite 420102.
   */
  constructor(protected override store: Tramite420102Store) {
    super(store);
  }

  /**
   * @property {Observable<Tramite420102State>} selectSolicitud$
   * @description Observable que emite el estado completo del trámite 420102.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
}
