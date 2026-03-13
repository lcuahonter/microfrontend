import { Solicitud32614PerfilesState, Tramite32614PerfilesStore } from '../tramites/tramite32614_perfiles.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite32614PerfilesQuery
 * @description
 * Servicio que permite realizar consultas sobre el estado de la solicitud 32614 
 * en la sección de Perfiles. Utiliza Akita para gestionar el estado reactivo.
 */
@Injectable({ providedIn: 'root' })
export class Tramite32614PerfilesQuery extends Query<Solicitud32614PerfilesState> {

  /**
   * @property {Observable<Solicitud32614PerfilesState>} selectSolicitud$
   * @description
   * Observable que emite el estado completo de la solicitud de perfiles del trámite 32614.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Constructor que inyecta el store correspondiente para inicializar la consulta del estado.
   * @param {Tramite32614PerfilesStore} store - El store que contiene el estado de la solicitud 32614 para perfiles.
   */
  constructor(protected override store: Tramite32614PerfilesStore) {
    super(store);
  }
}
