import {
  API_GET_RFC_ORIGEN,
  RFC_QUERY,
} from '../../../constantes/5701/api-constants';
import {
  CatalogosBooleanResponse,
  ENVIRONMENT,
} from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CertificacionOrigenService {
  /**
   * @description URL del servidor para obtener la certificación de origen
   */
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener la validación de un RFC (Registro Federal de Contribuyentes)
   * para saber si está certificado para la revisión de origen.
   * @param rfc - RFC del contribuyente a validar.
   * @returns Observable<CatalogosBooleanResponse> - Respuesta que indica si el RFC está certificado o no.
   */
  getCertificacionOrigen(rfc: string): Observable<CatalogosBooleanResponse> {
    const ENDPOINT =
      `${this.host}` + API_GET_RFC_ORIGEN.replace(RFC_QUERY, rfc);

    return this.http.get<CatalogosBooleanResponse>(ENDPOINT).pipe(
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
