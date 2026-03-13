import { RegistroDeDonacion10303State, Tramite10303Store } from '../tramites/tramite10303.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 10303.
 * 
 * @extends Query<RegistroDeDonacion10303State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 10303.
 * 
 * @property {Observable<RegistroDeDonacion10303State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite10303Store} store - El almacén que contiene el estado del trámite 10303.
 */
@Injectable({ providedIn: 'root' })
export class Tramite10303Query extends Query<RegistroDeDonacion10303State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite10303Store) {
    super(store);
  }
}