import { API_GET_PAISES, API_GET_PAISES_SAT_T130118, COMUN_URL } from '../../../servers/api-router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogoPaisesResponse } from '../../../models/shared/catalogos.model';
import { CatalogosResponse } from '../../../models/shared/catalogo.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaisesService {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`
  }

  /**
   * Obtiene el listado de los países
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getListaPaises(): Observable<CatalogoPaisesResponse> {
    const ENDPOINT = `${this.host}${API_GET_PAISES}`;

    const HEADER = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Authorization',
      })
    };

    return this.http.get<CatalogoPaisesResponse>(ENDPOINT, HEADER).pipe(
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
  * Obtiene el catálogo de países para el trámite T130118.
  * @returns Observable con la lista de respuestas del catálogo.
  */
  getPaisesT130118(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_PAISES_SAT_T130118}`;

    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
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
