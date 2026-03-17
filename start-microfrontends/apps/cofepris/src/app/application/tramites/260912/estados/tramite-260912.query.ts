import { Tramite260912Store, Tramites260912State } from './tramite-260912.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @description
 * Clase que extiende de Akita Query para gestionar las consultas al estado de Tramite260912.
 * Proporciona selectores para acceder a los atributos del estado de manera reactiva.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260912Query extends Query<Tramites260912State> {
  /**
     * Selector para obtener todo el estado de Tramite260911.
     */
    selectTramite260912$ = this.select((state) => state);

    
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
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

  
    /**
     * Constructor del servicio de consulta.
     * @param tramiteStore Instancia del store de Tramite260911.
     */
    constructor(protected override store: Tramite260912Store) {
      super(store);
    }
  }