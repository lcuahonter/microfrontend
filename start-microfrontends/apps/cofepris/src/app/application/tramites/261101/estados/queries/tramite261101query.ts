import {
  Solicitud261101State,
  Tramite261101Store,
} from '../tramites/tramite261101store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Servicio disponible a nivel global (root) para inyección de dependencias.
 */
@Injectable({ providedIn: 'root' })
export class Tramite261101Query extends Query<Solicitud261101State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
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

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite261101Store) {
    super(store);
  }
}
