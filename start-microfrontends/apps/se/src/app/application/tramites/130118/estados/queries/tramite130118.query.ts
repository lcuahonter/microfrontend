import { Solicitud130118State, Tramite130118Store } from '../tramites/tramite130118.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 130118.
 * 
 * @extends Query<Solicitud130118State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 130118.
 * 
 * @property {Observable<Solicitud130118State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite130118Store} store - El almacén que contiene el estado del trámite 130118.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130118Query extends Query<Solicitud130118State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite130118Store) {
    super(store);
  }
}