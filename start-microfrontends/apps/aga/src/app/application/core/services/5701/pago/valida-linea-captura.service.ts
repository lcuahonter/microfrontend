import { API_GET_VALIDA_LINEA_CAPTURA, API_GET_VALIDA_LINEA_CAPTURA_PAGADA } from '../../../../constantes/5701/api-constants';
import {
  CatalogosBooleanResponse,
  ENVIRONMENT,
} from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidaLineaCapturaPagadaResponse } from '../../../models/5701/linea-captura.model';

@Injectable({
  providedIn: 'root',
})
export class ValidaLineaCapturaService {
  /**
   * Constante que define la URL base del servicio de validación de línea de captura.
   */
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Este método realiza una solicitud HTTP GET para validar una línea de captura específica ha sido usada.
   * @param lineaCaptura La línea de captura a validar.
   * @returns {Observable<CatalogosBooleanResponse>} Un observable que emite la respuesta del servicio
   */
  getValidaLineaCapturaUsada(
    lineaCaptura: string
  ): Observable<CatalogosBooleanResponse> {
    const ENDPOINT = `${this.host}${API_GET_VALIDA_LINEA_CAPTURA.replace(
      '{lineaCaptura}',
      lineaCaptura
    )}`;

    return this.http.get<CatalogosBooleanResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Este método realiza una solicitud HTTP GET para validar si una línea de captura específica ha sido pagada.
   * @param lineaCaptura La línea de captura a validar.
   * @returns {Observable<ValidaLineaCapturaPagadaResponse>} Un observable que emite la respuesta del servicio
   */
  getValidaLineaCaptura(
    lineaCaptura: string
  ): Observable<ValidaLineaCapturaPagadaResponse> {
    const ENDPOINT = `${this.host}${API_GET_VALIDA_LINEA_CAPTURA_PAGADA.replace(
      '{lineaCaptura}',
      lineaCaptura
    )}`;

    return this.http.get<ValidaLineaCapturaPagadaResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(
          `Ocurrió un error al devolver la información ${ENDPOINT}`
        );
        return throwError(() => ERROR);
      })
    );
  }
}
