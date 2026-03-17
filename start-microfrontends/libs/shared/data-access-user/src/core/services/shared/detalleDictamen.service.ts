import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_DICTAMEN_DETALLE, API_GET_DICTAMEN_DETALLE_OBSERVACION, COMUN_URL, IDDICTAMEN, IDOBSERVACION, TRAMITE } from '../../servers/api-router';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DictamenDetalleResponse } from '../../models/shared/dictamen-detalle-response.model';
import { Observable } from 'rxjs';
import { ObservacionDetalleResponse } from '../../models/shared/observacion-detalle-response.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleDictamenService {

  /**
   * URL base del servicio
   */
  private readonly host: string;

  /**
   * Constructor del servicio DetalleDictamenService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Consulta el detalle completo de un dictamen específico
   * @param tramite Número identificador del trámite
   * @param idDictamen ID único del dictamen a consultar
   * @returns Observable con la respuesta del servidor
 */
  getDetalleDictamen(tramite: number, idDictamen: string): Observable<BaseResponse<DictamenDetalleResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DICTAMEN_DETALLE.replace(TRAMITE, tramite.toString()).replace(IDDICTAMEN, idDictamen)}`;
    return this.http.get<BaseResponse<DictamenDetalleResponse>>(ENDPOINT);
  }

  /**
   * Consulta el detalle observacion de un dictamen específico
   * @param tramite Número identificador del trámite
   * @param idObservacion ID único de la observacion a consultar
   * @returns Observable con la respuesta del servidor
 */
  getObservacionDictamen(tramite: number, idObservacion: number): Observable<BaseResponse<ObservacionDetalleResponse>> {
    const ENDPOINT = `${this.host}${API_GET_DICTAMEN_DETALLE_OBSERVACION.replace(TRAMITE, tramite.toString()).replace(IDOBSERVACION, idObservacion.toString())}`;
    return this.http.get<BaseResponse<ObservacionDetalleResponse>>(ENDPOINT);
  }
}