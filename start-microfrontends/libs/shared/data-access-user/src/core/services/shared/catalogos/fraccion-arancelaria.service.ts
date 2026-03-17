import { API_GET_FRACCION_ARANCELARIA, API_GET_FRACCION_ARANCELARIA_CVE, API_GET_NICO, COMUN_URL, CVEFRACCION } from '../../../servers/api-router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogosResponse } from '../../../models/shared/catalogo.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FraccionArancelariaService {

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
 * Consulta el catálogo completo de fracciones arancelarias.
 *
 * @returns {Observable<CatalogosResponse>} Un observable que emite la respuesta del catálogo de fracciones.
 */
  getFracciones(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_FRACCION_ARANCELARIA}`;

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

  /**
 * Consulta una fracción arancelaria específica usando su clave.
 *
 * @param {string} cveFraccion - Clave de la fracción arancelaria a consultar.
 * @returns {Observable<CatalogosResponse>} Un observable con la respuesta de la fracción solicitada.
 */
  getFraccionesCve(cveFraccion: string): Observable<CatalogosResponse> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_FRACCION_ARANCELARIA_CVE.replace(CVEFRACCION, cveFraccion);

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

  /**
  * Consulta el catálogo NICO (Número de Identificación Comercial) asociado a una fracción arancelaria.
  *
  * @param {string} cveFraccion - Clave de la fracción arancelaria.
  * @returns {Observable<CatalogosResponse>} Un observable con la respuesta del catálogo NICO relacionado.
  */
  getNico(cveFraccion: string): Observable<CatalogosResponse> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_NICO.replace(CVEFRACCION, cveFraccion);

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
