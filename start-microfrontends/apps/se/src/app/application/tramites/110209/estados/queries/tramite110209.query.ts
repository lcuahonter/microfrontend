/**
 * Esta es la consulta 110209
 */

import { Tramite110209State, Tramite110209Store } from "./../stores/tramite110209.store";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
/**
 * Clase que representa la consulta del estado del trámite 110209.
 */
export class Tramite110209Query extends Query<Tramite110209State> {

  /**
   * Observable que selecciona el estado completo del trámite 110209.
   */
  selectTramite110209$ = this.select((state) => {
    return state;
  });

  /**
   * Obtiene el valor seleccionado de la radio
   * @returns Observable<string | number>
   */
  public get valorSeleccionado$(): Observable<string | number> {
    return this.select('valorSeleccionado');
  }  

  /**
   * Constructor de la consulta.
   * @param {Tramite110209Store} store - El store del trámite 110209.
   */
  constructor(
    protected override store: Tramite110209Store) {
    super(store);
  }
}