
import { Solicitud260906State, Tramite260906Store } from '../tramites/tramite260906.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260906Query extends Query<Solicitud260906State> {
  /**

   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260906State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite31601Query.
   * @param {Tramite260906Store} store - The store that holds the state of Solicitud260906.
   */
  constructor(
    protected override store: Tramite260906Store) {
    super(store);
  }
}