import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud110218State } from '../tramites/tramite110218.store';
import { Tramite110218Store } from '../tramites/tramite110218.store';

import { Observable } from 'rxjs';

/**
 * @class Tramite110218Query
 * @extends Query<Solicitud110218State>
 * @description
 * Clase de consulta (`Query`) que permite acceder al estado del trámite 110218 de forma reactiva.
 * Proporciona selectores observables para consumir el estado desde componentes o servicios.
 *
 * Utiliza Akita para la gestión eficiente del estado global en aplicaciones Angular.
 *
 * @example
 * ```ts
 * this.tramite110218Query.selectTramite110218State$.subscribe(state => {
 *   console.log('Estado actual del trámite:', state);
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class Tramite110218Query extends Query<Solicitud110218State> {

  /**
   * @property {Observable<Solicitud110218State>}
   * @name selectTramite110218State$
   * @description
   * Observable que emite el estado completo del trámite 110218.
   * Se puede suscribir para obtener los datos actualizados del estado en tiempo real.
   */
  selectTramite110218State$ = this.select((state) => state);

  /**
   * Obtiene el valor seleccionado de la radio
   * @returns Observable<string | number>
   */
  public get valorSeleccionado$(): Observable<string | number> {
    return this.select('valorSeleccionado');
  }  

  /**
   * @constructor
   * @param {Tramite110218Store} store - Instancia del store que contiene el estado del trámite 110218.
   * @description
   * Inicializa la clase de consulta con la instancia del store correspondiente.
   */
  constructor(
    protected override store: Tramite110218Store
  ) {
    super(store);
  }

}
