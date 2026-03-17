import {
  API_GET_RECINTO,
  CLAVE_ADUANA_QUERY,
  COMUN_URL,
} from '../../../servers/api-router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecintoResponse } from '../../../models/shared/recinto.model';

@Injectable({
  providedIn: 'root',
})
export class RecintoService {
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene la lista de recintos fiscalizados de una aduana.
   * @param claveAduana: {string} Clave de la aduana para la que se desea obtener la lista de recintos.
   * @returns {Observable: RecintoResponse} que emite la respuesta del API con la lista de recintos fiscalizados.
   */
  getListaRecintos(claveAduana: string): Observable<RecintoResponse> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_RECINTO.replace(CLAVE_ADUANA_QUERY, claveAduana);

    return this.http.get<RecintoResponse>(ENDPOINT).pipe(
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
