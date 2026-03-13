import { DatosProcedureState } from './tramites261103.store';
import { DatosProcedureStore } from './tramites261103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DatosProcedureQuery extends Query<DatosProcedureState> {

  /**
   * Selector para obtener todo el estado de Tramite260911.
   */
  selectTramite261103$ = this.select((state) => state);
  /**
   * Observable to select the desistimiento property from the state.
   */
  selectProrroga$ = this.select((state) => {
    return state;
  }); 
  constructor(
    protected override store: DatosProcedureStore) {
    super(store);
  }
  
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
  // public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
  /**
   * Observable que selecciona el estado completo de la sección.
   * Permite suscribirse a los cambios en el estado del trámite 420103.
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });
}