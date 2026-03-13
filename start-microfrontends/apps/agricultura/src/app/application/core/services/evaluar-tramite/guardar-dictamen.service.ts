import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { GuardarDictamenRequest } from '../../models/evaluar/request/guardar-dictamen-request.model';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';


import { API_GET_DICTAMEN_CRITERIOS, API_GET_SENTIDOS_DISPONIBLES, API_POST_GUARDAR_DICTAMEN, API_POST_MOSTRAR_FIRMAR } from '@libs/shared/data-access-user/src';
import { CriteriosResponse } from '@libs/shared/data-access-user/src/core/models/shared/criterios-response.model';
import { GuardarDictamenResponse } from '../../models/evaluar/response/guardar-dictamen-response.model';
import { MostrarFirmarRequest } from '../../models/evaluar/request/firmar-mostrar-dictamen.request.model';
import { MostrarFirmarResponse } from '../../models/evaluar/response/mostrar-firmar-response.model';

@Injectable({
  providedIn: 'root'
})
export class GuardarDictamenService {

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
   * Guarda el dictamen del trámite 130118.
   * @param numFolio Número de folio del trámite.
   * @param PAYLOAD Datos del dictamen a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postGuadarDictamen(tramite: number, numFolio: string, PAYLOAD: GuardarDictamenRequest): Observable<BaseResponse<GuardarDictamenResponse>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_DICTAMEN(tramite.toString(), numFolio)}`;
    return this.http.post<BaseResponse<GuardarDictamenResponse>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Inicia el dictamen del trámite 130118.
   * @param numFolio Número de folio del trámite.
   * @returns Observable con la respuesta del servidor.
   */
  getCriterios(tramite: number, idSolicitud: string): Observable<BaseResponse<CriteriosResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DICTAMEN_CRITERIOS(tramite.toString(), idSolicitud)}`;
    return this.http.get<BaseResponse<CriteriosResponse>>(ENDPOINT);
  }

  /**
   * Obtiene los sentidos disponibles para el trámite 130118.
   * @param tramite Número de trámite.
   * @returns Observable con la respuesta del servidor.
   */
  getSentidosDisponibles(tramite: string, numFolio: string): Observable<BaseResponse<SentidosDisponiblesResponse[]>> {
    const ENDPOINT = `${this.host}${API_GET_SENTIDOS_DISPONIBLES(tramite.toString(), numFolio)}`;
    return this.http.get<BaseResponse<SentidosDisponiblesResponse[]>>(ENDPOINT);
  }

  /**
    * Envía una solicitud para mostrar y firmar el dictamen del trámite 130118.
    * @param tramite Número de trámite.   
    * @param numFolio Número de folio del trámite.
    * @param PAYLOAD Datos necesarios para mostrar y firmar el dictamen.
    * @return Observable con la respuesta del servidor.
    * 
    */

  postFirmarMostrar(tramite: number, numFolio: string, PAYLOAD: MostrarFirmarRequest):
    Observable<BaseResponse<MostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_MOSTRAR_FIRMAR(tramite.toString(), numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(ENDPOINT, PAYLOAD);
  }

}
