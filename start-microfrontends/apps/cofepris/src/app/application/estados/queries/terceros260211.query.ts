import { Terceros260211State, Terceros260211Store } from '../tramites/terceros260211.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Terceros260211Query extends Query<Terceros260211State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Terceros260211Store) {
    super(store);
  }
}