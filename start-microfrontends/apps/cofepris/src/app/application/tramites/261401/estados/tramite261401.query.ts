import { Solicitud261401State, Tramite261401Store } from './tramite261401.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud261401.
 */
@Injectable({ providedIn: 'root' })
export class Tramite261401Query extends Query<Solicitud261401State> {

  /**
   * Observable to select the observaciones field from the state.
   * @returns {Observable<string>} Observaciones value.
   */
  selectObservaciones$ = this.select((state) => state.observaciones ?? '');

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud261401State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable to select the destinatarios table from the state.
   * @returns {Observable<Destinatario[]>} Array of destinatarios.
   */
  selectDestinatarios$ = this.select((state) => {
    return state.destinatarios || [];
  });

  /**
   * Observable to select the scian table from the state.
   * @returns {Observable<ScianDatos[]>} Array of SCIAN data.
   */
  selectScianTabla$ = this.select((state) => {
    return state.scianTabla || [];
  });

  /**
   * Observable to select the mercancia table from the state.
   * @returns {Observable<MercanciasDatos[]>} Array of mercancia data.
   */
  selectMercanciaTabla$ = this.select((state) => {
    return state.mercanciaTabla || [];
  });

  /**
   * Constructor for Tramite261401Query.
   * @param {Tramite261401Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Tramite261401Store) {
    super(store);
  }
}