/**
 * Servicio de consulta para el estado de Tramite130119.
 */
import { Tramite130119State, Tramite130119Store } from "../store/tramite130119.store";
import { Injectable } from "@angular/core";
import { Query } from '@datorama/akita';

/**
 * Servicio de consulta para el estado de Tramite130119.
 */
@Injectable({ providedIn: 'root' })
export class Tramite130119Query extends Query<Tramite130119State> {

  /**
   * Observable que selecciona el estado completo del trámite 130119.
   */
  selectTramite130119$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la consulta.
   * 
   * @param {Tramite130119Store} store - El store del trámite 130119.
   */
  constructor(
    protected override store: Tramite130119Store) {
    super(store);
  }
}