
import { Solicitud11202State, Solicitud11202Store } from './solicitud11202.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


@Injectable({ providedIn: 'root' })
export class Solicitud11202Query extends Query<Solicitud11202State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud11202Store) {
    super(store);
  }
}
