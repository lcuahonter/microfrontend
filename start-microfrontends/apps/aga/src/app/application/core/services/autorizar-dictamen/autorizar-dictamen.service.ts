import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT, IDSOLICITUD } from '@libs/shared/data-access-user/src';

import { API_POST_FIRMAR, API_POST_INICIAR_AUTORIZAR_DICTAMEN, API_POST_MOSTRAR_FIRMAR, API_POST_OBSERVACION_GUARDAR, API_POST_OFICIO_AUTORIZACION, API_POST_OFICIO_RECHAZADO, NUMFOLIOTRAMITE, TRAMITE} from '../../../constantes/autorizar-dictamen/api-constants';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Observable } from 'rxjs';

import { IniciarAutorizacionResponse } from '@libs/shared/data-access-user/src/core/models/shared/iniciar-autorizar-dictamen-response.model';

import { DocumentoOficialResponse } from '../../models/autorizar-requerimiento/response/oficio-autorizacion-response.model';
import { Firma } from '../../models/evaluar/request/firmar-dictamen-request.model';
import { FirmaAutorizarDictamenRequest } from '../../models/autorizar-requerimiento/request/firma-autorizar-request.model';
import { MostrarFirmaRequest } from '../../models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { MostrarFirmarResponse } from '../../models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { ObservacionRequest } from '../../models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { IniciarAutorizacionRequest } from '../../models/autorizar-requerimiento/request/autorizar-dictamen-request.model';

@Injectable({
  providedIn: 'root'
})
export class AutorizarDictamenService {

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
   * Inicia el dictamen del trámite 130118.
   * @param tramite Número de trámite.
   * @param numFolio Número de folio del trámite.
   *  @param PAYLOAD Datos para iniciar el dictamen.
   * @returns Observable con la respuesta del servidor.
   */

  getIniciarDictamen(tramite: number, numFolio: string, PAYLOAD: IniciarAutorizacionRequest):
    Observable<BaseResponse<IniciarAutorizacionResponse>> {
    const ENDPOINT = `${this.host}${API_POST_INICIAR_AUTORIZAR_DICTAMEN.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<IniciarAutorizacionResponse>>(ENDPOINT, PAYLOAD);
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
    const ENDPOINT = `${this.host}${API_POST_MOSTRAR_FIRMAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Realiza la firma y autorización de un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos de firma y autorización
   * @returns Observable con la respuesta de la operación
   */
  firmarAutorizar(tramite: number, numFolio: string, PAYLOAD: FirmaAutorizarDictamenRequest):
    Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Genera oficio de autorización para una solicitud
   * @param tramite - Número de trámite asociado
   * @param idSolicitud - ID de la solicitud a autorizar
   * @returns Observable con la respuesta del oficio generado
  */
  postOficioAutorizacion(tramite: number, idSolicitud : number, PAYLOAD?: Firma | null): Observable<BaseResponse<DocumentoOficialResponse>> {
    const ENDPOINT = `${this.host}${API_POST_OFICIO_AUTORIZACION.replace(TRAMITE, tramite.toString()).replace(IDSOLICITUD, idSolicitud.toString())}`;
    const BODY = PAYLOAD ? PAYLOAD : null;
    return this.http.post<BaseResponse<DocumentoOficialResponse>>(ENDPOINT, BODY);
  }

  /** 
   * Genera oficio de autorización para una solicitud rechazada
   * @param tramite - Número de trámite asociado
   * @param idSolicitud - ID de la solicitud a autorizar
   * @returns Observable con la respuesta del oficio generado
  */
  postOficioRechazado(tramite: number, idSolicitud : number, PAYLOAD?: Firma | null): Observable<BaseResponse<DocumentoOficialResponse>>{
    const ENDPOINT = `${this.host}${API_POST_OFICIO_RECHAZADO.replace(TRAMITE, tramite.toString()).replace(IDSOLICITUD, idSolicitud.toString())}`;
    const BODY = PAYLOAD ? PAYLOAD : null;
    return this.http.post<BaseResponse<DocumentoOficialResponse>>(ENDPOINT, BODY);
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
    const ENDPOINT = `${this.host}${API_POST_OBSERVACION_GUARDAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }
}
