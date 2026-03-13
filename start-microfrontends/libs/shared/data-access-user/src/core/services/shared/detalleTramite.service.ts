import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  API_GET_TRAMITE_DETALLE,
  API_POST_GUARDAR_ACUSE,
  API_POST_GUARDAR_RESOLUCION,
  API_POST_VISTA_PREVIA,
  COMUN_URL
} from '../../servers/api-router';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseResponse } from '../../models/shared/base-response.model';
import { DocumentoResponse } from '../../models/shared/documentos-request.model';
import { GuardarResolucionResponse, TramiteDetalle } from '../../models/shared/tramite-folio.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentosTramiteResolucionService {
  /**
   * URL base del servicio
   */
  private host: string;

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
   * @returns Observable con la respuesta del servidor
   */
  guardarAcuse(
    idSolicitud: string,
    procedure: number
  ): Observable<BaseResponse<null>> {
    const ENDPOINT =
      `${this.host}` + API_POST_GUARDAR_ACUSE(idSolicitud, procedure);

    return this.http.post<BaseResponse<null>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Guarda el acuse de la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @returns Observable con la respuesta del servidor
   */
  guardarResolucion(
    tramite: string,
    idResolucion: number
  ): Observable<BaseResponse<GuardarResolucionResponse>> {
    const ENDPOINT =
      `${this.host}` + API_POST_GUARDAR_RESOLUCION(tramite, idResolucion);

    return this.http.post<BaseResponse<GuardarResolucionResponse>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
  /**
   * Obtiene el detalle del trámite por folio
   * @param tramite trámite
   * @param idFolio folio
   * @returns 
   */
  getDetalleTramiteByFolio(tramite: string, idFolio: string): Observable<BaseResponse<TramiteDetalle>> {
    const ENDPOINT = `${this.host}${API_GET_TRAMITE_DETALLE(tramite, idFolio)}`;
    return this.http.get<BaseResponse<TramiteDetalle>>(ENDPOINT);
  }


  /**
   * Obtiene la vista previa del documento asociado a la solicitud
   * @param idSolicitud Identificador de la solicitud
   * @returns Observable con la respuesta del servidor que contiene el documento
   */
  vistaPrevia(
    idSolicitud: string,
    procedure: number
  ): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT =
    
      `${this.host}` + API_POST_VISTA_PREVIA(idSolicitud, procedure);

    return this.http.post<BaseResponse<DocumentoResponse>>(ENDPOINT, null).pipe(
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
