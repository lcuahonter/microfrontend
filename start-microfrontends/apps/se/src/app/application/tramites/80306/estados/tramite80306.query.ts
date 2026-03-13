import { Tramite80306Store, TramiteState } from './tramite80306.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Consulta reactiva para el estado del trámite 80306.
 * Proporciona selectores para acceder a diferentes partes del estado.
 *
 * @export
 * @class Tramite80306Query
 * @extends {Query<TramiteState>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite80306Query extends Query<TramiteState> {
  /**
   * Observable que emite el estado actual del trámite.
   * @type {Observable<string>}
   */
  selectEstado$ = this.select((state) => {
    return state.estado;
  });

  /**
   * Observable que indica si todos los campos del formulario son válidos.
   * @type {Observable<boolean>}
   */
  FormaValida$ = this.select((state) => {
   return Object.values(state.formaValida).every(value => value === true);
  })

  /**
   * Observable que emite el estado de la búsqueda de domicilios.
   * @type {Observable<boolean>}
   */
  selectBuscarDomicilios$ = this.select((state) => {
    return state.buscarDomicilios;
  });

  /**
   * Observable que emite la lista de domicilios.
   * @type {Observable<any[]>}
   */
  selectDomicilios$ = this.select((state) => {
    return state.domicilios;
  });

  /**
   * Observable que emite el estado de alta de planta.
   * @type {Observable<any>}
   */
  selectAltaPlanta$ = this.select((state) => {
    return state.altaPlanta;
  });

  /**
   * Observable que emite el estado completo del trámite.
   * @type {Observable<TramiteState>}
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite80306Query.
   * @param store Instancia del store de Akita para el trámite 80306.
   */
  constructor(protected override store: Tramite80306Store) {
    super(store);
  }
}
