import { Solicitud260304State, Tramite260304Store } from '../stores/tramite260304.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260304.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260304Query extends Query<Solicitud260304State> {
  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260304State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable to select the complete state of the tramite.
   * @returns {Observable<Solicitud260304State>} The complete state of the tramite.
   */
  selectTramite260304State$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260304Query.
   * @param {Tramite260304Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Tramite260304Store) {
    super(store);
  }
}