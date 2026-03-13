import { API_GET_VALIDA_LINEA_PAGO, LINEA_PAGO_QUERY } from "../../../../constantes/5701/api-constants";
import { CatalogosResponse, ENVIRONMENT } from "@libs/shared/data-access-user/src";
import { Observable, catchError, map, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ValidaLineaPagoService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para validar la línea de pago
   * @param lineaPago La línea de pago a validar
   */
  getLineaPagoValidacion(lineaPago: string): Observable<CatalogosResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_VALIDA_LINEA_PAGO.replace(LINEA_PAGO_QUERY, lineaPago);

    return this.http.get<CatalogosResponse>(ENDPOINT).pipe(
      map((response) => {
        return response;
      }),
      catchError(() => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT} `);
        return throwError(() => ERROR);
      })
    );
  }
}
