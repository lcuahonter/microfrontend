import { Solicitud120301State, Tramite120301Store } from '../tramites/tramite120301.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 120301.
 * 
 * @extends Query<Solicitud120301State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 120301.
 * 
 * @property {Observable<Solicitud120301State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite120301Store} store - El almacén que contiene el estado del trámite 120301.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120301Query extends Query<Solicitud120301State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite120301Store) {
    super(store);
  }
}