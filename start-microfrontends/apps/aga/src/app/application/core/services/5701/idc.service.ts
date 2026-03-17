import { API_GET_RFC_IDC, RFC_QUERY } from '../../../constantes/5701/api-constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { IdcResponse } from '../../models/5701/idc.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdcService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene la información del contribuyente por su RFC.
   * @param rfc RFC del contribuyente.
   * @returns Observable con la respuesta del servicio.
   */
  getInformacionContribuyente(rfc: string): Observable<IdcResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_RFC_IDC.replace(RFC_QUERY, rfc);

    return this.http.get<IdcResponse>(ENDPOINT).pipe(
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
