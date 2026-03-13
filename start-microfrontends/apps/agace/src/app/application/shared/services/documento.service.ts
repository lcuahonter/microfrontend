import { DocumentoResponse, DocumentosRequest } from '@libs/shared/data-access-user/src/core/models/shared/documentos-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import {
  API_POST_GUARDAR_ACUSE,
  API_POST_GUARDAR_CERTIFICADO,
  API_POST_VISTA_PREVIA,
  API_POST_VISTA_PREVIA_CERTIFICADO
} from '../../core/server/api-router';

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class DocumentoService {

  /**
     * @description Host de la API.
     * @type {string}
     */
    private readonly urlServerHost: string;

  constructor(private http: HttpClient) {  
    this.urlServerHost = `${ENVIRONMENT.API_HOST}/api/`;
  }

  subirDocumento(token: string, file: File): Observable<{ message: string }> {
    const HEADERS = new HttpHeaders({
      jwt: `${token}`,
      idUser: 1,
    });

    const FORM_DATA = new FormData();
    FORM_DATA.append('file', file, file.name);


    return this.http.put<{ message: string }>(`${this.urlServerHost}/upload`, FORM_DATA, {
      headers: HEADERS,
    });
  }

  /**
   * @description Función para generar el pdf  del acuse
   * @param id
   * @returns JSONResponse
   */
  generarAcuse(cuerpoAcuse: unknown): Observable<unknown> {
    return this.http
      .put<unknown>(`${this.urlServerHost}create-pdf`, cuerpoAcuse)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * @description Función para generar el pdf del documento
   * @param body
   * @returns BaseResponse
   */
  generarDoc<T>(body: DocumentosRequest): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${this.urlServerHost}generador-documento/tramite/documento`, body);
  }

  /**
   * @description Función para visualizar el documento
   * @param nombre
   * @returns BaseResponse<DocumentoResponse>
   */
  getVisualizarDoc(nombre: string): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT = `${this.urlServerHost}generador-documento/tramite/documento/${nombre}`;
    return this.http.get<BaseResponse<DocumentoResponse>>(ENDPOINT).pipe(
      map(
        (response) => {
          return response;
        }),
      catchError(() => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
        return throwError(() => ERROR);
      })
    );
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
        `${this.urlServerHost}` +
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
        `${this.urlServerHost}` +
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
