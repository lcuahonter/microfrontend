/**
 * @fileoverview Servicio para la gestión de asignaciones de solicitantes.
 * Este servicio maneja la lógica para obtener los datos de asignación de solicitantes.
 * @module SolicitanteasigncionserviceService
 */

import { CATALOGO_ANOS, COMUN_URL,OFICIO_ASIGNACION } from '../../servers/api-router';
import { BaseResponse } from '../../models/shared/base-response.model';
import { Catalogo } from '../../models/shared/catalogos.model';
import { HttpCoreService } from '../shared/http/http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para la gestión de asignaciones de solicitantes.
 * @providedIn root
 */
@Injectable({
  providedIn: 'root'
})
export class SolicitanteasigncionserviceService {

  /**
   * URL base del host para todas las consultas de catálogos.
   *
   * Esta propiedad almacena la URL base configurada desde las variables de entorno
   * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
   *
   * @type {string}
   * @readonly
   * @since 1.0.0
   */
  host: string;

  /**
   * Constructor del servicio.
   * @param http Servicio HTTP para realizar peticiones.
   */
  constructor(private http: HttpCoreService) {
    this.host = `${COMUN_URL.BASE_URL}`;
   }

  /**
   * Obtiene los datos de asignación.
   * @returns Observable con los datos de asignación.
   */
  getAsigncion(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ANOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos del solicitante de asignación.
   * @returns Observable con los datos del solicitante de asignación.
   */
  getSolicitante(): Observable<unknown> {
    return this.http.get('assets/json/120404/getsolicitantetab.json');
  }

  /**
   * Obtiene la asignación de solicitantes para un trámite específico.
   *
   * @param tramite - Identificador del trámite para el cual se solicita la asignación de solicitantes.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
   */
  getSolicitanteAsignacion(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${OFICIO_ASIGNACION(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
}