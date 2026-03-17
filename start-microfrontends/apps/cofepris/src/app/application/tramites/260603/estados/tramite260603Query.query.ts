
import { Tramite260603State, Tramite260603Store } from './tramite260603Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class
 * @name Tramite260603Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260603.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260603State>}
 */
@Injectable({ providedIn: 'root' })
/**
 * @class
 * @name Tramite260603Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260603.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260603State>}
 */
export class Tramite260603Query extends Query<Tramite260603State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260603Store} store - La tienda que contiene el estado del trámite 260603.
   */
  constructor(protected override store: Tramite260603Store) {
    /**
     * @constructor
     * @description
     * Inicializa la consulta con la tienda correspondiente.
     *
     * @param {Tramite260603Store} store - La tienda que contiene el estado del trámite 260603.
     */
    super(store);
  }
  /**
   * @property {Observable<Tramite260603State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 260603.
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
}
