import { API_GET_ENTIDADES_FEDERATIVAS, API_GET_ENTIDADES_FEDERATIVAS_CLAVE, COMUN_URL, CVEENTIDAD } from '../../../servers/api-router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogosResponse } from '../../../models/shared/catalogo.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EntidadesFederativasService {

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
   * Obtiene el catálogo de entidades federativas.
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getEntidades(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_ENTIDADES_FEDERATIVAS}`;

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
   * Obtiene el catálogo de secciones aduaneras de una entidad federativa específica.
   * @param cveRegimen Clave del régimen aduanero por el que se filtrará la información.
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getEntidadesCve(cveEntidad: string): Observable<CatalogosResponse> {
    const ENDPOINT =
      `${this.host}` +
      API_GET_ENTIDADES_FEDERATIVAS_CLAVE.replace(CVEENTIDAD, cveEntidad);

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
