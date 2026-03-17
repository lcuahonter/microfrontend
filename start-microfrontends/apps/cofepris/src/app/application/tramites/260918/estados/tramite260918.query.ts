import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite260918State } from './tramite260918.store';
import { Tramite260918Store } from './tramite260918.store';
 
@Injectable({ providedIn: 'root' })
export class Tramite260918Query extends Query<Tramite260918State> {
  

  /**
   * Selector para obtener todo el estado de Tramite260911.
   */
  selectTramite260918$ = this.select((state) => state);
 /**
   * Constructor del servicio de consulta.
   * @param tramiteStore Instancia del store de Tramite260911.
   */
  /**
   * Obtiene los datos de la tabla de fabricantes.
   * @returns {Observable<Fabricante[]>} Los datos de los fabricantes
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * Obtiene los datos de la tabla de destinatarios finales.
   * @returns {Observable<Destinatario[]>} Los datos de los destinatarios finales
   */
  public getDestinatarioFinalTablaDatos$ = this.select(
    (state) => state.destinatarioFinalTablaDatos
  );

  /**
   * Obtiene los datos de la tabla de proveedores.
   * @returns {Observable<Proveedor[]>} Los datos de los proveedores
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * Obtiene los datos de la tabla de facturadores.
   * @returns {Observable<Facturador[]>} Los datos de los facturadores
   */
  public getFacturadorTablaDatos$ = this.select(
    (state) => state.facturadorTablaDatos
  );


  constructor(protected override store: Tramite260918Store) {
    super(store);
  }
}