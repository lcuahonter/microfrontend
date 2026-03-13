import { Observable, catchError, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@ng-mf/data-access-user';

@Injectable({
  providedIn: 'root',
})
export class ServiciosExtraordinariosService {

  /**
   * URL del servidor para acceder a los catálogos auxiliares definidos en el entorno.
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un catálogo por su ID desde el servidor.
   * @param id - Identificador único del catálogo a obtener.
   * @returns Un observable que emite la respuesta JSON del servidor.
   */
  getCatalogoById(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServerCatalogos}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
