import { Solicitud260919State, Solicitud260919Store, } from './tramites260919.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Solicitud260919Query extends Query<Solicitud260919State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Solicitud260919Store) {
    super(store);
  }
}
