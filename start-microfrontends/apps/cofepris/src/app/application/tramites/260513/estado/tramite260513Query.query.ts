/**
 * Consultas utilizadas en el trámite 260513 para obtener datos específicos del estado global del trámite.
 *
 * Este archivo contiene la definición de la clase `Tramite260513Query`, que proporciona métodos para consultar
 * diferentes partes del estado del trámite, como los datos de destinatarios, fabricantes, proveedores, facturadores,
 * y el índice de la pestaña seleccionada.
 */

import { Tramite260513State, Tramite260513Store } from './tramite260513Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite260513Query
 * @description
 * Clase que extiende `Query` de Akita para proporcionar métodos de consulta sobre el estado global del trámite 260513.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260513Query extends Query<Tramite260513State> {
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260513Store` para acceder al estado global del trámite.
   *
   * @param {Tramite260513Store} store - Store que administra el estado del trámite 260513.
   */
  constructor(protected override store: Tramite260513Store) {
    super(store);
  }

  /**
   * @property {Observable<Tramite260513State>} selectTramiteState$
   * Observable que selecciona el estado completo del trámite.
   */
  selectTramiteState$ = this.select((state) => state);

   /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
  
}