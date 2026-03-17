import { Solicitud32508State, Tramite32508Store } from './Tramite32508.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 32508.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32508Query extends Query<Solicitud32508State> {
  /**
   * Constructor de la clase.
   * @param store Instancia de la tienda `Tramite32508Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite32508Store) {
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