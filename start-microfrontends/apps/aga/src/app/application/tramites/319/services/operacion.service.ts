import {
  API_GET_PERIODOS,
  API_GET_PERIODOS_HISTORICO_ACTUAL,
  API_GET_PERSONAS,
  API_GET_TIPO_OPERACION,
  API_POST_GUARDAR_SOLICITUD,
} from '../server/api-routes';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { COMUN_URL, TRAMITE } from '@libs/shared/data-access-user/src';
import { FinalDataToSend } from '../models/tramite319-state.model';
import { GuardarResponse } from '../models/guardar-solicitud-response';
import { GuardarSolicitudT319 } from '../models/guardar-solicitud.model';
import { Injectable } from '@angular/core';
import { Tramite319Store } from '../estados/tramite319Store.store';
import { TRAMITE_ID } from '../constantes/operaciones-de-comercio-exterior.enum';
import { API_GET_DETALLE_SOLICITUD } from '../../../core/server/api-router';
import { SolicitudResponseDetalle319 } from '../models/solicitud-detalle.model';

/**
 * Servicio para realizar operaciones relacionadas con la obtención de datos desde el backend.
 * Proporciona métodos para obtener listas de catálogos y personas desde un archivo específico.
 *
 * @example
 * // Ejemplo de uso:
 * const fileName = 'catalogos.json';
 * operacionService.obtenerSelectorList(fileName).subscribe(catalogos => {
 *   console.log(catalogos);
 * });
 *
 * @example
 * const fileName = 'personas.json';
 * operacionService.obtenerTablerList(fileName).subscribe(personas => {
 *   console.log(personas);
 * });
 *
 * @injectable
 * Este servicio está disponible en el nivel raíz del módulo.
 */
@Injectable({
  providedIn: 'root',
})
export class OperacionService {
  /**
   * URL base para las solicitudes HTTP.
   */
  url: string = COMUN_URL.BASE_URL;

  /**
   * Constructor del servicio.
   *
   * @param http - Cliente HTTP para realizar solicitudes al backend.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly solocitud319Service: Tramite319Store
  ) { }

  /**
   * Obtiene una lista de períodos desde el backend.
   * @returns Un observable que emite una lista de períodos.
   */
  obtenerPeriodoList<T>(): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.url}${API_GET_PERIODOS}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }

  /**
   * Obtiene el tipo de operación para un trámite específico y RFC dado.
   * @param rfc - El RFC para el cual se desea obtener el tipo de operación.
   * @returns Un observable que emite el tipo de operación.
   */
  obtenerTipoOperacion<T>(rfc: string): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.url}${API_GET_TIPO_OPERACION(rfc)}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }

  /**
   * @description
   * Obtiene una lista de personas desde un archivo específico.
   * @param rfc
   * @param tramite
   * @returns Un observable que emite una lista de personas.
   */
  obtenerPersonas<T>(tramite: string): Observable<BaseResponse<T>> {
    const BASEURL = `${this.url}${API_GET_PERSONAS(tramite)}`;
    return this.http
      .get<BaseResponse<T>>(BASEURL)
      .pipe(map((response) => response));
  }

  /**
   * @description
   * Obtiene el período histórico actual desde el backend.
   * @returns Un observable que emite el período histórico actual.
   */
  obtenerPeriodoHistoricoActual<T>(): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.url}${API_GET_PERIODOS_HISTORICO_ACTUAL}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }
  /**
   * @description
   * Obtiene los datos de registro de toma de muestras de mercancías desde el backend utilizando el nombre de archivo proporcionado.
   *
   * @param fileName El nombre del archivo que se utilizará para construir la URL de la solicitud.
   * @returns Un observable que emite los datos finales a enviar (`FinalDataToSend`).
   *
   * @memberof OperacionService
   */
  getRegistroTomaMuestrasMercanciasData(
    fileName: string
  ): Observable<FinalDataToSend> {
    const BASEURL = this.url + fileName;
    return this.http.get<FinalDataToSend>(BASEURL);
  }

  /**
   * @description
   * Envía una solicitud POST al endpoint `/solicitud` del backend.
   * @returns
   */
  postSolicitud(
    solicitud: GuardarSolicitudT319
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.url}${API_POST_GUARDAR_SOLICITUD}`;
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
  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado completo del formulario en la tienda (`store`) mediante el servicio `solocitud319Service`.
   *
   * Este método delega la actualización del estado llamando al método `actualizarTodo`,
   * que reemplaza completamente los datos actuales (`datos`) y la operación (`operacion`)
   * con el nuevo objeto `resp` de tipo `FinalDataToSend`.
   *
   * @param {FinalDataToSend} resp - Objeto que contiene los nuevos datos y operación a establecer en el estado del store.
   *
   * @example
   * const nuevosDatos: FinalDataToSend = {
   *   datos: [...],
   *   operacion: 'editar'
   * };
   * this.actualizarEstadoFormulario(nuevosDatos);
   */
  actualizarEstadoFormulario(resp: FinalDataToSend): void {
    this.solocitud319Service.actualizarOperacion(resp.numero_registro);
    this.solocitud319Service.actualizarTodo(resp);
  }


  /**
   * Obtiene el detalle de la solicitud desde el backend.
   * @param numFolio - El número de folio de la solicitud.
   * @returns Un observable que emite el detalle de la solicitud.
   */
  obtenerDetalleDeSolicitud(numFolio: string): Observable<BaseResponse<SolicitudResponseDetalle319>> {
    const BASEURL = `${this.url}${API_GET_DETALLE_SOLICITUD(TRAMITE_ID, numFolio)}`;
    return this.http.get<BaseResponse<SolicitudResponseDetalle319>>(BASEURL);
  }
}
