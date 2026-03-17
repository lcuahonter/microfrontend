import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { ComplementosSeccionState, ComplementosSeccionStore } from "../tramites/complementos-seccion.store";

/**
 * comodocs
 * @class ComplementosSeccionQuery
 * @description Clase que extiende de Akita Query para manejar las consultas relacionadas con el estado de la sección de complementos.
 * Proporciona métodos para seleccionar y observar cambios en el estado.
 */
@Injectable({ providedIn: 'root' })
export class ComplementosSeccionQuery extends Query<ComplementosSeccionState> {
  
  /**
   * 
   * @property selectExportarIlustraciones$
   * Observable que selecciona el estado completo de la sección de complementos.
   * @type {Observable<ComplementosSeccionState>}
   */
  selectExportarIlustraciones$ = this.select((state) => {
    return state;
  });
    /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
   
  /**
   *  * compodoc
   * @constructor
   * @description Constructor que inicializa la consulta con el store correspondiente.
   * @param {ComplementosSeccionStore} store - El store que contiene el estado de la sección de complementos.
   */
  constructor(protected override store: ComplementosSeccionStore) {
    super(store);
  }
}