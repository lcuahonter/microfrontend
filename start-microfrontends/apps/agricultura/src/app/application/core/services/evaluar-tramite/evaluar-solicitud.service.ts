import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_GET_DESCARGAR_SOLICITUD, API_GET_EVALUAR_INICIAR, API_GET_EVALUAR_MOSTRAR, API_POST_OPCIONES_EVALUACION } from '../../server/api-router';
// import { API_POST_OPCIONES_EVALUACION } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { EvaluacionOpcionResponse } from '../../models/evaluar/response/evaluar-estado-evaluacion-response.model';
import { OpcionesEvaluacionRequest } from '../../models/evaluar/request/opciones-evaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluarSolicitudService {

  /**
    * URL del servidor donde se encuentra la API.
    */
  private readonly host: string;

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Envía las opciones de evaluación del trámite 130118.
   * @param PAYLOAD Datos de las opciones de evaluación.
   * @returns Observable con la respuesta del servidor.
   */
  postOpcionesEvaluacion(tramite: number,folioTramite: string, PAYLOAD: OpcionesEvaluacionRequest):
    Observable<BaseResponse<string[]>> {
    const ENDPOINT = `${this.host}${API_POST_OPCIONES_EVALUACION(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string[]>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Consulta la evaluación del trámite 130118.
   * @param tramite Número del trámite.
   * @param folioTramite Folio del trámite.
   * @returns Observable con la respuesta del servidor.
 */
  getEvaluacionTramite(tramite: number, folioTramite: string): Observable<BaseResponse<EvaluacionOpcionResponse>> {
    const ENDPOINT = `${this.host}${API_GET_EVALUAR_INICIAR(tramite.toString(), folioTramite)}`;
    return this.http.get<BaseResponse<EvaluacionOpcionResponse>>(ENDPOINT);
  }

  /**
   * Prepara la evaluación del trámite 130118.
   * @param tramite Número del trámite.
   * @param folioTramite Folio del trámite.
   * @param opcion Opción de evaluación seleccionada.
   * @returns Observable con la respuesta del servidor.
 */
  postPrepararEvaluacion(tramite: number, folioTramite: string, opcion: string): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}` + API_GET_EVALUAR_MOSTRAR(tramite.toString(), folioTramite);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const params = new HttpParams().set('opcion', opcion);
    return this.http.post<BaseResponse<string>>(ENDPOINT,null, { params });
  }

  /**
   * Descarga un archivo Excel con los datos de una solicitud específica.
   *
   * Construye la URL del endpoint usando el número de trámite y el ID de la solicitud, 
   * y realiza una solicitud GET al servidor.
   *
   * Se espera que el servidor devuelva un `Observable` con la respuesta en Base64
   * envuelta en `BaseResponse<string>`.
   *
   * @param tramite - Número del trámite asociado a la solicitud.
   * @param idSolicitud - Identificador único de la solicitud.
   * @returns {Observable<BaseResponse<string>>} Observable con el contenido en Base64 del Excel.
   */
  getDescargarExcel(tramite: number, idSolicitud: string): Observable<BaseResponse<string>>{
    const ENDPOINT = `${this.host}` + API_GET_DESCARGAR_SOLICITUD(tramite.toString(), idSolicitud);
    return this.http.get<BaseResponse<string>>(ENDPOINT);
  }
}
