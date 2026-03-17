import { API_POST_CADENA_ORIGINAL, API_POST_FIRMAR } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Firmar120301Request } from '../models/request/firmar-request.model';
import { GenerarCadenaResponse } from '../models/request/generar-cadena-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmarService {

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
 * Genera la cadena original para firma electrónica
 * @param idSolicitud - ID de la solicitud
 * @param PAYLOAD - Datos para generar la cadena
 * @returns Observable con la cadena original generada
 */
  postGenerarCadena(idSolicitud: number, PAYLOAD: GenerarCadenaResponse): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}${API_POST_CADENA_ORIGINAL(idSolicitud.toString())}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }

  /** 
 * Realiza la firma electrónica de la solicitud
 * @param idSolicitud - ID de la solicitud a firmar
 * @param PAYLOAD - Datos de la firma electrónica
 * @returns Observable con el resultado de la firma
 */
  postFirma(idSolicitud: number, PAYLOAD: Firmar120301Request): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR(idSolicitud.toString())}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }

}
