import { API_POST_CADENA_ORIGINAL } from '../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { CadenaOriginalRequest } from '../model/request/cadena-original-request.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadenaOriginal11201Service {


  /**
   * Base URL of the API server sourced from the environment configuration (ENVIRONMENT.API_HOST).
   *
   * Used as the root for building HTTP request URLs within this service.
   * Expected to be a fully qualified URL including scheme (e.g. "https://api.example.com").
   * When appending endpoint paths, take care to handle trailing slashes consistently.
   *
   * Example:
   * const endpoint = `${urlServer}/v1/resource`;
   *
   * @readonly
   * @see ENVIRONMENT.API_HOST
   */
  urlServer = ENVIRONMENT.API_HOST;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la cadena original del trámite 130118.
   * @param body Objeto que contiene los datos necesarios para generar la cadena original.
   * @returns Un observable que emite la respuesta del servidor con la cadena original.
   */
  obtenerCadenaOriginal<T>(idSolicitud: string, body: CadenaOriginalRequest): Observable<BaseResponse<T>> {
  const ENDPOINT = `${this.urlServer}/api/` + API_POST_CADENA_ORIGINAL(idSolicitud);

  return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
    map((response) => response),
    catchError(() => {
      const ERROR = new Error(`Error al obtener la cadena original en ${ENDPOINT}`);
      return throwError(() => ERROR);
    })
  );
}


}
