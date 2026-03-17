import { Expedicion120204State, Expedicion120204Store } from '../../estados/tramites/expedicion120204.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el estado de la entidad `Expedicion120204State`.
 * 
 * Proporciona flujos observables para las propiedades del estado, como 
 * `entidadFederativa` y `representacionFederal`.
 * 
 * @extends Query<Expedicion120204State>
 */
@Injectable({ providedIn: 'root' })
export class Expedicion120204Query extends Query<Expedicion120204State> {
    /**
   * Selecciona el estado completo de la solicitud
   * @type {Observable<Expedicion120204State>}
  selectSolicitud$ = this.select((state) => {
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  /**
   * Constructor de la clase `Expedicion120204Query`.
   * 
   * @param store - Instancia del almacén `Expedicion120204Store` que contiene 
   * el estado de la entidad.
   */
  constructor(
    protected override store: Expedicion120204Store) {
    super(store);
  }
}
