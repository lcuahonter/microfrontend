import {
  Tramite420101State,
  Tramite420101Store,
} from './tramite420101Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class
 * @name Tramite420101Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 420101.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite420101State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite420101Query extends Query<Tramite420101State> {
  
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite420101Store} store - La tienda que contiene el estado del trámite 420101.
   */
  constructor(protected override store: Tramite420101Store) {
    super(store);
  }

  /**
   * @property {Observable<Tramite420101State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 420101.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<any>} getDatosProveedoresManual$
   * @description
   * Selecciona los datos de los proveedores manuales del estado.
   * Este observable emite los valores almacenados en `datosProveedoresManual`.
   */
  public getDatosProveedoresManual$ = this.select(
    (state) => state.datosProveedoresManual
  );

  /**
   * @property {Observable<any>} getDatosTabla$
   * @description
   * Selecciona los datos de la propiedad `datosTabla` del estado.
   * Este observable emite los valores almacenados en `datosTabla`.
   */
  public getDatosTabla$ = this.select((state) => state.datosTabla);
  /**
   * @property {Observable<any>} getNormaDatos$
   * @description
   * Selecciona los datos relacionados con el uso de la lista cruzada (`usoCrossListDatos`) del estado.
   * Este observable emite los valores almacenados en `usoCrossListDatos`.
   */
  public getNormaDatos$ = this.select((state) => state.usoCrossListDatos);

  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
}
