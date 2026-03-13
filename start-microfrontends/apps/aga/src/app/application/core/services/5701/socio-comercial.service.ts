import { API_GET_SOCIO_COMERCIAL, ID_SOCIO_COMERCIAL_QUERY } from '../../../constantes/5701/api-constants';
import { CatalogosBooleanResponse, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocioComercialService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener la entidad o persona asociada a un proceso de comercio o negocio que interactúa con el sistema.
   * @param claveSocioComercial Clave del socio comercial a consultar.
   * @returns Observable<CatalogosBooleanResponse> Respuesta del servicio con la información del socio comercial.
   */
  getSocioComercial(claveSocioComercial: string): Observable<CatalogosBooleanResponse> {
    const ENDPOINT = `${this.host}` + API_GET_SOCIO_COMERCIAL.replace(ID_SOCIO_COMERCIAL_QUERY, claveSocioComercial);

    return this.http.get<CatalogosBooleanResponse>(ENDPOINT).pipe(
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
