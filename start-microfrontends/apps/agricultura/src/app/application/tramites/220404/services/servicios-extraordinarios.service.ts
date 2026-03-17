/**
 * @fileoverview
 * Este archivo define el servicio `ServiciosExtraordinariosService`, que proporciona métodos para gestionar
 * los datos relacionados con servicios extraordinarios en el trámite 220404. Incluye operaciones para obtener
 * datos desde un servidor remoto y manejar errores en las solicitudes HTTP.
 * 
 * @module ServiciosExtraordinariosService
 * @description
 * Este archivo contiene la implementación del servicio `ServiciosExtraordinariosService`, que interactúa con
 * un servidor remoto para manejar los datos de servicios extraordinarios.
 */

import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';

/**
 * @interface JSONResponse
 * @description
 * Representa la estructura de la respuesta JSON obtenida desde el servidor.
 */
export interface JSONResponse {
  /**
   * Identificador único del recurso.
   * @type {number}
   */
  id: number;

  /**
   * Descripción del recurso.
   * @type {string}
   */
  descripcion: string;

  /**
   * Código asociado al recurso.
   * @type {string}
   */
  codigo: string;

  /**
   * Datos adicionales del recurso.
   * @type {string}
   */
  data: string;
}

/**
 * @class ServiciosExtraordinariosService
 * @description
 * Servicio que gestiona los datos relacionados con servicios extraordinarios en el trámite 220404.
 * Proporciona métodos para realizar solicitudes HTTP y manejar los datos obtenidos.
 */
@Injectable({
  providedIn: 'root',
})
export class ServiciosExtraordinariosService {
  /**
   * URL base del servidor para obtener datos auxiliares en formato JSON.
   * Se asigna desde la configuración en el archivo de entorno (`environment`).
   * 
   * @type {string}
   */
  urlServer: string = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a servicios externos.
   */
  constructor(private http: HttpClient) {
    /** El constructor está intencionalmente vacío para la inyección de dependencias. */
  }

  /**
   * Obtiene los datos de un trámite específico desde el servidor.
   * 
   * Realiza una solicitud HTTP GET para recuperar los datos del trámite con el identificador proporcionado.
   * 
   * @param {number} id - Identificador único del trámite a obtener.
   * @returns {Observable<JSONResponse>} Observable que emite los datos del trámite en formato JSON.
   * 
   * @example
   * // Ejemplo de uso:
   * this.serviciosExtraordinariosService.obtenerTramite(1).subscribe((response) => {
   *   console.log(response);
   * });
   */
  obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}