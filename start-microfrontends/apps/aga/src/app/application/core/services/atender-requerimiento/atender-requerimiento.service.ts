import { API_GET_INICIAR_ATENDER_REQUERIMIENTO, API_POST_ACUSE_REQUERIMIENTO, API_POST_FIRMAR, API_POST_MOSTRAR_FIRMAR, IDSOLICITUD, NUMFOLIOTRAMITE, TRAMITE } from '../../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { IniciarAtenderRequerimientoResponse } from '../../models/atender-requerimiento/response/iniciar-atender-requerimiento.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentoOficialResponse } from '../../models/autorizar-requerimiento/response/oficio-autorizacion-response.model';
import { FirmarRequest } from '../../models/atender-requerimiento/request/fimar-request.model';
import { FirmarResponse } from '../../models/atender-requerimiento/response/firmar-response.model';
import { MostrarFirmaRequest } from '../../models/atender-requerimiento/request/mostrar-firma-request.model';
import { MostrarFirmarResponse } from '../../models/atender-requerimiento/response/mostrar-firmar-response.model';

@Injectable({
  providedIn: 'root'
})
export class AtenderRequerimientoService {

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
   * Obtiene la información inicial para atender un requerimiento específico.
   *
   * @param numFolio - Número de folio del trámite que se desea atender.
   * @returns Observable que emite la respuesta con los datos necesarios para iniciar la atención del requerimiento.
   */
  getIniciarAtenderRequerimiento(tramite: number, numFolio: string):
    Observable<BaseResponse<IniciarAtenderRequerimientoResponse>> {
    const ENDPOINT = `${this.host}${API_GET_INICIAR_ATENDER_REQUERIMIENTO.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.get<BaseResponse<IniciarAtenderRequerimientoResponse>>(ENDPOINT);
  }

  /**
 * Realiza la solicitud para mostrar la información de firma de un requerimiento.
 * 
 * @param tramite - Identificador del trámite asociado.
 * @param numFolio - Número de folio del trámite.
 * @param PAYLOAD - Objeto con los documentos requeridos para mostrar la firma.
 * @returns Observable que emite la respuesta con los datos de la firma.
 */
  postFirmarMostrar(tramite: number, numFolio: string, PAYLOAD: MostrarFirmaRequest):
    Observable<BaseResponse<MostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_MOSTRAR_FIRMAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(ENDPOINT, PAYLOAD);
  }

  /**
 * Realiza la solicitud para firmar y atender un requerimiento.
 * 
 * @param tramite - Identificador del trámite asociado.
 * @param numFolio - Número de folio del trámite.
 * @param PAYLOAD - Objeto con la información de la firma digital.
 * @returns Observable que emite la respuesta con el ID de la solicitud firmada.
 */
  postFirmarAtenderRequerimiento(tramite: number, numFolio: string, PAYLOAD: FirmarRequest):
    Observable<BaseResponse<FirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<FirmarResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Genera oficio de requerimiento
   * @param tramite - Número de trámite asociado
   * @param idSolicitud - ID de la solicitud
   * @returns Observable con la respuesta del oficio generado
  */
  postAcuseRecibo(tramite: number, idSolicitud: number): Observable<BaseResponse<DocumentoOficialResponse>> {
    const ENDPOINT = `${this.host}${API_POST_ACUSE_REQUERIMIENTO.replace(TRAMITE, tramite.toString()).replace(IDSOLICITUD, idSolicitud.toString())}`;
    return this.http.post<BaseResponse<DocumentoOficialResponse>>(ENDPOINT, null);
  }
}
