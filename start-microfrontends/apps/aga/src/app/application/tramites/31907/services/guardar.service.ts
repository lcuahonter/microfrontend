import { API_GET_DETALLE_SOLICITUD, API_POST_GUARDAR_SOLICITUD } from './../../../core/server/api-router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { DetalleSolicitud31907 } from '../models/t31907.model';
import { GuardarResponse } from '../models/guardar-solicitud-response';
import { GuardarSolicitud31907Request } from '../models/guardar-solicitud-request';
import { Injectable } from '@angular/core';
import { TRAMITE_ID } from '../constantes/cancelar-reporte-const';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root',
})
export class GuardarServiceT31907 {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }


  /**
   * Obtiene el detalle de una solicitud por su folio.
   * @param folio folio de la solicitud
   * @returns Observable con la respuesta del servidor.
   */
  obtenerDetalleSolicitud(folio: string): Observable<BaseResponse<DetalleSolicitud31907>> {
    const ENDPOINT = `${this.host}${API_GET_DETALLE_SOLICITUD(TRAMITE_ID, folio)}`;
    return this.http.get<BaseResponse<DetalleSolicitud31907>>(ENDPOINT);
  }

  /**
   * Guarda la solicitud del trámite 130118.
   * @param solicitud Objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postSolicitud(
    solicitud: GuardarSolicitud31907Request
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
