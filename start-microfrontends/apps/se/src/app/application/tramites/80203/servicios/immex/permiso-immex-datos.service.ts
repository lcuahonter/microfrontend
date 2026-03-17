/**
 * @Injectable
 * @description Servicio para obtener y gestionar los datos del permiso IMMEX.
 * Proporciona métodos para consultar datos desde archivos JSON y actualizar el estado del registro IMMEX en el store.
 *
 * - Permite obtener los datos del permiso IMMEX desde archivos locales.
 * - Actualiza el estado del formulario en el store de Akita.
 * - Expone métodos para la integración con componentes y otros servicios.
 *
 * @example
 * // Inyección en un componente
 * constructor(private permisoImmexDatosService: PermisoImmexDatosService) {}
 */
import { BuscarPayload, FraccionArancelariaPayload, ImmexRegistroform, ImmexTablaJson } from '../../modelos/immex-registro-de-solicitud-modality.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  ImmexRegistroState,
  ImmexRegistroStore,
} from '../../estados/tramites/tramite80203.store';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../../shared/servers/api-route';
import { JSONResponse } from '@libs/shared/data-access-user/src';


@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para obtener y gestionar los datos del permiso IMMEX.
 * Permite consultar datos desde archivos JSON y actualizar el estado del registro IMMEX en el store.
 */
export class PermisoImmexDatosService {
  /**
   * Ruta al archivo JSON con los datos de la tabla IMMEX.
   * @type {string}
   */
  private jsonUrl = '/assets/json/80203/immex-table.json';

  /**
   * @constructor
   * @description Constructor que inicializa el cliente HTTP y el store para el registro IMMEX.
   * @param {HttpClient} httpClient - Cliente HTTP para realizar solicitudes.
   * @param {ImmexRegistroStore} tramite80203Store - Store para manejar el estado del registro IMMEX.
   */
  constructor(private httpClient: HttpClient, private readonly tramite80203Store: ImmexRegistroStore) {}

    /**
   * Obtiene los datos de la tabla IMMEX desde un archivo JSON local.
   * @returns {Observable<ImmexTablaJson[]>} Observable con los datos filtrados de la tabla IMMEX.
   */
  getDatos(permisoImmexDatos: string): Observable<ImmexTablaJson[]> {
    return this.httpClient.get<ImmexTablaJson[]>(this.jsonUrl).pipe(
      map(response => response.filter(item => item.permisoImmex === permisoImmexDatos))
    );
  }

    /**
   * Obtiene los datos del registro de toma de muestras y mercancías desde un archivo JSON local.
   * @returns {Observable<ImmexRegistroState>} Observable con el estado del registro IMMEX.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<ImmexRegistroState> {
    return this.httpClient.get<ImmexRegistroState>('assets/json/80203/immexRegistro.json');
  }

    /**
   * Actualiza el estado del formulario en el store de Akita con los datos proporcionados.
   * @param {ImmexRegistroform} DATOS - Datos del formulario de registro IMMEX.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: ImmexRegistroform): void {
    this.tramite80203Store.setImmexRegistro(DATOS);
  }
  /**
   * @desc Obtiene el permiso IMMEX realizando una petición POST al endpoint correspondiente.
   * @param body Objeto de tipo `BuscarPayload` que contiene los datos necesarios para la búsqueda del permiso IMMEX.
   * @returns Un observable que emite la respuesta en formato `JSONResponse`.
   * @throws Error si ocurre algún problema al obtener la lista de plantas.
   *
   * @see [Compodoc](https://compodoc.app/)
   */
   getPermisoImmex(body: BuscarPayload): Observable<JSONResponse> {
      return this.httpClient.post<JSONResponse>(API_ROUTES('/sat-t80203','80203').buscarPermisoImmex, body).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES('/sat-t80203','80203').buscarPermisoImmex}`);
          return throwError(() => ERROR);
        })
      );
    }

    /**
     * @description Obtiene la fracción arancelaria realizando una petición POST al endpoint correspondiente.
     * @param body Objeto de tipo `FraccionArancelariaPayload` que contiene los datos necesarios para la búsqueda de la fracción arancelaria.
     * @returns Un observable que emite la respuesta en formato `JSONResponse`.
     * @throws Error si ocurre algún problema al obtener la lista de plantas.
     */
    getFraccionArancelaria(body: FraccionArancelariaPayload): Observable<JSONResponse> {
      return this.httpClient.post<JSONResponse>(API_ROUTES('/sat-t80203','80203').buscarFraccionArancelaria, body).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES('/sat-t80203','80203').buscarFraccionArancelaria}`);
          return throwError(() => ERROR);
        })
      );
    }

}
