import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  API_POST_CADENA_ORIGINAL,
  IDSOLICITUD,
} from '../../../constantes/231001/api-constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CadenaOriginalRequest } from '../models/cadena-original-request';

@Injectable({
  providedIn: 'root',
})
export class CadenaOriginal231001Service {
  /**
   * URL del servidor donde se encuentra la API.
   */
  urlServer = ENVIRONMENT.API_HOST;

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
    const ENDPOINT =
      `${this.urlServer}/api/` +
      API_POST_CADENA_ORIGINAL.replace(IDSOLICITUD, idSolicitud);

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
