import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { Observable, catchError, map, throwError } from 'rxjs';
import { API_GET_INICIO } from '../server/api-router';
import { IniciarRequest } from '../model/request/iniciar-request.model';


@Injectable({
  providedIn: 'root'
})
export class IniciarService {

  /**
   * URL del servidor donde se encuentra la API.
   */
  private readonly host: string;

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Inicia el trámite 130118.
   * @param rfc RFC del contribuyente.
   * @returns Observable con la respuesta del servidor.
   */
  postIniciar(PAYLOAD: IniciarRequest): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}` + API_GET_INICIO;

    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD).pipe(
      map((response) => {
        return response;
      }),
      catchError((httpError) => {
        if (httpError instanceof HttpErrorResponse) {
          return throwError(() => ({
            success: false,
            error: httpError.error,
          }));
        }
        const ERROR = new Error(
          `Ocurrió un error al guardar la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }
}
