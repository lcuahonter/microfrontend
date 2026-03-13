import { API_GET_ADUANA, API_GET_ADUANA_BY_RFC, COMUN_URL } from '../../../servers/api-router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogosResponse } from '../../../models/shared/catalogo.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AduanaService {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   *Obtiene el catalogo de aduanas
   * @returns {Observable<CatalogosResponse>} Observable con la respuesta del servicio
   */
  getListaAduanas(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` + API_GET_ADUANA;

    const HEADER = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Authorization',
      })
    };

    return this.http.get<CatalogosResponse>(ENDPOINT, HEADER).pipe(
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
   * Obtiene el catalogo de aduanas filtrado por RFC
   * @param rfc RFC del importador/exportador
   * @returns {Observable<CatalogosResponse>} Observable con la respuesta del servicio
   */
  getListaAduanasByRfc(rfc: string): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}` + API_GET_ADUANA_BY_RFC.replace('{rfc}', rfc);

    const HEADER = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Authorization',
      })
    };

    return this.http.get<CatalogosResponse>(ENDPOINT, HEADER).pipe(
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
