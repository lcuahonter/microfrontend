import {
  Solicitud260215State,
  Tramite260215Store,
} from '../tramites/tramite260215.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite260215Query extends Query<Solicitud260215State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
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
   * @property {Observable<Tramite260214State>} selectTramiteState$
   * Observable que selecciona el estado completo del trámite.
   */
  selectTramiteState$ = this.select((state) => state);

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite260215Store) {
    super(store);
  }
   /**
    * @property {Observable<number | undefined>} getTabSeleccionado$
    * @description
    * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
    */
   public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
}
