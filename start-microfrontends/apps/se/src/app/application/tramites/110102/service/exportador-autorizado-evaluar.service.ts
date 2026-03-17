import { API_GET_EXPORTADOR_AUTORIZADO, API_GET_EXPORTADOR_AUTORIZADO_UE_O_JPN } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";
import { DatosExportadorAutorizadoResponse } from "../models/response/exportador-autorizado-response.model";
import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { ExportadorAutorizadoResponse } from "../models/response/exportador-autorizado-response.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class ExportadorAutorizadoEvaluarService {

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
   * @method getExportadoraAutorizado
   * @description Realiza una solicitud HTTP GET al endpoint correspondiente para obtener la información
   * del exportador para evaluar si es autorizado o rechazado 
   * @param idSolicitud - Identificador único de la solicitud sobre la que se realiza la consulta.
   */
  getExportadorAutorizado(idSolicitud: string): Observable<BaseResponse<ExportadorAutorizadoResponse>> {
      const ENDPOINT = `${this.host}${API_GET_EXPORTADOR_AUTORIZADO(idSolicitud)}`;
      return this.http.get<BaseResponse<ExportadorAutorizadoResponse>>(ENDPOINT);
  }

  /**
   * @method getExportadoAutorizadoEUoJPN
   * @description Realiza una solicitud HTTP GET al endpoint correspondiente para obtener la información
   * del exportador para determinar si es de UE o JPN
   * @param numFolioTramite - numero de folio del trámite sobre el que se realiza la consulta
   */
  getExportadoAutorizadoUEoJPN(numFolioTramite: string): Observable<BaseResponse<DatosExportadorAutorizadoResponse>> {
    const ENDPOINT = `${this.host}${API_GET_EXPORTADOR_AUTORIZADO_UE_O_JPN(numFolioTramite)}`;
    return this.http.get<BaseResponse<DatosExportadorAutorizadoResponse>>(ENDPOINT);
  }
}