/**
 * @fileoverview Query para acceso a los datos del estado del trámite 80302
 * @description Este archivo contiene la clase Query de Akita que proporciona
 * métodos de consulta reactivos para acceder al estado del trámite 80302
 * (modificaciones al programa IMMEX) en el sistema VUCEM
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

import { Solicitud80302State, Tramite80302Store } from '../tramites/tramite80302.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio Query para consultas reactivas del estado del trámite 80302
 * @class Tramite80302Query
 * @description Query de Akita que proporciona métodos de consulta reactivos
 * para acceder al estado de las solicitudes del trámite 80302. Extiende la
 * funcionalidad base de Query para ofrecer selectores específicos del dominio
 * de modificaciones al programa IMMEX
 * @extends {Query<Solicitud80302State>}
 * @injectable
 * @example
 * ```typescript
 * constructor(private tramite80302Query: Tramite80302Query) {}
 * 
 * // Suscribirse al estado completo de la solicitud
 * this.tramite80302Query.selectSolicitud$.subscribe(state => {
 *   console.log('Estado actual:', state);
 * });
 * ```
 * @see {@link Tramite80302Store} Para operaciones de escritura del estado
 * @see {@link Solicitud80302State} Para la estructura del estado
 */
@Injectable({ providedIn: 'root' })
export class Tramite80302Query extends Query<Solicitud80302State> {

  /**
   * Observable que emite el estado completo de la solicitud del trámite 80302
   * @type {Observable<Solicitud80302State>}
   * @description Selector reactivo que proporciona acceso de solo lectura al estado
   * completo de la solicitud, incluyendo todos los datos del solicitante, plantas,
   * socios, productos, contenedores y demás información requerida para el trámite
   * @readonly
   * @example
   * ```typescript
   * // Suscribirse para obtener actualizaciones del estado
   * this.tramite80302Query.selectSolicitud$.subscribe(solicitud => {
   *   console.log('ID Solicitud:', solicitud.idSolicitud);
   *   console.log('Datos Solicitante:', solicitud.datosSolicitante);
   *   console.log('Plantas:', solicitud.modificacionDatos);
   * });
   * 
   * // Usar con async pipe en template
   * // <div *ngIf="tramite80302Query.selectSolicitud$ | async as solicitud">
   * //   ID: {{ solicitud.idSolicitud }}
   * // </div>
   * ```
   * @see {@link Solicitud80302State} Para la estructura completa del estado
   * @public
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor del Query del trámite 80302
   * @constructor
   * @description Inicializa el query con el store correspondiente para establecer
   * la conexión reactiva con el estado del trámite 80302
   * @param {Tramite80302Store} store - Store que contiene el estado del trámite 80302
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular DI
   * // No es necesario invocarlo manualmente
   * ```
   * @see {@link Tramite80302Store} Para operaciones de modificación del estado
   */
  constructor(
    protected override store: Tramite80302Store) {
    super(store);
  }
}
