import { Solicitud120501State, Tramite120501Store } from '../../estados/tramites/tramite120501.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite120501Query extends Query<Solicitud120501State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite120501Store) {
    super(store);
  }
}
