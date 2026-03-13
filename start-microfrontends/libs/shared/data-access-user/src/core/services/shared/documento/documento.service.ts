import { API_POST_CADENA_ORIGINAL, API_POST_FIRMA } from '../../../servers/api-router';
import { DocumentoResponse, DocumentosRequest } from '../../../models/shared/documentos-request.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { BaseResponse } from '../../../models/5701/base-response.model';
import { CadenaOriginalRequest } from '../../../models/shared/cadena-original-request.model';
import { ENVIRONMENT } from '../../../../enviroments/enviroment';
import { FirmarRequest } from '../../../models/shared/firma-electronica/request/firmar-request.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentoService {
  private urlServer = ENVIRONMENT.URL_SERVER_UPLOAD;
  private urlServerHost = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) {
    // Lógica de inicialización si es necesario
  }

  subirDocumento(token: string, file: File): Observable<{ message: string }> {
    const HEADERS = new HttpHeaders({
      jwt: `${token}`,
      idUser: 1,
    });

    const FORM_DATA = new FormData();
    FORM_DATA.append('file', file, file.name);


    return this.http.put<{ message: string }>(`${this.urlServer}/upload`, FORM_DATA, {
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
      .put<unknown>(`${this.urlServer}/create-pdf`, cuerpoAcuse)
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
    return this.http.post<BaseResponse<T>>(`${this.urlServerHost}/api/generador-documento/tramite/documento`, body);
  }

  /**
   * @description Función para visualizar el documento
   * @param nombre
   * @returns BaseResponse<DocumentoResponse>
   */
  getVisualizarDoc(nombre: string): Observable<BaseResponse<DocumentoResponse>> {
    const ENDPOINT = `${this.urlServerHost}/api/generador-documento/tramite/documento/${nombre}`;
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
 * @description Obtiene los datos para el payload de firma desde un JSON local
 * @returns Observable con los datos de documentos requeridos para la firma
 */
  obtenerDatosFirma<T>(): Observable<BaseResponse<T>> {
    const ENDPOINT = 'assets/json/5701/documentos-firma.json';
    return this.http.get<BaseResponse<T>>(ENDPOINT).pipe(
      tap(response => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener datos de firma: ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Envía una solicitud de firma electrónica.
   * @param idSolicitud - ID de la solicitud a firmar.
   * @param body - Cuerpo de la solicitud de firma.
   * @returns Observable con la respuesta del servidor.
   */
  enviarFirma<T>(idSolicitud: string | number, body: FirmarRequest, procedure: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.urlServerHost}/api/` + API_POST_FIRMA(String(idSolicitud,), procedure);
    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map(response => response),
      catchError(() => {
        const ERROR = new Error(`Error al firmar solicitud con ID ${idSolicitud}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la cadena original del trámite 130118.
   * @param body Objeto que contiene los datos necesarios para generar la cadena original.
   * @returns Un observable que emite la respuesta del servidor con la cadena original.
   */
  obtenerCadenaOriginal<T>(idSolicitud: string, body: CadenaOriginalRequest, procedure: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.urlServerHost}/api/` + API_POST_CADENA_ORIGINAL(idSolicitud, procedure);

    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }
}
