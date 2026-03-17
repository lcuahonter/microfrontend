import {
  Catalogo,
  RespuestaCatalogos,
  SeccionLibStore
} from '@ng-mf/data-access-user';
import { DatosDeLaSolicitud, ProductosCatalogosDatos } from '../../../../shared/models/datos-de-la-solicitue.model';

import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgriculturaApiService {

  /** @description URL base para las peticiones a los catálogos y datos. */
  url: string = 'assets/json/220202/'; // Replace with your actual base URL string

  /**
   * @constructor
   * @param {HttpClient} http - Servicio para realizar peticiones HTTP.
   * @param {SeccionLibStore} seccionStore - Store para el manejo del estado de las secciones.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly seccionStore: SeccionLibStore,
  ) {
  }

  /**
   * @description Obtiene la lista de catálogos a partir de un archivo.
   * @param {string} fileName - Nombre del archivo de catálogo.
   * @returns {Observable<Catalogo[]>} Observable con la lista de catálogos.
   */
  obtenerSelectorList(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http.get<RespuestaCatalogos>(BASEURL).pipe(
      map(response => response.data)
    );
  }









  /**
   * @description Obtiene los datos de la solicitud a partir de una URL específica.
   * @param {string} url - URL del archivo JSON que contiene los datos de la solicitud.
   * @returns {Observable<DatosDeLaSolicitud>} Observable con los datos de la solicitud.
   */
  obtenerRespuestaPorUrl(url: string): Observable<DatosDeLaSolicitud> {
    return this.http.get<DatosDeLaSolicitud>(`../../../../../assets/json/220202/${url}`);
  }

  /**
 * @description Obtiene los datos de la solicitud a partir de una URL específica.
 * @param {string} url - URL del archivo JSON que contiene los datos de la solicitud.
 * @returns {Observable<ProductosCatalogosDatos>} Observable con los datos de la solicitud.
 */
  obtenerProductoRespuestaPorUrl(url: string): Observable<ProductosCatalogosDatos> {
    return this.http.get<ProductosCatalogosDatos>(`../../../../../assets/json/220202/${url}`);
  }

}