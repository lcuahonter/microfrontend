import {
  API_CERTIFICACION,
  RFC_QUERY,
} from '../../../constantes/5701/api-constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CertificacionResponse } from '../../models/5701/Certificacion.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CertificacionService {
  /**
   * @description URL del host de la API para certificación
   */
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener la información de la certificación de un RFC
   * @param rfc RFC del contribuyente
   * @param tipo Tipo de certificación (TICPSE.PROSEC)
   * @returns Observable<CertificacionResponse>
   */
  getCertificacion(
    rfc: string,
    tipo: string
  ): Observable<CertificacionResponse> {
    const ENDPOINT = `${this.host}${API_CERTIFICACION.replace(
      RFC_QUERY,
      rfc
    )}/${tipo}`;
    return this.http.get<CertificacionResponse>(ENDPOINT).pipe(
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
