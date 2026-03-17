import { Solicitud31601State, Tramite31601Store } from '../../estados/tramites/tramite31601.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Service to query the state of Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31601Query extends Query<Solicitud31601State> {

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud31601State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite31601Query.
   * @param {Tramite31601Store} store - The store that holds the state of Solicitud31601.
   */
  constructor(
    protected override store: Tramite31601Store) {
    super(store);
  }
}