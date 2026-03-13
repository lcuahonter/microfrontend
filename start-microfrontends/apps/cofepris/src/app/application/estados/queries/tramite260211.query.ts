
import { Solicitud260211State, Tramite260211Store } from '../tramites/tramite260211.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260211Query extends Query<Solicitud260211State> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260211State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite31601Query.
   * @param {Tramite260211Store} store - The store that holds the state of Solicitud260211.
   */
  constructor(
    protected override store: Tramite260211Store) {
    super(store);
  }
}