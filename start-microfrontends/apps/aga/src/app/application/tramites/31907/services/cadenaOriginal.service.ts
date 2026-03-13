import { API_POST_CADENA_ORIGINAL, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CadenaOriginalRequest } from '../models/cadena-original-request';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TRAMITE_ID } from '../constantes/cancelar-reporte-const';

@Injectable({
  providedIn: 'root',
})
export class CadenaOriginal31907Service {
  /**
   * URL del servidor donde se encuentra la API.
   */
  urlServer = ENVIRONMENT.API_HOST + '/api/';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la cadena original del trámite 130118.
   * @param body Objeto que contiene los datos necesarios para generar la cadena original.
   * @returns Un observable que emite la respuesta del servidor con la cadena original.
   */
  obtenerCadenaOriginal<T>(
    idSolicitud: string,
    body: CadenaOriginalRequest
  ): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.urlServer}${API_POST_CADENA_ORIGINAL(
      idSolicitud,
      TRAMITE_ID
    )}`;

    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(
          `Error al obtener la cadena original en ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
