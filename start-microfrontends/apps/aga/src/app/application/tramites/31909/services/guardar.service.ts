import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_POST_GUARDAR_SOLICITUD } from './../../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarResponse } from '../models/guardar-solicitud-response';
import { GuardarSolicitud31909Request } from '../models/guardar-solicitud-request';
import { Injectable } from '@angular/core';
import { TRAMITE_ID } from '../constantes/renovar-reporte-const';

@Injectable({
  providedIn: 'root',
})
export class GuardarServiceT31909 {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Guarda la solicitud del trámite 130118.
   * @param solicitud Objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postSolicitud(
    solicitud: GuardarSolicitud31909Request
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_GUARDAR_SOLICITUD(TRAMITE_ID)}`;

    return this.http
      .post<BaseResponse<GuardarResponse>>(ENDPOINT, solicitud)
      .pipe(
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
