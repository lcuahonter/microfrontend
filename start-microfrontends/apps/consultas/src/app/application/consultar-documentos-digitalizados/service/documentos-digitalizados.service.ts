import { API_MOSTRAR_ACUSE, API_POST_CONSULTA_DOC_DIGITALIZACION, API_POST_EXCEL_DOC_DIGITALIZACION } from '../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DocumentoDigitalizadoRequest } from './model/request/documentos-digitalizacion-request.model';

import { DocumentoDigitalizadoResponse } from './model/response/documento-digitalizado-response.model';
import { Observable } from 'rxjs';

import { ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { GenerarExcelRequest } from './model/request/generar-excel-request.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { MostrarAcuseResponse } from './model/response/mostrar-acuse-response.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentosDigitalizadosService {
  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con el tramite 701.
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
   * Obtiene el listado de documento digitalizacion.
   * 
   * @param PAYLOAD - Datos de validación para docuemto digitalizacion
   * @returns Observable con la respuesta de validación del servidor
   */
  postDocumentoDigitalizacion(PAYLOAD: DocumentoDigitalizadoRequest): Observable<BaseResponse<DocumentoDigitalizadoResponse>> {
    const ENDPOINT = `${this.host}${API_POST_CONSULTA_DOC_DIGITALIZACION}`;
    return this.http.post<BaseResponse<DocumentoDigitalizadoResponse>>(ENDPOINT, PAYLOAD);
  }

  /**
    * Muestra el acuse.
    * @param idDocumento - id de la solicitud.
    * @returns Observable con la respuesta del servidor que indica si el fabricante es válido
  */
  postMostrarAcuse(idDocumento: string): Observable<BaseResponse<MostrarAcuseResponse>> {
    const ENDPOINT = `${this.host}${API_MOSTRAR_ACUSE(idDocumento)}`;
    return this.http.post<BaseResponse<MostrarAcuseResponse>>(ENDPOINT, null);
  }

  /**
   * Genera un archivo Excel con los documentos digitalizados.
   * @param PAYLOAD - Datos necesarios para generar el archivo Excel. 
   * @returns Observable con la respuesta del servidor que indica si el fabricante es válido
   */
  postGenerarExcel(PAYLOAD: GenerarExcelRequest): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}${API_POST_EXCEL_DOC_DIGITALIZACION}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }
}
