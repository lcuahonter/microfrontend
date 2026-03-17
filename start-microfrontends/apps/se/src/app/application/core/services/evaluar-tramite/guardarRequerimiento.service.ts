import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_POST_AUTORIZAR_OBSERVACION_REQUERIMIENTO, API_POST_DOCUMENTOS_ESPECIFICOS_REQ, API_POST_GUARDAR_REQUERIMIENTO, API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA, DocumentosEspecificosResponse } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarRequerimiento } from '../../models/evaluar/request/guardar-requerimiento-request.model';
import { GuardarRequerimientosResponse } from '../../models/evaluar/response/guardar-requerimiento-response.model';
import { MostrarFirmarRequerimientoRequest } from '../../models/evaluar/request/firma-mostrar-requerimiento.request.model';
import { MostrarFirmarRequerimientoResponse } from '../../models/evaluar/response/mostrar-firmar-requerimiento.response.model';

import { DocumentosEspecificosRequest } from '../../models/atender-requerimiento/request/documentos-especificos.model';
import { MostrarFirmarResponse } from '../../models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { MostrarFirmaRequest } from '../../models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { API_POST_AUTORIZAR_MOSTRAR_FIRMAR } from '../../server/api-router';
import { ObservacionRequest } from '../../models/autorizar-requerimiento/request/observacion-guardar-request.model';

@Injectable({
  providedIn: 'root'
})
export class GuardarRequerimientoService {

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
  * Guarda un requerimiento en el sistema
  * @param tramite - Número de trámite al que pertenece el requerimiento
  * @param numFolio - Número de folio del trámite
  * @param PAYLOAD - Datos del requerimiento a guardar
  * @returns Observable con la respuesta del servidor que incluye el ID del requerimiento guardado
  */
  postGuardarRequerimiento(tramite: number, numFolio: string, PAYLOAD: GuardarRequerimiento):
    Observable<BaseResponse<GuardarRequerimientosResponse>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_REQUERIMIENTO(tramite.toString(), numFolio)}`;

    return this.http.post<BaseResponse<GuardarRequerimientosResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Prepara y muestra la interfaz de firma para un requerimiento
   * @param tramite - Número de trámite al que pertenece el requerimiento
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos para la firma del requerimiento
   * @returns Observable con la respuesta del servidor para mostrar la firma
 */
  postMostrarFirma(tramite: number, numFolio: string, PAYLOAD: MostrarFirmarRequerimientoRequest):
    Observable<BaseResponse<MostrarFirmarRequerimientoResponse>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA(tramite.toString(), numFolio)}`;
    return this.http.post<BaseResponse<MostrarFirmarRequerimientoResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Envía una solicitud para generar o consultar documentos específicos relacionados con un PEXIM.
   * @param numFolio - Número de folio del trámite
   * @param idSolicitud - (Opcional) Identificador de la solicitud asociada
   * @param esSolicitud - (Opcional) Indica si se trata de una solicitud
   * @param idRequerimiento - (Opcional) Identificador del requerimiento asociado
   * @param PAYLOAD - (Opcional) Datos adicionales necesarios para la solicitud
   * @returns Observable con la respuesta del servidor que incluye una lista de documentos específicos generados
   */
  postDocumentosEspecificos(
    numFolio: number,
    idSolicitud?: string,
    esSolicitud?: boolean,
    idRequerimiento?: number,
    PAYLOAD?: DocumentosEspecificosRequest | null
  ): Observable<BaseResponse<DocumentosEspecificosResponse[]>> {
    const ENDPOINT = `${this.host}` + API_POST_DOCUMENTOS_ESPECIFICOS_REQ(numFolio.toString());
    let PARAMS = new HttpParams();

    if (idSolicitud) {
      PARAMS = PARAMS.set('idSolicitud', idSolicitud);
    }

    if (esSolicitud !== null && esSolicitud !== undefined) {
      PARAMS = PARAMS.set('esSolicitud', String(esSolicitud));
    }

    if (idRequerimiento) {
      PARAMS = PARAMS.set('idRequerimiento', idRequerimiento);
    }

    return this.http.post<BaseResponse<DocumentosEspecificosResponse[]>>(ENDPOINT, PAYLOAD, { params: PARAMS });
  }

    /** 
   * Muestra la información de firma para un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos para mostrar la firma
   * @returns Observable con la respuesta que incluye información de firma
   */
  postFirmarMostrar(tramite: number, numFolio: string, PAYLOAD: MostrarFirmaRequest):
    Observable<BaseResponse<MostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_AUTORIZAR_MOSTRAR_FIRMAR(tramite.toString(), numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(ENDPOINT, PAYLOAD);
  }

   /** 
     * Guarda una nueva observación en el sistema
     * @param tramite - Número de trámite asociado
     * @param numFolio - Número de folio del trámite
     * @param PAYLOAD - Datos de la observación a guardar
     * @returns Observable con la respuesta de la operación
   */
    postObservacionGuardar(tramite: number, numFolio: string, PAYLOAD: ObservacionRequest):
      Observable<BaseResponse<string>> {
      const ENDPOINT = `${this.host}${API_POST_AUTORIZAR_OBSERVACION_REQUERIMIENTO(tramite.toString(), numFolio)}`;
      return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
    }

}
