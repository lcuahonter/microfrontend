import { Solicitud103State, Tramite103Store } from './tramite103.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Tramite103Query proporciona acceso reactivo al estado de Solicitud103.
 */
@Injectable({ providedIn: 'root' })
export class Tramite103Query extends Query<Solicitud103State> {
  /**
   * Observable que emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Crea una instancia de Tramite103Query.
   * @param store Instancia del store que contiene el estado de Solicitud103.
   */
  constructor(protected override store: Tramite103Store) {
    super(store);
  }
}