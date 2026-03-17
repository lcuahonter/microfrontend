import {
  API_POST_MASIVO,
  GUARDA_SOLICITUD,
} from '../../../core/server/api-router';
import {
  GuardarMasivoT32504Request,
  GuardarResponse,
  GuardarSolicitudT32504Request,
} from '../models/aviso.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { Injectable } from '@angular/core';
import { TRAMITE_ID } from '../constants/aviso.enum';

@Injectable({
  providedIn: 'root',
})
export class GuardarServiceT32504 {
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
    solicitud: GuardarSolicitudT32504Request
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.host}${GUARDA_SOLICITUD(TRAMITE_ID.toString())}`;

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

  /**
   * Servicio para el guardado masivo de solicitudes del trámite 32504.
   * @param archivo archivo que contiene la plantilla con las solicitudes a guardar.
   * @param request objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postGuardarMasivo(
    request: GuardarMasivoT32504Request,
    archivo?: File,
  ): Observable<BaseResponse<GuardarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_MASIVO(TRAMITE_ID)}`;

    const FORM_DATA = new FormData();
    if (archivo) {
      FORM_DATA.append('file', archivo);
    }
    FORM_DATA.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' })
    );

    return this.http
      .post<BaseResponse<GuardarResponse>>(ENDPOINT, FORM_DATA)
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
