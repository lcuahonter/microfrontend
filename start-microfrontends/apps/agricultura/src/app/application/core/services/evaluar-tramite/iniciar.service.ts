import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_INICAR_DICTAMEN, API_POST_INICIAR_REQUERIMIENTO } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

import { IniciarDictamenResponse } from '@libs/shared/data-access-user/src/core/models/shared/iniciar-dictamen-response.model';
import { IniciarRequerimientoRequest } from '../../models/evaluar/request/iniciar-requerimiento-request.model';
import { IniciarRequerimientoResponse } from '@libs/shared/data-access-user/src/core/models/shared/Iniciar-requerimiento-response.model';


@Injectable({
  providedIn: 'root'
})
export class IniciarService {

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

  postIniciarDictamen(tramite: number, numFolio: string, PAYLOAD: IniciarRequerimientoRequest):
    Observable<BaseResponse<IniciarDictamenResponse>> {
    const ENDPOINT = `${this.host}${API_GET_INICAR_DICTAMEN(tramite.toString(), numFolio)}`;

    return this.http.post<BaseResponse<IniciarDictamenResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Inicia un nuevo requerimiento en el sistema
   * @param tramite - Número de trámite asociado al requerimiento
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos para iniciar el requerimiento
   * @returns Observable con la respuesta del servidor del requerimiento iniciado
   */
  postIniciarRequerimiento(tramite: number, numFolio: string, PAYLOAD: IniciarRequerimientoRequest):
    Observable<BaseResponse<IniciarRequerimientoResponse>> {
    const ENDPOINT = `${this.host}${API_POST_INICIAR_REQUERIMIENTO(tramite.toString(), numFolio)}`;

    return this.http.post<BaseResponse<IniciarRequerimientoResponse>>(ENDPOINT, PAYLOAD);
  }

}
