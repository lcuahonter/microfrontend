import {
  API_GET_SECCION_ADUANA,
  CLAVE_ADUANA_QUERY,
  COMUN_URL,
} from '../../../servers/api-router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogosResponse } from '../../../models/shared/catalogo.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeccionAduanaService {
  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  private readonly host: string;

  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   *Obtiene el catalogo de las secciones de aduanas de una aduana en particular de la API `catalogo/aduanas/`
   * @param claveAduana Clave de la aduana a consultar
   * @returns Observable<CatalogosResponse> Respuesta del API `catalogo/aduanas/`
   */
  getListaSeccionesAduanas(claveAduana: string): Observable<CatalogosResponse> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_SECCION_ADUANA.replace(CLAVE_ADUANA_QUERY, claveAduana);

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
