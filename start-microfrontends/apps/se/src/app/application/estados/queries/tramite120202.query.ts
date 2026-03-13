import { ExpedicionCertificadosAsignacion120202State, Tramite120202Store } from '../tramites/tramite120202.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el trámite 120202.
 * 
 * @extends Query<ExpedicionCertificadosAsignacion120202State>
 * 
 * @description
 * Este servicio proporciona métodos para seleccionar y gestionar el estado del trámite 120202.
 * 
 * @property {Observable<ExpedicionCertificadosAsignacion120202State>} selectSeccionState$ - Selecciona el estado completo de la solicitud.
 * 
 * @constructor
 * @param {Tramite120202Store} store - El almacén que contiene el estado del trámite 120202.
 */
@Injectable({ providedIn: 'root' })
export class Tramite120202Query extends Query<ExpedicionCertificadosAsignacion120202State> {

  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSeccionState$ = this.select((state) => {
    return state;
  });

  /**Guarda el estado completo del formulario de la solicitud */
  constructor(
    protected override store: Tramite120202Store) {
    super(store);
  }
}