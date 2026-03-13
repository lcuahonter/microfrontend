import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuadarSolicitudResponse } from '../model/response/guardar-solicitud-response.model';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, throwError } from 'rxjs';

import { API_GET_CERTIFICADO_ANTIGUEDAD, API_GET_MOLINOS_ACERO_HABILITAR, API_POST_SOLICITUD, CVEFRACCION } from '../server/api-router';
import { GuadarSolicitudRequest } from '../model/request/guardar-solicitud-request.model';

@Injectable({
  providedIn: 'root'
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
  postSolicitud(solicitud: GuadarSolicitudRequest): Observable<BaseResponse<GuadarSolicitudResponse>> {
    const ENDPOINT = `${this.host}` + API_POST_SOLICITUD;

    return this.http.post<BaseResponse<GuadarSolicitudResponse>>(ENDPOINT, solicitud).pipe(
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

  /**
   * Obtiene el certificado de antigüedad.
   * @returns Observable con la respuesta del servidor.
   */
  getCertificadoAntiguedad(): Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_GET_CERTIFICADO_ANTIGUEDAD}`;

    return this.http.get<BaseResponse<null>>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene los molinos habilitados para una fracción arancelaria específica.
   * @param cveFraccion Clave de la fracción arancelaria.
   * @returns Observable con la respuesta del servidor que indica si los molinos están habilitados.
   */
  getMolinosHabilitar(cveFraccion: string): Observable<BaseResponse<boolean>> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_MOLINOS_ACERO_HABILITAR(cveFraccion);

    return this.http.get<BaseResponse<boolean>>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT} `
        );
        return throwError(() => ERROR);
      })
    );
  }
}
