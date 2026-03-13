import { API_GET_CRITERIO_TRATADO_RESUMEN, API_GET_INSUMOS_EMPAQUES } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { DatosCriterioResumenResponse } from "../models/response/tratado-criterio-resumen-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InsumosEmpaquesResponse } from "../models/response/insumos-empaques-response.model";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class TratadosEvaluarService {

  /**
     * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 110102.
     * Esta variable almacena la dirección del host para los servicios tratados solicitud.
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
   * Consulta los insumos y/o empaques dado el identificador de la solicitud, 
   * identidificador de tratado acuerdo y la clave de país o identificador de bloque
   * 
   * @param idSolicitud - Identificador único de la solicitud sobre la que se realiza la consulta.
   * @param idTratadoAcuerdo - Identificador del tratado o acuerdo comercial asociado a la solicitud.
   * @param idBloque - Identificador del bloque económico.
   * @param clavePais - Clave del país al que pertenece la solicitud o donde aplica el tratado.
   * @return Observable con la respuesta de validación del servidor
   */
  getInsumosEmpaques(idSolicitud: string, idTratadoAcuerdo?: string, idBloque?: number | null, clavePais?: string): Observable<BaseResponse<InsumosEmpaquesResponse>> {
    const ENDPOINT = `${this.host}` + API_GET_INSUMOS_EMPAQUES(idSolicitud);
    let PARAMS = new HttpParams();

      if (idTratadoAcuerdo !== null && idTratadoAcuerdo !== '') {
        PARAMS = PARAMS.set('idTratadoAcuerdo', String(idTratadoAcuerdo));
      }

      if (idBloque !== null) { 
        PARAMS = PARAMS.set('idBloque', String(idBloque));
      }

      if (clavePais !== null && clavePais !== '') {
        PARAMS = PARAMS.set('clavePais', String(clavePais));
      }
    return this.http.get<BaseResponse<InsumosEmpaquesResponse>>(ENDPOINT, { params: PARAMS });
  } 

  /**
   * Obtiene el resumen de un criterio de tratado específico.
   * Realiza la petición al endpoint correspondiente y devuelve la información
   * relacionada con la solicitud.
   * 
   * @param idCriterioTratado 
   * @returns Observable con la respuesta de validación del servidor
   */
  getCriterioTratadoResumen(idCriterioTratado: string): Observable<BaseResponse<DatosCriterioResumenResponse>>{
    const ENDPOINT = `${this.host}` + API_GET_CRITERIO_TRATADO_RESUMEN(idCriterioTratado);
    return this.http.get<BaseResponse<DatosCriterioResumenResponse>>(ENDPOINT);
  }
}