import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud32501State } from './solicitud32501.store';
import { Solicitud32501Store } from './solicitud32501.store';

/** 
 * Servicio de consulta para la solicitud 32501. 
 * Proporciona acceso al estado de la solicitud almacenado en Akita.
 */
@Injectable({ providedIn: 'root' })
export class Solicitud32501Query extends Query<Solicitud32501State> {

  /** 
   * Observable que selecciona el estado completo de la solicitud 32501. 
   */
  seleccionarSolicitud$ = this.select((state) => {
    return state;
  });

  /** 
   * Constructor del servicio de consulta. 
   * @param store Almacén de datos de la solicitud 32501.
   */
  constructor(
    protected override store: Solicitud32501Store) {
    super(store);
  }
}
