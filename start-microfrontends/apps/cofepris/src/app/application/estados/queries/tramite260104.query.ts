
import { Solicitud260104State, Tramite260104StoreDos } from '../tramites/tramite260104.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Consulta para el estado de la solicitud 260104.
 * 
 * Esta clase extiende de `Query` y permite seleccionar y observar el estado de la solicitud
 * a través de la propiedad observable `selectSolicitud$`.
 * 
 * @providedIn 'root' - El servicio está disponible a nivel de aplicación.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260104Query extends Query<Solicitud260104State> {

  /**
   * Observable que selecciona y emite el estado completo relacionado con la solicitud.
   * 
   * @returns Observable que emite el estado actual de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

 
  /**
   * Crea una nueva instancia de la clase e inicializa el store proporcionado.
   * 
   * @param store - Instancia de Tramite260104StoreDos utilizada para manejar el estado de la aplicación.
   */
  constructor(
    protected override store: Tramite260104StoreDos) {
    super(store);
  }
}