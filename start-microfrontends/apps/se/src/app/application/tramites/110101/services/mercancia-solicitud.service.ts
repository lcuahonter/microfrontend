import { API_GET_MERCANCIA_EVALUAR } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { EvaluarMercanciaResponse } from "../models/response/mercancia-response.model";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class MercanciaSolicitudService {

  /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110101.
     * Esta variable almacena la dirección del host para los servicios mercancia solicitud.
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
   * @method getMercanciaEvaluar
   * @description Realiza una solicitud HTTP GET al endpoint correspondiente para obtener la información
   * de la mercancía que será evaluada, asociada a una solicitud específica.
   * @param idSolicitud - Identificador único de la solicitud sobre la que se realiza la consulta.
   */
  getMercanciaEvaluar(idSolicitud: string): Observable<BaseResponse<EvaluarMercanciaResponse>> {
    const ENDPOINT = `${this.host}` + API_GET_MERCANCIA_EVALUAR(idSolicitud);
    const PARAMS = new HttpParams().set('preLlenado', Boolean(false));
    return this.http.get<BaseResponse<EvaluarMercanciaResponse>>(ENDPOINT, { params: PARAMS });
  } 
}