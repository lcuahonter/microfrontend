import { CatalogosNumeroResponse, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import {Observable, catchError, map, throwError } from 'rxjs';
import { API_GET_PARAMETRO_MONTO } from '../../../../constantes/5701/api-constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ParametroMontoService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener el monto de cobro del trámite.
   */
  getParametroMonto(): Observable<CatalogosNumeroResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_PARAMETRO_MONTO;

    return this.http.get<CatalogosNumeroResponse>(ENDPOINT).pipe(
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
