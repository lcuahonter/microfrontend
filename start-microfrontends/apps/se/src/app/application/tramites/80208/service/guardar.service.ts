import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

import { Observable, catchError, map, throwError } from 'rxjs';

import { API_GET_CERTIFICADO_ANTIGUEDAD, API_GET_MOLINOS_ACERO_HABILITAR, API_POST_SOLICITUD } from '../servers/api-route';
import { GuadarSolicitudResponse } from '../modelos/response/guardar-solicitud-response.model';

@Injectable({
  providedIn: 'root'
})
export class GuardarService {

  /**
   * La URL base del servidor al que se realizarán las solicitudes.
   * Esta propiedad es de solo lectura y se utiliza para construir las rutas de los servicios.
   */
  private readonly servidor: string;

  /**
   * Crea una nueva instancia del servicio `guardar.service`.
   * Inicializa la propiedad `servidor` con la URL base de la API utilizando la constante `ENVIRONMENT.API_HOST`.
   * 
   * @param http Instancia de `HttpClient` utilizada para realizar solicitudes HTTP al servidor.
   */
  constructor(private http: HttpClient) {
    this.servidor = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Guarda la solicitud del trámite 80208.
   * @param solicitud Objeto que contiene los datos de la solicitud a guardar.
   * @returns Observable con la respuesta del servidor.
   */
  postSolicitud(solicitud: unknown): Observable<BaseResponse<GuadarSolicitudResponse>> {
    const ENDPOINT = `${this.servidor}` + API_POST_SOLICITUD;
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
    const ENDPOINT = `${this.servidor}${API_GET_CERTIFICADO_ANTIGUEDAD}`;

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
      `${this.servidor}` +
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
