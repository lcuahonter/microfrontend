import { ElegibilidadDeTextilesStore, TextilesState } from '../estados/elegibilidad-de-textiles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @injectable
 * @class ElegibilidadDeTextilesQuery
 * @description
 * Servicio de consulta (Query) para gestionar y observar el estado de elegibilidad de textiles usando Akita.
 * Permite seleccionar y suscribirse a los cambios del estado relacionado con el trámite de elegibilidad de textiles.
 *
 * @property {Observable<TextilesState>} selectTextile$ - Observable que emite el estado actual de textiles.
 *
 * @constructor
 * @param {ElegibilidadDeTextilesStore} store - Instancia del store de elegibilidad de textiles.
 *
 * @example
 * // Inyección en un componente o servicio
 * constructor(private textilesQuery: ElegibilidadDeTextilesQuery) {}
 *
 * // Suscripción al estado
 * this.textilesQuery.selectTextile$.subscribe(state => { ... });
 */
@Injectable({ providedIn: 'root' })
export class ElegibilidadDeTextilesQuery extends Query<TextilesState> {
  /**
   * @property {Observable<TextilesState>} selectTextile$
   * @description Observable que emite el estado actual de textiles.
   */
  selectTextile$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description Constructor del servicio.
   * @param {ElegibilidadDeTextilesStore} store Instancia del ElegibilidadDeTextilesStore utilizada para inicializar la consulta.
   */
    constructor(protected override store: ElegibilidadDeTextilesStore) {
      super(store);
    }
}
