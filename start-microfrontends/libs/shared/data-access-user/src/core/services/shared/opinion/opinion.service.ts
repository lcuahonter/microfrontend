import { API_DELETE_DOCUMENTO_OPCIONES_EVALUACION, API_DELETE_OPCIONES_EVALUACION, API_GET_OPINION_EVALUAR_INICIAR, API_GET_RADIO_OPINION, API_POST_FIRMAR_OPINION, API_POST_OPCIONES_EVALUACION_GUARDAR_130, API_POST_OPCIONES_EVALUACION_GUARDAR_801, API_POST_OPINION_EVALUAR_GUARDAR, API_POST_OPINION_EVALUAR_GUARDAR_FIRMA, API_TERMINAR_OPCIONES_EVALUACION_130, API_TERMINAR_OPCIONES_EVALUACION_801, ENVIRONMENT, OPINION_DOCUMENTO } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OpinionService {

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

//opion
  postOpcionesEvaluacionAgregar(tramite: number,folioTramite: string, PAYLOAD: any):
    Observable<BaseResponse<string[]>> {
    const ENDPOINT = `${this.host}${API_POST_OPCIONES_EVALUACION_GUARDAR_801(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string[]>>(ENDPOINT, PAYLOAD);
  }

  postSolicitarTramiteGuardar(tramite: number, folioTramite: string, data: any): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_TERMINAR_OPCIONES_EVALUACION_801(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT,data);
  }


  postOpcionesEvaluacion130Agregar(tramite: number,folioTramite: string, PAYLOAD: any):
    Observable<BaseResponse<string[]>> {
    const ENDPOINT = `${this.host}${API_POST_OPCIONES_EVALUACION_GUARDAR_130(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string[]>>(ENDPOINT, PAYLOAD);
  }

  postSolicitarTramite130Guardar(tramite: number, folioTramite: string, data: any): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_TERMINAR_OPCIONES_EVALUACION_130(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT,data);
  }

  /**   * Obtiene la información para solicitar una opinión en un trámite específico.
   * @param tramite - Número del trámite.
   * @param idSolicitud - Identificador de la solicitud.
   * @returns Observable con la respuesta del servidor.
   */
  getSolicitarTramite(tramite: number, folioTramite: string): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_GET_OPINION_EVALUAR_INICIAR(tramite.toString(), folioTramite)}`;
    return this.http.get<BaseResponse<any>>(ENDPOINT);
  }

  /**   * Obtiene la información del radio de opinión para un trámite específico.
   * @param tramite - Número del trámite.
   * @returns Observable con la respuesta del servidor.
   */
  getRadioTramite(tramite: number): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_GET_RADIO_OPINION(tramite.toString())}`;
    return this.http.get<BaseResponse<any>>(ENDPOINT);
  }

  deleteSolicitarOpinion(tramite: number, id_opinion: number): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_DELETE_OPCIONES_EVALUACION(tramite.toString(), id_opinion.toString())}`;
    return this.http.delete<BaseResponse<any>>(ENDPOINT);
  }

  deleteRegistraOpinion(tramite: number, id_documento_opinion: number): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${API_DELETE_DOCUMENTO_OPCIONES_EVALUACION(tramite.toString())}`;
    return this.http.delete<BaseResponse<any>>(ENDPOINT + "?idDocumentoOpinion=" + id_documento_opinion);
  }


  /**
   * 
   * @param tramite 
   * @param folioTramite 
   * @param data 
   * @returns 
   */
  postopinionregistrarMostrarFirma(tramite: number, folioTramite: string, data: any): Observable<BaseResponse<any>>{
        const ENDPOINT = `${this.host}${API_POST_OPINION_EVALUAR_GUARDAR_FIRMA(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT,data);
  }

  /**
   * 
   * @param tramite 
   * @param folioTramite 
   * @param data 
   * @returns 
   */
   postopinionregistrarGuardar(tramite: number, folioTramite: string, data: any): Observable<BaseResponse<any>>{
        const ENDPOINT = `${this.host}${API_POST_OPINION_EVALUAR_GUARDAR(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT,data);
  }

  postopinionregistrarFirmar(tramite: number, folioTramite: string, data: any): Observable<BaseResponse<any>>{
        const ENDPOINT = `${this.host}${API_POST_FIRMAR_OPINION(tramite.toString(), folioTramite)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT,data);
  }

  postOpinionDocumento(data: any): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${OPINION_DOCUMENTO()}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, data);
  }

  
  
}

