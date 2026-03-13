import { AvisoValor, PreOperativo, RespuestaConsulta } from '../models/aviso.model';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * @class
 * @name AvisoUnicoService
 * @description
 * Servicio que proporciona métodos para obtener datos relacionados con el aviso único.
 */
@Injectable({
  providedIn: 'root'
})
export class AvisoUnicoService {
  /**
   * Constructor del servicio `AvisoUnicoService`.
   * @param http Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient) {}

  /**
   * @method
   * @name obtenerDatosLocalidad
   * @description
   * Obtiene los datos de la localidad desde un archivo JSON local.
   * @returns {Observable<unknown>} Un observable que emite los datos de la localidad.
   * Si ocurre un error, lo captura y lanza como un observable de error.
   */
  obtenerDatosLocalidad(): Observable<unknown> {
    return this.http.get('assets/json/31201/aviso.json').pipe(
      catchError((error: unknown) => throwError(() => error))
    );
  }

  /**
   * @method
   * @name getSolicitante
   * @description
   * Obtiene los datos del solicitante desde un archivo JSON.
   * @returns {Observable<AvisoValor>} Un observable que emite un objeto `AvisoValor`.
   */
  getSolicitante(): Observable<AvisoValor> {
    return this.http.get<AvisoValor>('assets/json/31201/renovacion.json');
  }

  /**
   * @method
   * @name obtenerRadio
   * @description
   * Obtiene una lista de objetos de tipo `PreOperativo` desde un archivo JSON local.
   * @returns {Observable<PreOperativo[]>} Un observable que emite un arreglo de objetos `PreOperativo`.
   * @example
   * this.avisoUnicoService.obtenerRadio().subscribe((data: PreOperativo[]) => {
   *   console.log(data);
   * });
   */
  obtenerRadio(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/31201/tipoPersonaradio.json');
  }

  /**
   * @method
   * @name getDatosConsulta
   * @description
   * Obtiene los datos para la consulta del trámite desde un archivo JSON.
   * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/31201/consulta_31201.json');
  }
}
