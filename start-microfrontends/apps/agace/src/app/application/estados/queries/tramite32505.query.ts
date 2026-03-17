
import { Solicitud32505State, Tramite32505Store } from '../tramites/trimite32505.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite32505Query extends Query<Solicitud32505State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite32505Store) {
    super(store);
  }
}
