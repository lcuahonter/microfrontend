import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud11201State } from '../estados/tramites/tramite11201.store';
import { Tramite11201Store } from '../estados/tramites/tramite11201.store';

@Injectable({ providedIn: 'root' })
export class Tramite11201Query extends Query<Solicitud11201State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite11201Store) {
    super(store);
  }
}
