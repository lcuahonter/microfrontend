import {
  Solicitud230202State,
  Tramite230202Store,
} from './tramite230202.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite230202Query extends Query<Solicitud230202State> {

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite230202Store) {
    super(store);
  }

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}
