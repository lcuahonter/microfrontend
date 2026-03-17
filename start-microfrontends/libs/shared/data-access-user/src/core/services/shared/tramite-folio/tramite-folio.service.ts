import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../../../enviroments/enviroment';
import { JSONResponse } from '../../../models/shared/catalogos.model';
import { TramiteFolioResponse } from '../../../models/shared/tramite-folio.model';

@Injectable({
  providedIn: 'any',
})
export class TramiteFolioService {
  /**
   * @description URL del servidor para obtener el trámite
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient) {}

  /**
   * @description Función para obtener el trámite
   * @param id
   * @returns JSONResponse
   */
  /**
   *
   * @deprecated Este método está obsoleto y se eliminará en futuras versiones. Cuando se tenga la API se generará un nuevo método para obtener el trámite.
   */
  obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @description Función para obtener el folio del trámite
   * @param id
   * @returns Observable<TramiteFolioResponse>
   */
  generarFolio(): Observable<TramiteFolioResponse> {
    const ENDPOINT = 'assets/json/5701/folio-tramite.json';
    return this.http.get<TramiteFolioResponse>(ENDPOINT).pipe(
      tap((response) => {
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
