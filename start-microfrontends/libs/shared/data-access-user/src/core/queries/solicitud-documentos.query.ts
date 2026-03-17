
import { SolicitudDocumentosState, SolicitudDocumentosStore } from '../estados/solicitud-documentos.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @injectable
 * @name SolicitudDocumentosQuery
 * @description Servicio de consulta (Query) de Akita para gestionar y observar el estado de la solicitud de documentos.
 * 
 * Este servicio permite acceder al estado completo de la solicitud de documentos a través del observable `selectSolicitud$`.
 * Está diseñado para ser inyectado en toda la aplicación mediante el decorador `@Injectable` con el alcance `root`.
 */
@Injectable({ providedIn: 'root' })
export class SolicitudDocumentosQuery extends Query<SolicitudDocumentosState> {
  /**
   * @property {Observable<SolicitudDocumentosState>} selectSolicitud$ - Observable que emite el estado actual de la solicitud de documentos.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
  /**
   * @constructor
   * @param {SolicitudDocumentosStore} store - Store de Akita que contiene el estado de la solicitud de documentos.
   */
  constructor(
    protected override store: SolicitudDocumentosStore) {
    super(store);
  }
}