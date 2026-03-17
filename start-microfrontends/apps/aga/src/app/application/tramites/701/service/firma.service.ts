import { API_POST_CADENA_ORIGINAL, API_POST_FIRMAR } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginal701 } from '../models/request/cadena-orginal-request.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Firmar701Request } from '../models/request/firma-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CadenaOriginalResponse } from '../models/response/cadena-original-response.model';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

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
    postGenerarCadena(idSolicitud: number, PAYLOAD: CadenaOriginal701): Observable<BaseResponse<CadenaOriginalResponse>> {
      const ENDPOINT = `${this.host}${API_POST_CADENA_ORIGINAL(idSolicitud.toString())}`;
      return this.http.post<BaseResponse<CadenaOriginalResponse>>(ENDPOINT, PAYLOAD);
    }
  
    /** 
   * Realiza la firma electrónica de la solicitud
   * @param idSolicitud - ID de la solicitud a firmar
   * @param PAYLOAD - Datos de la firma electrónica
   * @returns Observable con el resultado de la firma
   */
    postFirma(idSolicitud: number, PAYLOAD: Firmar701Request): Observable<BaseResponse<string>> {
      const ENDPOINT = `${this.host}${API_POST_FIRMAR(idSolicitud.toString())}`;
      return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
    }


}
