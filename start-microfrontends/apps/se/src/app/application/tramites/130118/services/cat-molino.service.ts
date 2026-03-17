import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CatalogosResponse, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';

import { API_GET_MOLINO_ACTIVOS } from '../server/api-router';

@Injectable({
  providedIn: 'root'
})
export class CatMolinoService {

  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
    * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
    * Es de solo lectura y se inicializa en el constructor del servicio.
    */
  private readonly host: string;

  /**
   * Constructor del servicio que inicializa la URL base del host.
   * @param http Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene los molinos de acero activos.
   * @returns Observable con la respuesta del servidor.
   */
  getMolinosActivos(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_MOLINO_ACTIVOS}`;

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
