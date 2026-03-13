import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_REQUERIMIENTO_DETALLE, COMUN_URL, IDREQUERIMIENTO, TRAMITE } from '../../servers/api-router';
import { BaseResponse } from '../../models/shared/base-response.model';
import { Observable } from 'rxjs';
import { RequerimientoDetalleResponse } from '../../models/shared/requerimiento-detalle-response.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleRequerimientoService {

  /**
   * URL base del servicio
   */
  private readonly host: string;

  /**
   * Constructor del servicio DetalleRequerimientoService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Consulta el detalle completo de un requerimiento específico
   * @param tramite Número identificador del trámite
   * @param idRequerimiento ID único del requerimiento a consultar
   * @returns Observable con la respuesta del servidor
 */
  getDetalleRequerimiento(tramite: number, idRequerimiento: number): Observable<BaseResponse<RequerimientoDetalleResponse>> {
    const ENDPOINT = `${this.host}${API_GET_REQUERIMIENTO_DETALLE.replace(TRAMITE, tramite.toString()).replace(IDREQUERIMIENTO, idRequerimiento.toString())}`;
    return this.http.get<BaseResponse<RequerimientoDetalleResponse>>(ENDPOINT);
  }
}