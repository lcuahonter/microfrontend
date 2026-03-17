import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_POST_DOCUMENTOS_ESPECIFICOS_REQ, API_POST_GUARDAR_REQUERIMIENTO, API_POST_GUARDAR_REQUERIMIENTO_MOSTRAR_FIRMA, API_POST_VERIFICAR_OBSERVACION_REQUERIMIENTO, DocumentosEspecificosResponse } from '@libs/shared/data-access-user/src';
import {API_POST_FIRMAR_VERIFICAR, API_POST_VERIFICAR_MOSTRAR_FIRMAR, NUMFOLIOTRAMITE, TRAMITE} from '../../../constantes/verificar-requerimiento/api-constants';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarRequerimiento } from '../../models/evaluar/request/guardar-requerimiento-request.model';
import { GuardarRequerimientosResponse } from '../../models/evaluar/response/guardar-requerimiento-response.model';
import { MostrarFirmarRequerimientoRequest } from '../../models/evaluar/request/firma-mostrar-requerimiento.request.model';
import { MostrarFirmarRequerimientoResponse } from '../../models/evaluar/response/mostrar-firmar-requerimiento.response.model';

import { FirmaVerificarRequerimientoRequest, RequerimientoMostrarFirmarRequest } from '../../models/verificar-requerimiento/request/requerimiento-mostrar-firmar-request.model';
import { DocumentosEspecificosRequest } from '../../models/atender-requerimiento/request/documentos-especificos.model';
import { ObservacionRequest } from '../../models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { RequerimientoMostrarFirmarResponse } from '../../models/verificar-requerimiento/response/requerimiento-mostrar-firmar-response.model';
@Injectable({
  providedIn: 'root'
})
export class VerificarRequerimientoService {

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
     * Guarda una nueva observación en el sistema
     * @param tramite - Número de trámite asociado
     * @param numFolio - Número de folio del trámite
     * @param PAYLOAD - Datos de la observación a guardar
     * @returns Observable con la respuesta de la operación
   */
    postObservacionGuardar(tramite: number, numFolio: string, PAYLOAD: ObservacionRequest):
      Observable<BaseResponse<string>> {
      const ENDPOINT = `${this.host}${API_POST_VERIFICAR_OBSERVACION_REQUERIMIENTO(tramite.toString(), numFolio)}`;
      return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
    }

  /**
   * Realiza la petición para verificar y mostrar la información previa a la firma
   * de un requerimiento asociado a un trámite.
   *
   * Construye dinámicamente el endpoint reemplazando el identificador del trámite
   * y el número de folio en la URL base, y envía la información necesaria en el payload.
   *
   * @param tramite Identificador numérico del trámite.
   * @param numFolio Número de folio del trámite.
   * @param PAYLOAD Objeto con la información requerida para mostrar y firmar el requerimiento.
   *
   * @returns Observable que emite una respuesta base que contiene la información
   *          necesaria para mostrar el requerimiento antes de la firma.
   */
  postFirmarMostrar(
    tramite: number,
    numFolio: string,
    PAYLOAD: RequerimientoMostrarFirmarRequest
  ): Observable<BaseResponse<RequerimientoMostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_VERIFICAR_MOSTRAR_FIRMAR.replace(
      TRAMITE,
      tramite.toString()
    ).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<RequerimientoMostrarFirmarResponse>>(
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
   firmarVerificar(tramite: number, numFolio: string, PAYLOAD: FirmaVerificarRequerimientoRequest):
     Observable<BaseResponse<null>> {
     const ENDPOINT = `${this.host}${API_POST_FIRMAR_VERIFICAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
     return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
   }

}
