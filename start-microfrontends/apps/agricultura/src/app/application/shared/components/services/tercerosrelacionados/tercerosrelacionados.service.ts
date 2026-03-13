/**
 * @fileoverview
 * Servicio para la gestión de catálogos y datos relacionados con terceros en el trámite 220201 de agricultura.
 * Permite obtener listas de catálogos desde archivos remotos.
 * Cobertura compodoc 100%: cada clase, método y propiedad está documentada.
 * @module TercerosrelacionadosService
 */

import {
  Catalogo,
  ENVIRONMENT,
  RespuestaCatalogos,
} from '@libs/shared/data-access-user/src';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { URL } from '../../../../tramites/220102/constantes/fitosanitario.enum';

import {
  API_GET_CATALOGO_COLONIAS,
  API_GET_CATALOGO_CONSULTA_PAISES,
  API_GET_CATALOGO_ENTIDADES_FEDERATIVAS,
  API_GET_CATALOGO_ENTIDADES_FEDERATIVAS_GENERAL,
  API_GET_CATALOGO_ENTIDAD_FEDERATIVA_MUNICIPIOS,
} from '../../../../core/server/api-router';

/**
 * Servicio para la gestión de catálogos y datos relacionados con terceros.
 * Permite obtener listas de catálogos desde archivos remotos.
 *
 * @export
 * @class TercerosrelacionadosService
 * @providedIn root
 */
@Injectable({
  providedIn: 'root',
})
export class TercerosrelacionadosService {
  /**
   * URL base para las peticiones a los catálogos y datos.
   * @type {string}
   */
  url: string = URL;
  host: string = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * http inicializa el HttpClient para realizar solicitudes HTTP
   * @type HttpClient Instancia de HttpClient para realizar solicitudes HTTP.
   */
  private http: HttpClient = inject(HttpClient);

  /**
   * Obtiene la lista de catálogos a partir de un archivo.
   * @param {string} fileName - Nombre del archivo de catálogo.
   * @returns {Observable<Catalogo[]>} Observable con la lista de catálogos.
   */
  obtenerSelectorList(fileName: string): Observable<Catalogo[]> {
    const BASEURL = this.url + fileName;
    return this.http
      .get<RespuestaCatalogos>(BASEURL)
      .pipe(map((response) => response.data));
  }

  /**
   * Obtiene el catálogo de países para consulta, según el trámite especificado.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de países.
   * @returns Un observable que emite la respuesta base con el arreglo de países del catálogo.
   */
  obtieneCatalogoConsultaPaises(
    tramite: number
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_CONSULTA_PAISES(
      tramite.toString()
    )}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo general de entidades federativas para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se requiere el catálogo de entidades federativas.
   * @returns Un observable que emite la respuesta base con el arreglo de entidades federativas (`Catalogo[]`).
   */
  obtieneCatalogoEntidadesFederativasGeneral(
    tramite: number,
    cvePais: string = 'MEX'
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${
      this.host
    }${API_GET_CATALOGO_ENTIDADES_FEDERATIVAS_GENERAL(tramite.toString(), cvePais)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de entidades federativas basado en el trámite y clave de país proporcionados.
   *
   * @param tramite - Identificador numérico del trámite.
   * @param cvePais - Clave del país en formato de cadena.
   * @returns Un observable que emite una respuesta base con un arreglo de catálogos.
   */
  obtieneCatalogoEntidadesFederativas(tramite: number, cvePais: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_ENTIDADES_FEDERATIVAS(tramite.toString(), cvePais)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de entidades federativas para un trámite específico.
   *
   * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo.
   * @param cveEntidad - La clave de la entidad federativa a consultar.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos correspondientes.
   */
  obtieneCatalogoEntidadFederativaMunicipios(
    tramite: number,
    cveEntidad: string
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${
      this.host
    }${API_GET_CATALOGO_ENTIDAD_FEDERATIVA_MUNICIPIOS(
      tramite.toString(),
      cveEntidad
    )}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de colonias correspondiente a un trámite y clave de delegación específicos.
   *
   * @param tramite - El identificador numérico del trámite para el cual se solicita el catálogo de colonias.
   * @param cveDelegNum - La clave de la delegación en formato de cadena.
   * @returns Un observable que emite la respuesta base con el arreglo de objetos de tipo `Catalogo`.
   */
  obtieneCatalogoColonias(
    tramite: number,
    cveDelegNum: string
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_CATALOGO_COLONIAS(
      tramite.toString(),
      cveDelegNum
    )}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

}
