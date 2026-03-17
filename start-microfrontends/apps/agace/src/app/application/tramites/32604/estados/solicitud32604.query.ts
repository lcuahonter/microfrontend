import { Solicitud32604State, Solicitud32604Store } from './solicitud32604.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta (Query) para la solicitud 32604.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32604Query extends Query<Solicitud32604State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32604.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32604Store) {
    super(store);
  }
}
