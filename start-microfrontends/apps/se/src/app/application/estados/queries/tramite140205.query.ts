import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite140205State } from '../tramites/tramite140205.store';
import { Tramite140205Store } from '../tramites/tramite140205.store';

/**
 * Servicio de consulta para el estado del trámite 140205.
 * 
 * Este servicio permite realizar consultas al estado del trámite 140205 utilizando Akita.
 */
@Injectable({ providedIn: 'root' })
export class Tramite140205Query extends Query<Tramite140205State> {

  /**
   * Observable que selecciona el estado completo del trámite.
   * 
   * Este observable emite el estado actual del trámite 140205.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite140205Query.
   * 
   * @param {Tramite140205Store} store - El store que contiene el estado del trámite 140205.
   */
  constructor(
    protected override store: Tramite140205Store) {
    super(store);
  }
}