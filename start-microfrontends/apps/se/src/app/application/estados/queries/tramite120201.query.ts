import { Cupos120201State, Tramite120201Store } from '../tramites/tramite120201.store';

import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 120201.
 * 
 * @extends Query<Cupos120201State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 120201.
 * 
 * @property {Observable<Cupos120201State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite120201Store} store - El almacén que contiene el estado del trámite 120201.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120201Query extends Query<Cupos120201State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite120201Store) {
    super(store);
  }
}