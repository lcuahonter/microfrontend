import {
  Tramite230301State,
  Tramite230301Store,
} from '../tramites/tramites230301.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class Tramite230301Query extends Query<Tramite230301State> {

  /**
   * Observable that selects the entire request state.
   * @type {Observable<Tramite230301State>}
   */
  selectSolicitud$: Observable<Tramite230301State> = this.select();

  /**
   * Observable that selects the previous folio from the state.
   */
  selectFolioAnterior$ = this.select('folioAnterior');

  /**
   * Observable that selects the request type from the state.
   */
  selectTipoSolicitud$ = this.select('tipoSolicitud');

  /**
   * Observable that selects the withdrawal reason from the state.
   */
  selectMotivoDesistimiento$ = this.select('motivoDesistimiento');

  /**
   * Observable that selects the previous request ID from the state.
   */
  selectSolicitudAnterior$ = this.select('solicitudAnterior');

  /**
   * Observable that selects the current request ID from the state.
   */
  selectIdSolicitud$ = this.select('idSolicitud');


  /**
   * Constructor for the `Tramite230301Query` class.
   * Initializes the query with the provided store.
   * @param {Tramite230301Store} store - Store containing the request state.
   */
  constructor(
    protected override store: Tramite230301Store
  ) {
    super(store);
  }
}