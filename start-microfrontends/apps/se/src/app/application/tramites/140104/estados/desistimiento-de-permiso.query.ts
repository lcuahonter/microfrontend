import { Query } from '@datorama/akita';

import { Injectable } from '@angular/core';

import { DesistimientoStore, Solicitud140104State } from './desistimiento-de-permiso.store';

/**
 * Consulta para el estado de desistimiento de permiso.
 * Proporciona selectores para acceder a los datos del estado.
 */
@Injectable({
    providedIn: 'root',
})
export class DesistimientoQuery extends Query<Solicitud140104State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32610.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: DesistimientoStore) {
    super(store);
  }
}