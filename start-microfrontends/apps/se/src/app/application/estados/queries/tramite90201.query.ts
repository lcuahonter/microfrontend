import {
  Solicitud90201State,
  Tramite90201Store,
} from '../tramites/tramite90201.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Consulta para gestionar y seleccionar el estado de la solicitud 90201.
 * 
 * @extends Query<Solicitud90201State>
 * @providedIn 'root'
 * 
 * @description
 * Esta clase permite seleccionar y observar el estado completo de la solicitud 90201
 * a través de un observable. Utiliza el store correspondiente para mantener y actualizar
 * el estado de la solicitud.
 * 
 * @see Tramite90201Store
 */
@Injectable({ providedIn: 'root' })
export class Tramite90201Query extends Query<Solicitud90201State> {
  /**
   * Selecciona el estado completo de la solicitud
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });


  /**
   * Crea una nueva instancia de la clase e inicializa el store específico para Tramite90201.
   * 
   * @param store - Instancia del store de Tramite90201 que será utilizada por la clase.
   */
  constructor(protected override store: Tramite90201Store) {
    super(store);
  }
}

export { Solicitud90201State };
