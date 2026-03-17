import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_GET_CONSULTA_BANDEJA_SOLICITUDES, API_GET_CONSULTA_SOLICITUD } from '../server/api-router';
import { ConsultaSolicitudResponse } from '../model/response/consultar-solicitud-response.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaSolicitudService {

  /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
     * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
     * Es de solo lectura y se inicializa en el constructor del servicio.
     */
  private readonly host: string;

  /**
    * Constructor del servicio que inicializa la URL base del host.
    * @param http Instancia de HttpClient para realizar solicitudes HTTP.
    */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para consultar los criterios de una solicitud de dictamen.
   * @param tramite - Identificador del trámite asociado al requerimiento.
   * @param numFolio Número de folio del trámite a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
  getDetalleSolicitud(tramite: number,numFolio: string): Observable<BaseResponse<ConsultaSolicitudResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_SOLICITUD(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<ConsultaSolicitudResponse>>(ENDPOINT);
  }

  /**
   * Método para consultar el detalle de la bandeja de solicitudes.
   * @param idSolicitud - Identificador de la solicitud a consultar.
   * @returns Observable que emite la respuesta de la consulta.
   */
   getConsultaDetalleBandejaSolicitudes(idSolicitud: string): Observable<BaseResponse<ConsultaSolicitudResponse>> {
    const ENDPOINT = `${this.host}${API_GET_CONSULTA_BANDEJA_SOLICITUDES(idSolicitud)}`;
    return this.http.get<BaseResponse<ConsultaSolicitudResponse>>(ENDPOINT);
  }
}
