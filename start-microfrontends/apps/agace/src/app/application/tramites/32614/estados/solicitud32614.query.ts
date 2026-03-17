import { Solicitud32614State, Solicitud32614Store } from './solicitud32614.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32614.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32614Query extends Query<Solicitud32614State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32614.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32614Store) {
    super(store);
  }
}
