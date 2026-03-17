
import { Solicitud130301State, Tramite130301Store } from '../tramites/tramite130301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado de la Solicitud31601.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130301Query extends Query<Solicitud130301State> {

  /**
   * Observable para seleccionar el estado completo de la solicitud.
   * @returns {Observable<Solicitud130301State>} El estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor para Tramite130301Store.
   * @param {Tramite130301Store} store - La tienda que contiene el estado de Solicitud130301.
   */
  constructor(
    protected override store: Tramite130301Store) {
    super(store);
  }
}