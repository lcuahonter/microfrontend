import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud32401State } from './tramite32401.store';
import { Tramite32401Store } from './tramite32401.store';
/**
 * Servicio que proporciona consultas al estado de la solicitud 32401.
 * Extiende la funcionalidad de la clase Query para seleccionar datos del estado.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32401Query extends Query<Solicitud32401State> {

  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite suscribirse a cambios en el estado.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del servicio de consulta.
   * Inyecta y configura el store que contiene el estado del trámite 32401.
   * @param store El store que maneja el estado de la solicitud 32401.
   */
  constructor(
    protected override store: Tramite32401Store) {
    super(store);
  }
}
