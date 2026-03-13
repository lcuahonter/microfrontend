import { Solicitud261402State, Tramite261402Store } from './tramite261402.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Solicitud261402.
 */
@Injectable({ providedIn: 'root' })
export class Tramite261402Query extends Query<Solicitud261402State> {
  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud261402State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable to select the complete state of the tramite.
   * @returns {Observable<Solicitud261402State>} The complete state of the tramite.
   */
  selectTramite261402State$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite261402Query.
   * @param {Tramite261402Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Tramite261402Store) {
    super(store);
  }
}