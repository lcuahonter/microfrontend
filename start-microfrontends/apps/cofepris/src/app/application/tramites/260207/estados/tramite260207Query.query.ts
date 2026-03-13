import {
  Tramite260207State,
  Tramite260207Store,
} from './tramite260207Store.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class
 * @name Tramite260207Query
 * @description
 * Clase que proporciona consultas para acceder al estado del trámite 260207.
 * Extiende la clase `Query` de Akita para realizar selecciones del estado almacenado.
 *
 * @extends {Query<Tramite260207State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite260207Query extends Query<Tramite260207State> {
  /**
   * @constructor
   * @description
   * Inicializa la consulta con la tienda correspondiente.
   *
   * @param {Tramite260207Store} store - La tienda que contiene el estado del trámite 260207.
   */
  constructor(protected override store: Tramite260207Store) {
    super(store);
  }
  /**
   * @property {Observable<Tramite260207State>} selectTramiteState$
   * @description
   * Selecciona el estado completo del trámite 260207.
   */
  selectTramiteState$ = this.select((state) => {
    return state;
  });

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
  /**
   * @property {Observable<number | undefined>} getTabSeleccionado$
   * @description
   * Selecciona el índice de la pestaña actualmente seleccionada en el estado.
   */
  public getTabSeleccionado$ = this.select((state) => state.tabSeleccionado);
}
