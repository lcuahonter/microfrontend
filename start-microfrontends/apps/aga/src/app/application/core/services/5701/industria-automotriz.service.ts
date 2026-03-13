import { API_GET_INDUSTRIA_AUTOMOTRIZ, RFC_QUERY } from '../../../constantes/5701/api-constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { IndustriaAutomotrizResponse } from '../../models/5701/certificacion-automotriz.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndustriaAutomotrizService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Método para obtener la entidad o persona asociada a un proceso de comercio o negocio que interactúa con el sistema.
   */ 
  getCertificacionAutomotriz(rfc: string): Observable<IndustriaAutomotrizResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_INDUSTRIA_AUTOMOTRIZ.replace(RFC_QUERY, rfc);

    return this.http.get<IndustriaAutomotrizResponse>(ENDPOINT).pipe(
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
