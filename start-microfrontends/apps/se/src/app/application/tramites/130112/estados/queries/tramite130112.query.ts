import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Tramite130112State, Tramite130112Store } from '../tramites/tramites130112.store';

/**
 * @descripcion
 * Clase que implementa las consultas (queries) para el estado del trámite 130112.
 * Proporciona selectores para acceder a diferentes partes del estado almacenado en el store.
 *
 * @decorador @Injectable
 */
@Injectable({ providedIn: 'root' })
export class Tramite130112Query extends Query<Tramite130112State> {
  /**
   * Observable para seleccionar el estado completo del trámite.
   * Estado completo del trámite.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable para seleccionar el valor de `mostrarTabla` del estado.
   * Valor booleano de `mostrarTabla`.
   */
  mostrarTabla$ = this.select((state) => state.mostrarTabla);


  /**
   * @descripcion
   * Constructor de la clase `Tramite130112Query`.
   * Inicializa la consulta con el store proporcionado.
   * @param {Tramite130112Store} store - Instancia del store del trámite 130112.
   */
  constructor(protected override store: Tramite130112Store) {
    super(store);
  }
}