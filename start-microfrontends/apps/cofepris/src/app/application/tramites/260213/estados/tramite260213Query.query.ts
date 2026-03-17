import {
  Tramite260213State,
  Tramite260213Store,
} from './tramite260213Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite260213Query
 * @description Query que provee observables (streams) para acceder
 * a distintas partes del estado `Tramite260213State`.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260213Query extends Query<Tramite260213State> {
  /**
   * @constructor
   * @description Constructor que llama al constructor de la clase base `Query`
   * con el `store` inyectado, para inicializar la consulta sobre el estado.
   * @param {Tramite260213Store} store - Store que contiene el estado
   * de `Tramite260213State`.
   */
  constructor(protected override store: Tramite260213Store) {
    super(store);
  }

  /**
   * @property selectTramiteState$
   * @description Flujo (observable) que expone el estado completo
   * de la solicitud. Permite suscribirse a cualquier cambio en `Tramite260213State`.
   * @type {Observable<Tramite260213State>}
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @property getFabricanteTablaDatos$
   * @description Flujo que expone los datos del fabricante en el estado.
   * Se puede suscribir para reaccionar a cambios en la tabla de fabricantes.
   * @type {Observable<Tramite260213State['fabricanteTablaDatos']>}
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @property getDestinatarioFinalTablaDatos$
   * @description Flujo que expone los datos del destinatario final en el estado.
   * Se puede suscribir para reaccionar a cambios en la tabla de destinatarios finales.
   * @type {Observable<Tramite260213State['destinatarioFinalTablaDatos']>}
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * @property getProveedorTablaDatos$
   * @description Flujo que expone los datos del proveedor en el estado.
   * Se puede suscribir para reaccionar a cambios en la tabla de proveedores.
   * @type {Observable<Tramite260213State['proveedorTablaDatos']>}
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * @property getFacturadorTablaDatos$
   * @description Flujo que expone los datos del facturador en el estado.
   * Se puede suscribir para reaccionar a cambios en la tabla de facturadores.
   * @type {Observable<Tramite260213State['facturadorTablaDatos']>}
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );

  /**
   * @property getTabSeleccionado$
   * @description Flujo que expone la pestaña seleccionada
   * dentro del proceso o formulario.
   * @type {Observable<Tramite260213State['tabSeleccionado']>}
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
}
