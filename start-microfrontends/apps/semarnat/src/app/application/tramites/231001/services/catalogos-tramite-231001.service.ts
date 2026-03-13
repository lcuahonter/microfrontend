import {
  API_GET_CAPITULO_FRACCION,
  API_GET_FRACCIONES_ARANCELARIAS,
  API_GET_IMMEX,
  API_GET_PARTIDAS_FRACCION,
  API_GET_SUBPARTIDAS_FRACCION,
  API_GET_UNIDAD_MEDIDA,
  CVE_CAPITULO_FRACCION,
  CVE_PARTIDA_FRACCION,
  CVE_SUBPARTIDA_FRACCION,
  GET_ADUANAS,
  GET_DETALLE_SOLICITUD,
  RFC,
} from '../../../constantes/231001/api-constants';

import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import {
  ImmexResponse,
  SimpleCatalogoResponse,
} from '../models/catalogo-response';
import { DetalleSolicitudT231001 } from '../models/datos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TRAMITE_ID } from '../enum/enum-tramite';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio para obtener catálogos y listados necesarios para el trámite 231001.
 *
 * Provee métodos para:
 * - Obtener datos IMMEX asociados a un RFC.
 * - Listar capítulos, partidas, subpartidas y fracciones arancelarias.
 * - Obtener unidades de medida y aduanas.
 *
 * Todas las llamadas retornan Observables con la estructura SimpleCatalogoResponse<T>.
 */
export class CatalogosTramite231001Service {
  /**
   * Host base de la API (se obtiene de la configuración de entorno).
   */
  urlServer = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Constructor del servicio.
   * @param httpClient Cliente HTTP de Angular utilizado para realizar las peticiones al backend.
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Obtiene los datos IMMEX asociados a un RFC.
   * @param rfc RFC del contribuyente a consultar.
   * @returns Observable con la respuesta que contiene un arreglo de ImmexResponse.
   */
  getDatosImmex(
    rfc: string
  ): Observable<SimpleCatalogoResponse<ImmexResponse[]>> {
    const URL = `${this.urlServer}${API_GET_IMMEX.replace(RFC, rfc)}`;
    return this.httpClient.get<SimpleCatalogoResponse<ImmexResponse[]>>(URL);
  }

  /**
   * Obtiene la lista de capítulos disponibles para fracciones arancelarias.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getCapitulos(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_CAPITULO_FRACCION}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las partidas asociadas a un capítulo de fracción.
   * @param cveCapituloFraccion Clave del capítulo de fracción.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getPartidas(
    cveCapituloFraccion: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_PARTIDAS_FRACCION.replace(
      CVE_CAPITULO_FRACCION,
      cveCapituloFraccion
    )}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las subpartidas asociadas a una partida y capítulo de fracción.
   * @param cveCapituloFraccion Clave del capítulo de fracción.
   * @param cvePartidaFraccion Clave de la partida de fracción.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getSubPartidas(
    cveCapituloFraccion: string,
    cvePartidaFraccion: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_SUBPARTIDAS_FRACCION.replace(
      CVE_CAPITULO_FRACCION,
      cveCapituloFraccion
    ).replace(CVE_PARTIDA_FRACCION, cvePartidaFraccion)}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las fracciones arancelarias para la combinación capítulo/partida/subpartida.
   * @param cveCapituloFraccion Clave del capítulo de fracción.
   * @param cvePartidaFraccion Clave de la partida de fracción.
   * @param cveSubpartidaFraccion Clave de la subpartida de fracción.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getFraccionesArancelarias(
    cveCapituloFraccion: string,
    cvePartidaFraccion: string,
    cveSubpartidaFraccion: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_FRACCIONES_ARANCELARIAS.replace(
      CVE_CAPITULO_FRACCION,
      cveCapituloFraccion
    )
      .replace(CVE_PARTIDA_FRACCION, cvePartidaFraccion)
      .replace(CVE_SUBPARTIDA_FRACCION, cveSubpartidaFraccion)}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las unidades de medida disponibles para un tipo de trámite.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getUnidadMedida(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_UNIDAD_MEDIDA}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de aduanas disponibles.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  getAduanas(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${GET_ADUANAS}`;
    return this.httpClient.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene el detalle de una solicitud específica del trámite 231001.
   * @param folioTramite folio del trámite.
   * @returns Observable con la respuesta que contiene el detalle de la solicitud.
   */
  getDetalleSolicitud(
    folioTramite: string
  ): Observable<SimpleCatalogoResponse<DetalleSolicitudT231001>> {
    const URL = `${this.urlServer}${GET_DETALLE_SOLICITUD(TRAMITE_ID,folioTramite)}`;
    return this.httpClient.get<SimpleCatalogoResponse<DetalleSolicitudT231001>>(
      URL
    );
  }
}
