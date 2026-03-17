
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud32607State } from './solicitud32607.store';
import { Solicitud32607Store } from './solicitud32607.store';

/**
 * Servicio de consulta (Query) para la solicitud 32607.
 * Permite acceder y suscribirse a los cambios en el estado de la solicitud.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32607Query extends Query<Solicitud32607State> {

  /**
   * Observable que selecciona y emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta de la solicitud 32607.
   * @param store - Almacén de estado de la solicitud.
   */
  constructor(
    protected override store: Solicitud32607Store) {
    super(store);
  }
}
