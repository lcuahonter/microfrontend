import { API_GET_PATENTE, RFC_QUERY } from '../../../constantes/5701/api-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { PatenteResponse } from '../../models/5701/Patente.model';

@Injectable({
  providedIn: 'root',
})
export class PatenteService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene el identificador único asociado a un agente aduanal,
   * apoderado o empresa que realiza operaciones de comercio exterior.
   * Este identificador es utilizado para representar la autorización o registro de una persona o
   * entidad para realizar actividades relacionadas con la importación o exportación de mercancías.
   *
   * En algunos escenarios puede devolver más de un registro.
   *
   * @param rfcSolicitante - El RFC del solicitante.
   * @returns Observable con la lista de patentes asociadas.
   */
  getListaPatente(rfcSolicitante: string): Observable<PatenteResponse> {
    const ENDPOINT = `${this.host}` + API_GET_PATENTE.replace(RFC_QUERY, rfcSolicitante);

    const HEADER = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Expose-Headers': 'Authorization',
      })
    };

    return this.http.get<PatenteResponse>(ENDPOINT, HEADER).pipe(
      map((response) => {
        return response;
      }),
      catchError((error) => {
        const ERROR = new Error(`Ocurrió un error al devolver la información ${ENDPOINT}`);
        return throwError(() => ERROR);
      })
    );
  }

}
