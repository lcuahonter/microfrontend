import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_POST_GUARDAR_SOLICITUD } from '../../../constantes/231001/api-constants';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarResponse } from '../models/guardar-solicitud-response';
import { GuardarSolicitud231001Request } from '../models/guardar-solicitud-request';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GuardarService {
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
    solicitud: GuardarSolicitud231001Request
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.host}` + API_POST_GUARDAR_SOLICITUD;

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
