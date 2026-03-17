import {
  Tramite260905State,
  Tramite260905Store,
} from './tramite260905Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class
 * @name Tramite260905Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260201.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260905State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite260905Query extends Query<Tramite260905State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260905Store} store - La tienda que contiene el estado del trámite 260201.
   */
  constructor(protected override store: Tramite260905Store) {
    super(store);
  }
  /**
   * @property {Observable<Tramite260905State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 260201.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<Fabricante[]>} getFabricanteTablaDatos$
   * @description
   * Selecciona la lista de fabricantes del estado.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );
  /**
   * @property {Observable<Destinatario[]>} getDestinatarioFinalTablaDatos$
   * @description
   * Selecciona la lista de destinatarios finales del estado.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );
  /**
   * @property {Observable<Proveedor[]>} getProveedorTablaDatos$
   * @description
   * Selecciona la lista de proveedores del estado.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );
  /**
   * @property {Observable<Facturador[]>} getFacturadorTablaDatos$
   * @description
   * Selecciona la lista de facturadores del estado.
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );
  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
}
