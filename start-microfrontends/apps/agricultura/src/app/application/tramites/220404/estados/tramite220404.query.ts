/**
 * @fileoverview
 * Este archivo define la clase `DesistimientoQuery`, que es una consulta (Query) de Akita para acceder al estado
 * del store `DesistimientoStore`. Proporciona selectores para obtener datos específicos del estado.
 * 
 * @module Tramite220404Query
 * @description
 * Este archivo contiene la implementación de la clase `DesistimientoQuery`, que incluye selectores para acceder
 * al estado completo y a propiedades específicas del estado del desistimiento.
 */

import { DesistimientoState, DesistimientoStore } from './tramite220404.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class DesistimientoQuery
 * @description
 * Clase que extiende `Query` de Akita para acceder al estado del store `DesistimientoStore`.
 * Proporciona selectores para obtener datos específicos del estado.
 */
@Injectable({ providedIn: 'root' })
export class DesistimientoQuery extends Query<DesistimientoState> {
  /**
   * @constructor
   * @description
   * Constructor de la clase `DesistimientoQuery`. Llama al constructor de la clase base `Query`
   * y pasa el store `DesistimientoStore` como parámetro.
   * 
   * @param {DesistimientoStore} store - Inyección del store que maneja el estado de `DesistimientoState`.
   */
  constructor(protected override store: DesistimientoStore) {
    super(store);
  }

  /**
   * @property {Observable<DesistimientoState>} selectDesistimiento$
   * @description
   * Selector que permite obtener el estado completo de `DesistimientoState`.
   * 
   * @example
   * this.desistimientoQuery.selectDesistimiento$.subscribe((state) => {
   *   console.log(state);
   * });
   */
  selectDesistimiento$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<string>} selectDescripcion$
   * @description
   * Selector que permite obtener la descripción del desistimiento desde el estado.
   * 
   * @example
   * this.desistimientoQuery.selectDescripcion$.subscribe((descripcion) => {
   *   console.log(descripcion);
   * });
   */
  selectDescripcion$ = this.select((state) => {
    return state.descripcion;
  });
}