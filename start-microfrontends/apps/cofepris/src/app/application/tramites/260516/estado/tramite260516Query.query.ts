/**
 * Consultas utilizadas en el trámite 260516 para obtener datos específicos del estado global del trámite.
 *
 * Este archivo contiene la definición de la clase `Tramite260516Query`, que proporciona métodos para consultar
 * diferentes partes del estado del trámite, como los datos de destinatarios, fabricantes, proveedores, facturadores,
 * y el índice de la pestaña seleccionada.
 */

import { Tramite260516State, Tramite260516Store } from './tramite260516Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite260516Query
 * @description
 * Clase que extiende `Query` de Akita para proporcionar métodos de consulta sobre el estado global del trámite 260516.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260516Query extends Query<Tramite260516State> {
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260516Store` para acceder al estado global del trámite.
   *
   * @param {Tramite260516Store} store - Store que administra el estado del trámite 260516.
   */
  constructor(protected override store: Tramite260516Store) {
    super(store);
  }

  /**
   * @property {Observable<Tramite260516State>} selectTramiteState$
   * Observable que selecciona el estado completo del trámite.
   */
  selectTramiteState$ = this.select((state) => state);
  
}