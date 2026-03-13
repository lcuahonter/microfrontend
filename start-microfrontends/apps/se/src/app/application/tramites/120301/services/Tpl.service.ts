
import { API_GET_REPRESENTACION_FEDERAL, API_POST_DETALLE_TPL, API_POST_TPL, IDASIGNACION } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RepresentaciónFederalResponse } from '../models/response/representacion-federal-response.model';
import { TplDetalleRequest } from '../models/request/tpl-detalle-request.model';
import { TplDetalleResponse } from '../models/response/tpl-detalle-response.model';
import { TplRequest } from '../models/request/tpl-request.model';
import { TplResponse } from '../models/response/tpl-response.model';

@Injectable({
  providedIn: 'root'
})
export class TplService {

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
   * Envía la solicitud para guardar los datos TPL del trámite 120301.
   * @param PAYLOAD Datos de la solicitud TPL.
   * @returns Observable con la respuesta del servidor.
   */
  posTpl(PAYLOAD: TplRequest): Observable<BaseResponse<TplResponse[]>> {
    const ENDPOINT = `${this.host}` + API_POST_TPL;
    return this.http.post<BaseResponse<TplResponse[]>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Consulta de representacion federal de la solicitud del trámite 120301.
   * 
   * @param idAsignacion Numero de la asignacion.
   * @returns Observable con la respuesta del servidor.
  */
  getRepresentacionFederal(idAsignacion: number): Observable<BaseResponse<RepresentaciónFederalResponse>> {
    const ENDPOINT = `${this.host}${API_GET_REPRESENTACION_FEDERAL.replace(IDASIGNACION, idAsignacion.toString())}`;
    return this.http.get<BaseResponse<RepresentaciónFederalResponse>>(ENDPOINT);
  }

  /**
   * Consulta de tpl a detalle del trámite 120301.
   * 
   * @param PAYLOAD Datos de la solicitud TPL.
   * @returns Observable con la respuesta del servidor.
  */
  postTplDetalle(PAYLOAD: TplDetalleRequest): Observable<BaseResponse<TplDetalleResponse>> {
    const ENDPOINT = `${this.host}` + API_POST_DETALLE_TPL;
    return this.http.post<BaseResponse<TplDetalleResponse>>(ENDPOINT, PAYLOAD);
  }
}