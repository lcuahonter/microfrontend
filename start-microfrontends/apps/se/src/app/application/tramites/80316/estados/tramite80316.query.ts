import { Solicitud80316State, Tramite80316Store } from './tramite80316.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite80316Query extends Query<Solicitud80316State> {

  
  /**
   * Observable selector for retrieving the entire state.
   */
  allStoreData$ = this.select((state) => state);

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite80316Store) {
    super(store);
  }
}
