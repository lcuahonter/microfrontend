import { API_POST_GUARDADO_PARCIAL, API_POST_GUARDAR_SOLICITUD } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarSolicitudCompletaRequest } from '../models/request/guardar-solicitud-request.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ParcialRequest } from '../models/request/parcialRequest.model';
import { ParcialResponse } from '../models/response/parcial-response.model';

@Injectable({
  providedIn: 'root'
})
export class GuardadoService {
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
   * Envía la solicitud para guardado parcial del trámite 120301.
   * @param PAYLOAD Datos de la solicitud.
   * @returns Observable con la respuesta del servidor.
  */
  postGuardadoParcial(PAYLOAD: ParcialRequest): Observable<BaseResponse<ParcialResponse>> {
    const ENDPOINT = `${this.host}` + API_POST_GUARDADO_PARCIAL;
    return this.http.post<BaseResponse<ParcialResponse>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Envía la solicitud para guardado completo del trámite 120301.
   * @param PAYLOAD Datos de la solicitud completa.
   * @returns Observable con la respuesta del servidor.
   */
  postGuardadoCompleto(PAYLOAD: GuardarSolicitudCompletaRequest): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}` + API_POST_GUARDAR_SOLICITUD;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
  }
}