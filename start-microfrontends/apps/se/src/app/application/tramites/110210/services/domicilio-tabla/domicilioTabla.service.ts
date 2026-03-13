/**
 *  Este servicio proporciona métodos para obtener datos relacionados con tratados y acuerdos.
 */

import { CertificadoOrigenPayload, Params } from '../../models/certificados-disponsible.model';
import { DomicilioTabla, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tramite110210State, Tramite110210Store } from '../../estados/store/tramite110210.store';
import { API_ROUTES } from '../../../../shared/servers/api-route';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DomicilioTablaService {

  /**
   * {HttpCoreService} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpCoreService, private store: Tramite110210Store) { }

  /**
   *  Obtiene los datos de tratados y acuerdos desde un archivo JSON.
   *  Un observable que emite los datos obtenidos.
   */
  getData(): Observable<DomicilioTabla[]> {
    return this.http.get('./assets/json/110210/domicilio-tabla-data.json');
  }
  /**
   * Obtiene los datos del estado de Tramite110210 desde un archivo JSON local.
   * Observable<Tramite110210State> Un observable que emite el estado de Tramite110210.
   */
  getDatosStore(queryParams: Params): Observable<JSONResponse> {
    //return this.http.get<Tramite110210State>('./assets/json/110210/datos.json');
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    const queryString = Object.entries(PARAMS_OBJ)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    const url = `${API_ROUTES('/sat-t110210').mostrar110210Datos}?${queryString}`;
    return this.http.get(url).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES('/sat-t110210').mostrar110210Datos}`);
        return throwError(() => ERROR);
      })
    );
  }
   /**
   * Actualiza el estado global del formulario en el store con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: Tramite110210State): void {
    this.store.actualizarEstado(DATOS);
  }

  /**
   * Obtiene el estado del formulario del certificado de origen desde la API.
   * @param {CertificadoOrigenPayload} body - Cuerpo de la solicitud con los datos del certificado de origen.
   * @param {number} solicitudId - ID de la solicitud.
   * @returns {Observable<JSONResponse>} - Observable que emite la respuesta de la API.
   */
  obtenerEstadoFormulario(body: CertificadoOrigenPayload, solicitudId: number): Observable<JSONResponse> {
      return this.http.post(API_ROUTES('/sat-t110210').certificadoOrigen(solicitudId), { body }).pipe(
        map((response) => response as JSONResponse),
        catchError(() => {
          const ERROR = new Error(`Error al generar la cadena en ${API_ROUTES().certificadoOrigen(solicitudId)}`);
          return throwError(() => ERROR);
        })
      );
    }
}
