import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite260911State } from './tramite260911.store';
import { Tramite260911Store } from './tramite260911.store';

/**
 * Servicio de consulta para el estado de Tramite260911.
 * Proporciona selectores para acceder a las propiedades del estado de manera reactiva.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260911Query extends Query<Tramite260911State> {
  /**
   * Selector para obtener todo el estado de Tramite260911.
   */
  selectTramite260911$ = this.select((state) => state);


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


  /**
   * Constructor del servicio de consulta.
   * @param tramiteStore Instancia del store de Tramite260911.
   */
  constructor(protected override store: Tramite260911Store) {
    super(store);
  }
}