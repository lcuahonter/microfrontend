import { API_GET_CONSULTA_RESPONSABLE, NUMERO_GAFETE_QUERY, TIPO_GAFETE_QUERY } from '../../../constantes/5701/api-constants';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponsableGafeteResponse } from '../../models/5701/gafete-responsable.model';


@Injectable({
  providedIn: 'root',
})
export class ConsultaResponsableService {

  private readonly host: string;

  constructor(
    private http: HttpClient
  ) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Valida si el número de gafete de un responsable es correcto y devuelve la información del responsable.
   * @param numeroGafete Número de gafete del responsable.
   * @param tipoGafete Tipo de gafete del responsable.
   * @returns Observable<ResponsableGafeteResponse> Información del responsable.
   */
  getGafeteResponsable(numeroGafete: string, tipoGafete: string): Observable<ResponsableGafeteResponse> {
    const ENDPOINT = `${this.host}`+ API_GET_CONSULTA_RESPONSABLE.replace(NUMERO_GAFETE_QUERY, numeroGafete).replace(TIPO_GAFETE_QUERY, tipoGafete);    

    return this.http.get<ResponsableGafeteResponse>(ENDPOINT).pipe(
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
