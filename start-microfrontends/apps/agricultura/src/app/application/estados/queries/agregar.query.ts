import { Injectable } from '@angular/core';

import { Solicitud220401State } from '../../estados/tramites/agregar220401.store';

import { Agregar220401Store } from '../tramites/agregar220401.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class AgregarQuery extends Query<Solicitud220401State> {
  selectedEstado$ = this.select((state) => state.selectedEstado);
  /**
   * Selecciona el estado completo de la solicitud
   */
  
  /**Guarda el estado completo del formulario de la solicitud */

  selectSolicitud$ = this.select((state) => {
    return state;
  });
  constructor(
    private agrergarstore:Agregar220401Store ) {
    super(agrergarstore);
  }
}





