import { Solicitud260509State, Tramite260509Store } from '../../tramites/260509/tramite260509.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
/**
 * Service to query the state of Solicitud260303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260509Query extends Query<Solicitud260509State> {

  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Observable to select the complete state of the solicitud.
   * @returns {Observable<Solicitud260509State>} The complete state of the solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor for Tramite260509Query.
   * @param {Tramite260509Store} store - The store that holds the state of Solicitud260509.
   */
  constructor(
    protected override store: Tramite260509Store) {
    super(store);
  }
}