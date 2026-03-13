import {
  Solicitud301State,
  Tramite301Store,
} from '../../core/estados/tramite301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite301Query extends Query<Solicitud301State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Guarda el estado completo del formulario de la solicitud 
   */
  constructor(protected override store: Tramite301Store) {
    super(store);
  }
}
