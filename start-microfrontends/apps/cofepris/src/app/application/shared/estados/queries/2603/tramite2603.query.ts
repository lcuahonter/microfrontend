import { Solicitud2603State, Tramite2603Store } from '../../stores/2603/tramite2603.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud2603.
 */
@Injectable({ providedIn: 'root' })
export class Tramite2603Query extends Query<Solicitud2603State> {
  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud2603State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
 fabricantes$ = this.select(state => state.fabricantetabla);
  otros$ = this.select(state => state.otrosTabla);
  /**
   * Observable to select the scianTabla data.
   * @returns {Observable<ScianDatos[]>} The scianTabla data.
   */
  scianTabla$ = this.select((state) => state.scianTabla);

  /**
   * Observable to select the mercanciasTabla data.
   * @returns {Observable<MercanciasDatos[]>} The mercanciasTabla data.
   */
  mercanciasTabla$ = this.select((state) => state.mercanciasTabla);

  proveedoresTabla$ = this.select(state => state.proveedorTablaDatos);

  facturasTabla$ = this.select(state => state.facturadorTablaDatos);

  certificadosTabla$ = this.select(state => state.certificadoAnaliticoTablaDatos);

  /**
   * Constructor for Tramite2603Query.
   * @param {Tramite2603Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Tramite2603Store) {
    super(store);
  }
}