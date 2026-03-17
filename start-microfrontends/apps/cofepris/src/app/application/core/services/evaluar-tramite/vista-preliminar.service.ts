import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable } from "rxjs";

import { API_POST_VISTA_PRELIMINAR_ACEPTADO, API_POST_VISTA_PRELIMINAR_RECHAZADO, API_POST_VISTA_PRELIMINAR_REQUERIMIENTO } from "../../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { VistaPreliminarResponse } from "../../models/evaluar/response/vista-preliminar-response.model";



@Injectable({
  providedIn: 'root'
})
export class VistaPreliminarService {
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
     * Obtiene la vista preliminar del dictamen aceptado.
     * @param tramite Número de trámite.
     * @param numFolioTramite Número de folio del trámite.
     * @param body Cuerpo de la solicitud.
     * @returns Observable con la respuesta del servidor.
     */
    getVistaPreliminarAceptado(tramite: number, numFolioTramite: string): Observable<BaseResponse<VistaPreliminarResponse>> {
        const URL = `${this.host}${API_POST_VISTA_PRELIMINAR_ACEPTADO(tramite.toString(), numFolioTramite)}`;
        return this.http.post<BaseResponse<VistaPreliminarResponse>>(URL, null);
    }
    /**
     * Obtiene la vista preliminar del dictamen rechazado.
     * @param tramite Número de trámite.
     * @param numFolioTramite Número de folio del trámite.
     * @param body Cuerpo de la solicitud.
     * @returns Observable con la respuesta del servidor.
     */
    getVistaPreliminarRechazado(tramite: number, numFolioTramite: string): Observable<BaseResponse<VistaPreliminarResponse>> {
        const URL = `${this.host}${API_POST_VISTA_PRELIMINAR_RECHAZADO(tramite.toString(), numFolioTramite)}`;
        return this.http.post<BaseResponse<VistaPreliminarResponse>>(URL, null);
    }

   getVistaPreliminarRequerimiento(tramite: number, numFolioTramite: string): Observable<BaseResponse<VistaPreliminarResponse>> {
      const URL = `${this.host}${API_POST_VISTA_PRELIMINAR_REQUERIMIENTO(tramite.toString(), numFolioTramite)}`;
      return this.http.post<BaseResponse<VistaPreliminarResponse>>(URL, null);
    }
}