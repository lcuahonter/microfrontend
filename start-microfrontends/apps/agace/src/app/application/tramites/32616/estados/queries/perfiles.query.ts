import { Solicitud32616PerfilesState, Tramite32616PerfilesStore } from '../../estados/tramites/tramite32616_perfiles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32616PerfilesQuery
 * @description
 * Servicio que permite realizar consultas sobre el estado de la solicitud 32616 
 * en la sección de Perfiles. Utiliza Akita para gestionar el estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32616PerfilesQuery extends Query<Solicitud32616PerfilesState> {

  /**
   * @property {Observable<Solicitud32616PerfilesState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de perfiles del trámite 32616.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store correspondiente para inicializar la consulta del estado.
   * @param {Tramite32616PerfilesStore} store - El store que contiene el estado de la solicitud 32616 para perfiles.
   */
  constructor(protected override store: Tramite32616PerfilesStore) {
    super(store);
  }
}
