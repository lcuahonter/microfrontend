import { API_GET_FABIRCANTE_NACIONAL, API_GET_HISTORICO_FABRICANTES } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FabricanteNacionalRfcResponse } from '../models/response/fabricante-nacional-response.model';
import { FabricanteResponse } from '../models/response/historico-fabricantes-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricoFabricantesService {

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
   * Consulta el histórico de fabricantes para un tipo y solicitud específicos.
   * @param tipoFabricante Tipo de fabricante (por ejemplo, 'importador', 'exportador').
   * @param idSolicitud ID de la solicitud asociada al fabricante.
   * @returns Observable con la respuesta del servidor que contiene el histórico de fabricantes.
   */
  getFabricantes(tipoFabricante: string, idSolicitud: number): Observable<BaseResponse<FabricanteResponse>> {
    const ENDPOINT = `${this.host}${API_GET_HISTORICO_FABRICANTES(tipoFabricante, idSolicitud.toString())}`;
    return this.http.get<BaseResponse<FabricanteResponse>>(ENDPOINT);
  }

  /**
   * Consulta la información de un fabricante nacional por su RFC.
   * @param rfc RFC del fabricante nacional a consultar.
   * @returns Observable con la respuesta del servidor que contiene la información del fabricante nacional.
   */
  getFabricanteNacional(rfc: string): Observable<BaseResponse<FabricanteNacionalRfcResponse>> {
    const ENDPOINT = `${this.host}${API_GET_FABIRCANTE_NACIONAL(rfc)}`;
    return this.http.get<BaseResponse<FabricanteNacionalRfcResponse>>(ENDPOINT);
  }

}
