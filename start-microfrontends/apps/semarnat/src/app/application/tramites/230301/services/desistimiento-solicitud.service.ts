import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tramite230301State, Tramite230301Store } from '../estados/tramites/tramites230301.store';
import { API_POST_GUARDAR_SOLICITUD } from '../../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { GuardarResponse } from '../../231001/models/guardar-solicitud-response';
import { Injectable } from '@angular/core';
import { RespuestaDesistimientoSolicitud } from '../models/disponsibles.model';
import { Solicitud230301Request } from '../models/solicitud-230301-request';
import { URL } from '../enum/constants';

/**
 * Servicio para el manejo de desistimiento de solicitudes del trámite 230301.
 *
 * Este servicio proporciona funcionalidades para gestionar el desistimiento de solicitudes,
 * incluyendo la obtención de datos desde el servidor, actualización del estado del formulario
 * y manejo de datos relacionados con el registro de toma de muestras de mercancías.
 *
 * @description Servicio Angular que centraliza las operaciones relacionadas con el desistimiento
 *              de solicitudes para el trámite SEMARNAT 230301.
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 *
 * @example
 * ```typescript
 * constructor(private desistimientoService: DesistimientoSolicitudService) {}
 *
 * // Obtener datos de desistimiento
 * this.desistimientoService.getDesistimientoSolicitud('archivo.json')
 *   .subscribe(response => console.log(response));
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class DesistimientoSolicitudService {
  /**
   * URL base para las solicitudes HTTP.
   *
   * @description Almacena la URL base que se utiliza como prefijo para todas las
   *              solicitudes HTTP realizadas por este servicio.
   * @type {string}
   * @readonly
   * @default URL - Valor obtenido del enum de constantes
   */
  url: string = URL;

  private readonly host: string;

  /**
   * Constructor de la clase `DesistimientoSolicitudService`.
   *
   * Inicializa el servicio HTTP para realizar solicitudes al servidor y establece
   * la referencia al store para el manejo del estado del trámite 230301.
   *
   * @description Constructor que inyecta las dependencias necesarias para el funcionamiento
   *              del servicio, incluyendo el cliente HTTP y el store de estado.
   *
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes al servidor.
   *                           Permite ejecutar operaciones GET, POST, PUT, DELETE, etc.
   * @param {Tramite230301Store} tramite230301Store - Store público para el manejo del estado
   *                                                   de las solicitudes del trámite 230301.
   *                                                   Utiliza Akita para la gestión de estado.
   *
   * @memberof DesistimientoSolicitudService
   * @since 1.0.0
   */
  constructor(
    private readonly http: HttpClient,
    public tramite230301Store: Tramite230301Store
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene los datos de desistimiento de una solicitud desde el servidor.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos de desistimiento
   * de una solicitud específica. La respuesta contiene la información necesaria para
   * procesar el desistimiento de la solicitud en el sistema VUCEM.
   *
   * @description Método que construye la URL completa concatenando la URL base con el
   *              nombre del recurso y ejecuta una petición GET tipada para obtener
   *              los datos de desistimiento.
   *
   * @param {string} name - Nombre del recurso, archivo o endpoint específico a consultar.
   *                       Debe incluir la extensión del archivo si es necesario (ej: 'datos.json').
   *
   * @returns {Observable<RespuestaDesistimientoSolicitud>} Observable que emite la respuesta
   *          del servidor con los datos de desistimiento. La respuesta está tipada según
   *          el modelo `RespuestaDesistimientoSolicitud`.
   *
   * @throws {HttpErrorResponse} Puede lanzar errores HTTP si la solicitud falla
   *         (códigos 4xx, 5xx, problemas de conectividad, etc.).
   *
   * @example
   * ```typescript
   * // Obtener datos de desistimiento
   * this.getDesistimientoSolicitud('desistimiento-123.json')
   *   .subscribe({
   *     next: (response) => {
   *       console.log('Datos obtenidos:', response);
   *       // Procesar la respuesta
   *     },
   *     error: (error) => {
   *       console.error('Error al obtener datos:', error);
   *     }
   *   });
   * ```
   *
   * @memberof DesistimientoSolicitudService
   * @since 1.0.0
   */
  getDesistimientoSolicitud(
    name: string
  ): Observable<RespuestaDesistimientoSolicitud> {
    const BASEURL = this.url + name;
    return this.http.get<RespuestaDesistimientoSolicitud>(BASEURL);
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   *
   * Este método utiliza el patrón de actualización inmutable para modificar el estado
   * del store de Akita, fusionando los datos existentes con los nuevos datos proporcionados.
   *
   * @description Método que realiza una actualización parcial del estado del formulario
   *              en el store utilizando el patrón spread operator para mantener la
   *              inmutabilidad del estado.
   *
   * @param {Tramite230301State} DATOS - Estado de la solicitud con la información
   *                                       del tipo de solicitud a actualizar en el store.
   *                                       Contiene las propiedades parciales o completas
   *                                       del estado que se desean modificar.
   *
   * @returns {void} Este método no retorna ningún valor, realiza una actualización
   *                 del estado de forma síncrona.
   *
   * @example
   * ```typescript
   * // Actualizar estado con nuevos datos
   * const nuevosDatos: Solicitud230301State = {
   *   numeroSolicitud: '123456',
   *   estado: 'procesando',
   *   fechaActualizacion: new Date()
   * };
   *
   * this.actualizarEstadoFormulario(nuevosDatos);
   * ```
   *
   * @memberof DesistimientoSolicitudService
   * @since 1.0.0
   */
  actualizarEstadoFormulario(DATOS: Tramite230301State): void {
    this.tramite230301Store.update((state) => ({
      ...state,
      ...DATOS,
    }));
  }

  guardarSolicitud(
    solicitud: Solicitud230301Request
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.host}` + API_POST_GUARDAR_SOLICITUD;
    return this.http
      .post<BaseResponse<GuardarResponse>>(ENDPOINT, solicitud)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((httpError) => {
          if (httpError instanceof HttpErrorResponse) {
            return throwError(() => ({
              success: false,
              error: httpError.error,
            }));
          }
          const ERROR = new Error(
            `Ocurrió un error al guardar la información ${ENDPOINT} `
          );
          return throwError(() => ERROR);
        })
      );
  }
}
