import { Injectable } from '@angular/core';

import { Query } from '@datorama/akita';

import { Tramite260206State } from '../stores/tramite260206Store.store';
import { Tramite260206Store } from '../stores/tramite260206Store.store';

@Injectable({ providedIn: 'root' })
export class Tramite260206Query extends Query<Tramite260206State> {
  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite260206Store) {
    super(store);
  }
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * Obtiene un observable que selecciona los datos de la tabla de fabricantes
   * desde el estado de la aplicación.
   *
   * @returns Un observable que emite los datos de la tabla de fabricantes.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * Obtiene un observable que selecciona los datos de la tabla del destinatario final
   * desde el estado de la aplicación.
   *
   * @returns Un observable que emite los datos de la tabla del destinatario final.
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );
  /**
   * Obtiene un observable que selecciona los datos de la tabla del proveedor
   * desde el estado de la aplicación.
   *
   * @returns Un observable que emite los datos de la tabla del proveedor.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );
  /**
   * Obtiene un observable que selecciona los datos de la tabla del facturador
   * desde el estado de la aplicación.
   *
   * @returns Un observable que emite los datos de la tabla del facturador.
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );
  /**
   * Obtiene un observable que selecciona los datos de la tabla de mercancías
   * desde el estado de la aplicación.
   *
   * @returns Un observable que emite los datos de la tabla de mercancías.
   */
  public getTabSeleccionado$ = this.select(
    (state) => state.tabSeleccionado
  );
}
