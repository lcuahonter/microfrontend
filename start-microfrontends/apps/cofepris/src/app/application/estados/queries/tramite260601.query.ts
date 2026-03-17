import { AvisoSanitarioState, Tramite260601Store } from '../tramites/tramite260601.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 260601.
 * 
 * @extends Query<AvisoSanitarioState>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 260601.
 * 
 * @property {Observable<AvisoSanitarioState>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite260601Store} store - El almacén que contiene el estado del trámite 260601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260601Query extends Query<AvisoSanitarioState> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

    /**
   * @property {Observable<Proveedor[]>} getProveedorTablaDatos$
   * @description
   * Observable que emite el arreglo de proveedores almacenados en el estado.
   */
  public getProveedorTablaDatos$ = this.select(
    (state) => state.proveedorTablaDatos
  );

  /**
   * @property {Observable<Fabricante[]>} getFabricanteTablaDatos$
   * @description
   * Observable que emite el arreglo de fabricantes almacenados en el estado.
   */
  public getFabricanteTablaDatos$ = this.select(
    (state) => state.fabricanteTablaDatos
  );

  /**
   * @property {Observable<number>} getTabSeleccionado$
   * @description
   * Observable que emite el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite260601Store) {
    super(store);
  }
}