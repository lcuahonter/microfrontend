import { Mercancias110202State, Mercancias110202Store } from './mercancias.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Mercancias110202Query extends Query<Mercancias110202State> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Mercancias110202State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite31601Query.
   * @param {Mercancias31601Store} store - The store that holds the state of Solicitud31601.
   */
  constructor(
    protected override store: Mercancias110202Store) {
    super(store);
  }
}