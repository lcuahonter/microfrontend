import { Solicitud32514State, Tramite32514Store } from './Tramite32514.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 32514.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32514Query extends Query<Solicitud32514State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite32514Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite32514Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   * @returns Un observable que emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
}