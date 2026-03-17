import { API_GET_VALIDA_CERTIFICACIONES, RFC_QUERY, TIPO_TRAMITE_QUERY } from '../../../constantes/5701/api-constants';
import { CatalogosBooleanResponse, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CertificacionOeaService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Valida las certificaciones de un RFC para un tipo de tramite
   * @param tipoTramite Tipo de tramite a validar
   * @param rfc RFC a validar
   * @return Observable<CatalogosBooleanResponse> Respuesta de la validación
   */
  getValidacionCertificacion(tipoTramite: string, rfc: string): Observable<CatalogosBooleanResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_VALIDA_CERTIFICACIONES.replace(TIPO_TRAMITE_QUERY, tipoTramite).replace(RFC_QUERY, rfc);

    return this.http.get<CatalogosBooleanResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
        return throwError(() => ERROR);
      })
    );
  }
}
