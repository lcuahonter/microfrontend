import { Tramite260208State,Tramite260208Store } from '../estados/tramite260208Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Tramite260208Query extends Query<Tramite260208State> {
  /**
   * @constructor
   * Inyecta el store `Tramite260208Store` en la clase `Tramite260208Query`
   * para poder consultar el estado del trámite.
   *
   * @param store - El store de `Tramite260208Store` que contiene el estado completo del formulario de solicitud.
   */
  constructor(protected override store: Tramite260208Store) {
    super(store);
  }

  /**
   * @method selectTramiteState$
   * @description Selecciona el estado completo del formulario de solicitud del store.
   * Este observable emite el estado completo de la solicitud cada vez que se actualiza.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @method getFabricanteTablaDatos$
   * @description Selecciona los datos de los fabricantes desde el estado del store.
   * Este observable emite los datos de los fabricantes registrados en el estado de la solicitud.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @method getDestinatarioFinalTablaDatos$
   * @description Selecciona los datos de los destinatarios finales desde el estado del store.
   * Este observable emite los datos de los destinatarios registrados en el estado de la solicitud.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * @method getProveedorTablaDatos$
   * @description Selecciona los datos de los proveedores desde el estado del store.
   * Este observable emite los datos de los proveedores registrados en el estado de la solicitud.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * @method getFacturadorTablaDatos$
   * @description Selecciona los datos de los facturadores desde el estado del store.
   * Este observable emite los datos de los facturadores registrados en el estado de la solicitud.
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
