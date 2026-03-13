/**
 * Consultas utilizadas en el trámite 260101 para obtener datos específicos del estado global del trámite.
 *
 * Este archivo contiene la definición de la clase `Tramite260101Query`, que proporciona métodos para consultar
 * diferentes partes del estado del trámite, como los datos de destinatarios, fabricantes, proveedores, facturadores,
 * y el índice de la pestaña seleccionada.
 */

import { Tramite260101State, Tramite260101Store } from './tramite260101Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite260101Query
 * @description
 * Clase que extiende `Query` de Akita para proporcionar métodos de consulta sobre el estado global del trámite 260101.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260101Query extends Query<Tramite260101State> {
  /**
   * @constructor
   * @description
   * Constructor que inyecta el store `Tramite260101Store` para acceder al estado global del trámite.
   *
   * @param {Tramite260101Store} store - Store que administra el estado del trámite 260101.
   */
  constructor(protected override store: Tramite260101Store) {
    super(store);
  }

  /**
   * @property {Observable<Tramite260101State>} selectTramiteState$
   * Observable que selecciona el estado completo del trámite.
   */
  selectTramiteState$ = this.select((state) => state);

  /**
   * @property {Observable<Fabricante[]>} getFabricanteTablaDatos$
   * Observable que selecciona los datos de la tabla de fabricantes.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @property {Observable<Destinatario[]>} getDestinatarioFinalTablaDatos$
   * Observable que selecciona los datos de la tabla de destinatarios finales.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * @property {Observable<Proveedor[]>} getProveedorTablaDatos$
   * Observable que selecciona los datos de la tabla de proveedores.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * @property {Observable<Facturador[]>} getFacturadorTablaDatos$
   * Observable que selecciona los datos de la tabla de facturadores.
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );

  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * Observable que selecciona el índice de la pestaña seleccionada en el flujo del trámite.
   */
  public getTabSeleccionado$ = this.select(
    (state) => state.tabSeleccionado
  );
}