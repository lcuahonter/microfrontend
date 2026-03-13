import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite260219State } from './tramite260219Store.store';
import { Tramite260219Store } from './tramite260219Store.store';

/**
 * @class
 * @name Tramite260219Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260219.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260219State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite260219Query extends Query<Tramite260219State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260219Store} store - La tienda que contiene el estado del trámite 260219.
   */
  constructor(protected override store: Tramite260219Store) {
    super(store);
  }
  /**
   * @property {Observable<Tramite260219State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 260219.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);

  /**
   * Observable que selecciona y retorna datos de terceros desde el estado.
   * @returns {Observable<TercerosRelacionadosDatos>} 
   * Un observable con los datos de fabricante, destinatario final, proveedor y facturador.
   */
  public getTercerosDatos$ = this.select((state) => ({
    fabricanteTablaDatos: state.fabricanteTablaDatos,
    destinatarioFinalTablaDatos: state.destinatarioFinalTablaDatos,
    proveedorTablaDatos: state.proveedorTablaDatos,
    facturadorTablaDatos: state.facturadorTablaDatos,
  }));
}
