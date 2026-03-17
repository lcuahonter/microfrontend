import {
  Solicitud230201State,
  Tramite230201Store,
} from './tramite230201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite230201Query extends Query<Solicitud230201State> {

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(protected override store: Tramite230201Store) {
    super(store);
  }

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}
