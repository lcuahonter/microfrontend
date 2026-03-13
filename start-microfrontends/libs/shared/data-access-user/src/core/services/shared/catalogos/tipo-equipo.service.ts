import { API_GET_TIPO_EQUIPO, COMUN_URL } from "../../../servers/api-router";
import { Observable, catchError, map, throwError } from "rxjs";
import { CatalogosResponse } from "../../../models/shared/catalogo.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class TipoEquipoService {
  /**
   * Host de la API
   */
  private readonly host: string;

    constructor(private http: HttpClient) { 
        this.host = `${COMUN_URL.BASE_URL}`;
    }

  /**
   * Petición get a la API para obtener el catálogo de tipo de equipo en el trasnporte ferroviario.
   * @returns Observable con la lista de respuestas del catálogo.
   */
  getTipoEquipo(): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}${API_GET_TIPO_EQUIPO}`;

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
