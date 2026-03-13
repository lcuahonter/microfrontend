import { Tramite260704State, Tramite260704Store } from '../stores/tramite260704Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite260704Query extends Query<Tramite260704State> {

  /**
   * Constructor de la clase Tramite260704Query
   * @param {Tramite260704Store} store - Store que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite260704Store) {
    super(store);
  }
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona los datos de la tabla de fabricantes
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * Selecciona los datos de la tabla de destinatarios finales
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Selecciona los datos de la tabla de proveedores
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * Selecciona los datos de la tabla de facturadores
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
