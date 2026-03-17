import { Solicitud260704State, Tramite260704Store } from './Tramite260704.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Clase que proporciona consultas reactivas para el estado del trámite 260704.
 * Permite seleccionar partes específicas del estado almacenado en la tienda.
 */
@Injectable({ providedIn: 'root' })
export class Tramite260704Query extends Query<Solicitud260704State> {
  /**
   * Constructor de la clase.
   * Inicializa la consulta con la tienda que contiene el estado del trámite.
   * 
   * @param store Instancia de la tienda `Tramite260704Store` que contiene el estado del trámite.
   */
  constructor(protected override store: Tramite260704Store) {
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

}