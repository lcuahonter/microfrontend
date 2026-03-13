import {
  Solicitud90303State,
  Tramite90303Store,
} from './Tramite90303.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 90303.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite90303Query extends Query<Solicitud90303State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite90303Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite90303Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

}