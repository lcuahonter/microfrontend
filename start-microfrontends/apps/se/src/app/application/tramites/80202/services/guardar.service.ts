import { API_GET_CERTIFICADO_ANTIGUEDAD, API_GET_MOLINOS_ACERO_HABILITAR, API_POST_SOLICITUD } from '../servers/api-routes';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuadarSolicitudResponse } from '../models/response/guardar_response.model';
import { Injectable } from '@angular/core';

/**
 * @service GuardarService
 * @description Servicio para guardar solicitudes y obtener información relacionada al trámite 80202.
 * @author Ultrasist
 * @date 2025-09-30
 */
@Injectable({
  providedIn: 'root'
})

export class GuardarService {
  /** URL base del API para las solicitudes. */
  private readonly host: string;

  /** Inyección de HttpClient para llamadas HTTP. */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Guarda la solicitud del trámite 80202.
   * @param solicitud Objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postSolicitud(solicitud: unknown): Observable<BaseResponse<GuadarSolicitudResponse>> {
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
  /** Obtiene el certificado de antigüedad. */
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
  /** Obtiene los molinos habilitados para una fracción arancelaria específica. */
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

