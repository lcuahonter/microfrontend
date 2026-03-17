import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

import { AvisoValor } from '../models/aviso.model';
import { CatalogoResponse } from '@libs/shared/data-access-user/src';

/**
 * @class
 * @name AvisoUnicoService
 * @description
 * Servicio que proporciona métodos para obtener datos relacionados con el aviso único.
 */
@Injectable({
  providedIn: 'root',
})
export class AvisoUnicoService {
  /**
   * Constructor del servicio `AvisoUnicoService`.
   * @param http Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient) {
    // Constructor
  }
private jsonUrl = 'assets/json/33303';
 private fileName = 'tipoDeAviso.json';
  /**
   * @method
   * @name obtenerDatosLocalidad
   * @description
   * Obtiene los datos de la localidad desde un archivo JSON.
   * @returns {Observable<unknown>} Un observable que emite los datos de la localidad.
   * En caso de error, lanza un observable con el error capturado.
   */
  obtenerDatosLocalidad(): Observable<unknown> {
    return this.http.get('assets/json/33303/aviso.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @method
   * @name getSolicitante
   * @description
   * Obtiene los datos del solicitante desde un archivo JSON.
   * @returns {Observable<unknown>} Un observable que emite los datos del solicitante.
   */
  getSolicitante(): Observable<AvisoValor> {
    return this.http.get<AvisoValor>('assets/json/33303/renovacion.json');
    }
 /**
   * @method
   * @name getAvisoModify
   * @description
   * Obtiene los datos del solicitante desde un archivo JSON.
   * @returns {Observable<CatalogoResponse>} Un observable que emite los datos del solicitante.
   */

getAvisoModify(): Observable<CatalogoResponse> {
   return this.http.get<CatalogoResponse>('assets/json/33303/tipoDeAviso.json');
  }
}