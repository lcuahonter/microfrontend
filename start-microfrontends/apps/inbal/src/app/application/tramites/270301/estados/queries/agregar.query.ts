import { Injectable } from '@angular/core';
import { Solicitud270301State } from '../tramites/agregar270301.store';

import { Agregar270301Store } from '../tramites/agregar270301.store'; 
import { Query } from '@datorama/akita';

/**
 * @description Servicio para realizar consultas sobre el estado de la solicitud 270301.
 */
@Injectable({ providedIn: 'root' })
export class AgregarQuery extends Query<Solicitud270301State> {
  
  /**
   * @description Selecciona el estado completo de la solicitud.
   * @returns Un observable con el estado actual de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @description Constructor de la clase AgregarQuery.
   * @param agrergarstore Instancia del store que contiene el estado de la solicitud.
   */
  constructor(private agrergarstore: Agregar270301Store) {
    super(agrergarstore);
  }
}