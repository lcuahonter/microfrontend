import { API_POST_FIRMA, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TRAMITE_ID } from '../constantes/renovar-reporte-const';

@Injectable({
  providedIn: 'root',
})
export class Firma31909Service {
  /**
   * URL del servidor donde se encuentra la API.
   */
  urlServer = ENVIRONMENT.API_HOST + '/api/';

  constructor(private http: HttpClient) {}

  /**
   * Envía una solicitud de firma electrónica.
   * @param idSolicitud - ID de la solicitud a firmar.
   * @param body - Cuerpo de la solicitud de firma.
   * @returns Observable con la respuesta del servidor.
   */
  enviarFirma<T>(
    idSolicitud: string,
    body: FirmarRequest
  ): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.urlServer}${API_POST_FIRMA(
      idSolicitud,
      TRAMITE_ID
    )}`;
    return this.http.post<BaseResponse<T>>(ENDPOINT, body).pipe(
      map((response) => response),
      catchError(() => {
        const ERROR = new Error(
          `Error al firmar solicitud con ID ${idSolicitud}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
