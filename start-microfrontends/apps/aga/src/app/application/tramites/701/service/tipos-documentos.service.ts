import { API_GET_CAT_TIPOS_DOCUMENTOS, API_POST_GUARDAR_SOLICITUD_TRAMITE, API_POST_GUARDAR_TIPOS_DOCUMENTOS } from "../server/api-router";
import { BaseResponse } from "@libs/shared/data-access-user/src/core/models/shared/base-response.model";

import { Catalogo, ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { GuardarTiposDocumentoRequest } from "../models/request/guardar-tipos-documentos-request.model";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { GuardarTiposDocumentosResponse } from "../models/response/guardar-tipos-documentos.model";
import { Injectable } from "@angular/core";
import { SolicitudTramiteRequest } from "../models/request/solicitud-guardar-request.model";

@Injectable({
  providedIn: 'root'
})

export class TiposDocumentosService {

  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 701.
   * Esta variable almacena la dirección del host para los servicios tratados en el tramite 701.
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
   * Consulta el catálogo de tipos de documentos activos.
   * @returns 
   */
  getTiposDocumentos(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CAT_TIPOS_DOCUMENTOS}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Guarda los tipos de documentos seleccionados para una solicitud específica.
   */
  postGuardarTiposDocumentos(idSolicitud: number, PAYLOAD: GuardarTiposDocumentoRequest[]): Observable<BaseResponse<GuardarTiposDocumentosResponse[]>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_TIPOS_DOCUMENTOS(idSolicitud.toString())}`;
    return this.http.post<BaseResponse<GuardarTiposDocumentosResponse[]>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Guarda una solicitud de digitalización.
   */
  postGuardarSolicitudDigitalizacion(payload: SolicitudTramiteRequest): Observable<BaseResponse<{ id_solicitud: number }>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_SOLICITUD_TRAMITE}`;
    return this.http.post<BaseResponse<{ id_solicitud: number }>>(ENDPOINT, payload);
  }
}