import { Solicitud31616PerfilesState, Tramite31616PerfilesStore } from '../../estados/tramites/tramite31616_perfiles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite31616PerfilesQuery
 * @description
 * Servicio que permite realizar consultas sobre el estado de la solicitud 31616 
 * en la sección de Perfiles. Utiliza Akita para gestionar el estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class Tramite31616PerfilesQuery extends Query<Solicitud31616PerfilesState> {

  /**
   * @property {Observable<Solicitud31616PerfilesState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de perfiles del trámite 31616.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store correspondiente para inicializar la consulta del estado.
   * @param {Tramite31616PerfilesStore} store - El store que contiene el estado de la solicitud 31616 para perfiles.
   */
  constructor(protected override store: Tramite31616PerfilesStore) {
    super(store);
  }
}
