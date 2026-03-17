import { Solicitud260915State, Solicitud260915Store } from './tramites260915.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para el estado de la solicitud 260915.
 * Permite seleccionar y observar los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud260915Query extends Query<Solicitud260915State> {

  /**
   * Observable que emite el estado completo de la solicitud 260915.
   * Se puede suscribir para obtener actualizaciones en tiempo real del estado.
   */
  selectSolicitud260915$ = this.select((state) => {
    return state;
  });
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

  /**
   * Constructor del Query.
   * @param store Instancia del store que contiene el estado de la solicitud 260915.
   */
  constructor(
    protected override store: Solicitud260915Store) {
    super(store);
  }
}