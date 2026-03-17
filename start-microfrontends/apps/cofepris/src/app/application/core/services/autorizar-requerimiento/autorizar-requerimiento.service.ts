import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_POST_DOCUMENTOS_ESPECIFICOS_REQ, DocumentosEspecificosResponse, ENVIRONMENT, IDSOLICITUD } from '@libs/shared/data-access-user/src';

import {
  API_GET_OFICIO_REQUERIMIENTO,
  API_POST_AUTORIZAR_REQUERIMIENTO_OBSERVACION,
  API_POST_FIRMAR,
  API_POST_INICIAR_AUTORIZAR_REQUERIMIENTO,
  API_POST_MOSTRAR_FIRMAR,
  NUMFOLIOTRAMITE,
  TRAMITE
} from '../../../constantes/autorizar-requerimiento/api-constants';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Observable } from 'rxjs';

import { MostrarFirmaRequest } from '../../models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { MostrarFirmarResponse } from '../../models/autorizar-requerimiento/response/mostrar-firmar-response.model';

import { DocumentoOficialResponse } from '../../models/autorizar-requerimiento/response/oficio-autorizacion-response.model';
import { DocumentosEspecificosRequest } from '../../models/atender-requerimiento/request/documentos-especificos.model';
import { FirmaAutorizarDictamenRequest } from '../../models/autorizar-requerimiento/request/firma-autorizar-request.model';
import { IniciarAutorizarRequerimiento } from '../../models/autorizar-requerimiento/request/iniciar-authorizor-requiremento-request.model';
import { IniciarAutorizarRequerimientoResponse } from '../../models/autorizar-requerimiento/response/iniciar-autorizar-requerimiento-response.model';
import { ObservacionRequest } from '../../models/autorizar-requerimiento/request/observacion-guardar-request.model';

@Injectable({
  providedIn: 'root',
})
export class AutorizarRequerimientoService {
  private readonly host: string;
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }
  postIniciarRequerimiento(
    tramite: number,
    numFolio: string,
    PAYLOAD: IniciarAutorizarRequerimiento
  ): Observable<BaseResponse<IniciarAutorizarRequerimientoResponse>> {
    const ENDPOINT = `${this.host}${API_POST_INICIAR_AUTORIZAR_REQUERIMIENTO.replace(
      TRAMITE,
      tramite.toString()
    ).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<IniciarAutorizarRequerimientoResponse>>(
      ENDPOINT,
      PAYLOAD
    );
  }

  /**
   * Muestra la información de firma para un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos para mostrar la firma
   * @returns Observable con la respuesta que incluye información de firma
   */
  postFirmarMostrar(
    tramite: number,
    numFolio: string,
    PAYLOAD: MostrarFirmaRequest
  ): Observable<BaseResponse<MostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_MOSTRAR_FIRMAR.replace(
      TRAMITE,
      tramite.toString()
    ).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(
      ENDPOINT,
      PAYLOAD
    );
  }

  /**
   * Realiza la firma y autorización de un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos de firma y autorización
   * @returns Observable con la respuesta de la operación
   */
  firmarAutorizar(
    tramite: number,
    numFolio: string,
    PAYLOAD: FirmaAutorizarDictamenRequest
  ): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR.replace(
      TRAMITE,
      tramite.toString()
    ).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
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
    * Guarda una nueva observación en el sistema
    * @param tramite - Número de trámite asociado
    * @param numFolio - Número de folio del trámite
    * @param PAYLOAD - Datos de la observación a guardar
    * @returns Observable con la respuesta de la operación
    */
    postObservacionGuardar(
      tramite: number,
      numFolio: string,
      PAYLOAD: ObservacionRequest
    ): Observable<BaseResponse<string>> {
      const ENDPOINT = `${
        this.host
      }${API_POST_AUTORIZAR_REQUERIMIENTO_OBSERVACION.replace(
        TRAMITE,
        tramite.toString()
      ).replace(NUMFOLIOTRAMITE, numFolio)}`;
      return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
    }

    /** 
   * Genera oficio de autorización para una solicitud
   * @param tramite - Número de trámite asociado
   * @param idSolicitud - ID de la solicitud a autorizar
   * @returns Observable con la respuesta del oficio generado
  */
  postOficioAutorizacion(
    tramite: number,
    idSolicitud: number
  ): Observable<BaseResponse<DocumentoOficialResponse>> {

  const ENDPOINT = `${this.host}${API_GET_OFICIO_REQUERIMIENTO
    .replace(TRAMITE, tramite.toString())
    .replace(IDSOLICITUD, idSolicitud.toString())
  }`;

  return this.http.post<BaseResponse<DocumentoOficialResponse>>(ENDPOINT, null);
}

}
