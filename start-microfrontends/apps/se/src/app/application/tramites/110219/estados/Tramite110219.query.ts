import {
  Solicitud110219State,
  Tramite110219Store,
} from './Tramite110219.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 110219.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite110219Query extends Query<Solicitud110219State> {
  /**
   * Constructor de la clase.
   * Inicializa la consulta con la tienda que contiene el estado del trámite.
   * 
   * @param store Instancia de la tienda `Tramite110219Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite110219Store) {
    super(store);
  }

  /**
   * Selecciona todo el estado de la solicitud.
   * 
   * @returns Un observable que emite el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Selecciona la lista de países asociados al trámite.
   * 
   * @returns Un observable que emite la lista de países.
   */
  selectPais$ = this.select((state) => state.pais);

  /**
   * Selecciona la lista de tratados asociados al trámite.
   * 
   * @returns Un observable que emite la lista de tratados.
   */
  selectTratado$ = this.select((state) => state.tratado);
}