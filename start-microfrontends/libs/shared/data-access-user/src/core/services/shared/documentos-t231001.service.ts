import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  API_POST_GUARDAR_ACUSE,
  API_POST_GUARDAR_CERTIFICADO,
  API_POST_VISTA_PREVIA,
  API_POST_VISTA_PREVIA_CERTIFICADO,
  COMUN_URL,
} from '../../servers/api-router';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentoResponse } from '../../models/shared/documentos-request.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentosT2310Service {
  /**
   * URL base del servicio
   */
  private readonly host: string;

  /**
   * Constructor del servicio DocumentosService
   * @param http HttpClient para realizar peticiones HTTP
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Guarda el acuse de la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @param procedure Numero de procedimiento
   * @param esAcuse Indica si es acuse o certificado
   * @returns Observable con la respuesta del servidor
   */
  guardarDocumento(
    idSolicitud: string,
    procedure: number,
    esAcuse: boolean
  ): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT =
      `${this.host}` +
      (esAcuse
        ? API_POST_GUARDAR_ACUSE(idSolicitud, procedure)
        : API_POST_GUARDAR_CERTIFICADO(idSolicitud, procedure));

    return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(`Error al obtener el documento ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la vista previa del documento asociado a la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @param procedure Numero de procedimiento
   * @param esAcuse Indica si es acuse o certificado
   * @returns Observable con la respuesta del servidor que contiene el documento
   */
  vistaPreviaDocumento(
    idSolicitud: string,
    procedure: number,
    esAcuse: boolean
  ): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT =
      `${this.host}` +
      (esAcuse
        ? API_POST_VISTA_PREVIA(idSolicitud, procedure)
        : API_POST_VISTA_PREVIA_CERTIFICADO(idSolicitud, procedure));

    return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(`Error al obtener el documento ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }
}
