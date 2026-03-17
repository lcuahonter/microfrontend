import { Tramite260102State, Tramite260102Store } from '../stores/tramite260102Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite260102Query extends Query<Tramite260102State> {

  /**
   * Constructor de la clase Tramite260102Query
   * @param {Tramite260102Store} store - Store que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite260102Store) {
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
