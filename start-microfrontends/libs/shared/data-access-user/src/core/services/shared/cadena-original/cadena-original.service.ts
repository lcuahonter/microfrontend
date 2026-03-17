import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ENVIRONMENT } from '../../../../enviroments/enviroment';

import { BaseResponse } from '../../../models/shared/base-response.model';

@Injectable({
  providedIn: 'root'
})
export class CadenaOriginalService {

  /**
   * @description URL del servidor para obtener el trámite
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  constructor(private http: HttpClient) { }

  /**
 * @description
 * Este método realiza una solicitud HTTP GET a un archivo JSON local ubicado en `assets/json/5701/cadena-original.json`
 * y retorna su contenido tipado como `TramiteFolioResponse`. 
 *
 * @returns {Observable<TramiteFolioResponse>} Un observable que emite la respuesta con la información
 * contenida en el archivo `cadena-original.json`.
 *
 * 
 */
  generarCadena<T>(): Observable<BaseResponse<T>>{
    const ENDPOINT = 'assets/json/5701/cadena-original.json';
    return this.http.get<BaseResponse<T>>(ENDPOINT).pipe(
      tap((response) => {
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
   * @description
   * Este método realiza una solicitud HTTP GET a un archivo JSON local ubicado en `assets/json
   * 
   * @returns {Observable<BaseResponse<T>>}
   */
   generarCadena130118<T>(): Observable<BaseResponse<T>>{
    const ENDPOINT = 'assets/json/130118/cadena-original.json';
    return this.http.get<BaseResponse<T>>(ENDPOINT).pipe(
      tap((response) => {
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
