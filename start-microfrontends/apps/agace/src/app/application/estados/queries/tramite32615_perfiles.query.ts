import { Solicitud32615PerfilesState, Tramite32615PerfilesStore } from '../../estados/tramites/tramite32615_perfiles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32615PerfilesQuery
 * @description
 * Servicio que permite realizar consultas sobre el estado de la solicitud 32615 
 * en la sección de Perfiles. Utiliza Akita para gestionar el estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32615PerfilesQuery extends Query<Solicitud32615PerfilesState> {

  /**
   * @property {Observable<Solicitud32615PerfilesState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de perfiles del trámite 32615.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store correspondiente para inicializar la consulta del estado.
   * @param {Tramite32615PerfilesStore} store - El store que contiene el estado de la solicitud 32615 para perfiles.
   */
  constructor(protected override store: Tramite32615PerfilesStore) {
    super(store);
  }
}
