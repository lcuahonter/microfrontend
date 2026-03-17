import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_OPINION_DETALLE, COMUN_URL, IDOPINION, TRAMITE } from '../../servers/api-router';
import { BaseResponse } from '../../models/shared/base-response.model';
import { Observable } from 'rxjs';
import { OpinionDetalleResponse } from '../../models/shared/opinion-detalle-response.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleOpinonService {

  /**
   * URL base del servicio
   */
  private readonly host: string;

  /**
   * Constructor del servicio DetalleOpinonService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * @method getDetalleOpinion
   * @description Obtiene el detalle completo de una opinión específica
   * 
   * Realiza una petición GET al endpoint correspondiente para recuperar toda la información
   * detallada de una opinión en particular, identificada por su ID y número de trámite.
   * 
   * @param {number} tramite - Número identificador del trámite relacionado
   * @param {string} idOpinion - Identificador único de la opinión a consultar
   * @returns {Observable<BaseResponse<OpinionDetalleResponse>>} Observable que emite la respuesta del servidor
   *          con la estructura BaseResponse conteniendo los detalles de la opinión
  */
  getDetalleOpinion(tramite: number, idOpinion: string): Observable<BaseResponse<OpinionDetalleResponse>> {
    const ENDPOINT = `${this.host}${API_GET_OPINION_DETALLE.replace(TRAMITE, tramite.toString()).replace(IDOPINION, idOpinion)}`;
    return this.http.get<BaseResponse<OpinionDetalleResponse>>(ENDPOINT);
  }
}
