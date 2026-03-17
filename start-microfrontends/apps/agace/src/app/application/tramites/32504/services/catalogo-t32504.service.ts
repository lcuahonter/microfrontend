import {
  API_GET_ADACE,
  API_GET_ANIO,
  API_GET_ESTADOS,
  API_GET_FRACCION_ARANCELARIA,
  API_GET_MESES,
  API_GET_MUNICIPIOS,
  API_GET_PLANTILLA,
  API_GET_UNIDAD_MEDIDA,
  CATALOGO_COLONIAS,
} from '../../../core/server/api-router';
import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlantillaReponseT32504 } from '../models/aviso.model';
import { TRAMITE_ID } from '../constants/aviso.enum';

/**
 * Servicio para obtener catálogos utilizados en el trámite 32504.
 * Proporciona métodos para listar meses, años, estados, municipios, colonias,
 * fracciones arancelarias, ADACE y unidades de medida desde la API.
 */
@Injectable({ providedIn: 'root' })
export class CatalogoT32504Service {
  /**
   * Inyecta HttpClient para realizar solicitudes HTTP hacia la API.
   * @param http Cliente HTTP inyectado para realizar peticiones.
   */
  constructor(private http: HttpClient) {}

  /**
   * Host base de la API (se obtiene de la configuración de entorno).
   */
  urlServer = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Obtiene los datos de IMMEX por RFC.
   * @returns Observable con los datos de IMMEX.
   */
  obtenerMeses(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_MESES(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de años disponibles para el trámite.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerAnios(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ANIO(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de estados disponibles para el trámite.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerEstados(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ESTADOS(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de municipios para un estado dado.
   * @param cveEstado Clave del estado para filtrar municipios.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerMunicipios(cveEstado: string): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_MUNICIPIOS(TRAMITE_ID, cveEstado)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de colonias para un municipio dado.
   * @param cveMunicipio Clave del municipio para filtrar colonias.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerColonias(cveMunicipio: string): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${CATALOGO_COLONIAS(
      TRAMITE_ID.toString(),
      cveMunicipio
    )}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de fracciones arancelarias.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerFraccionArancelarias(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_FRACCION_ARANCELARIA(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene el catálogo ADACE para un estado indicado.
   * @param cveEstado Clave del estado para filtrar ADACE.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerADACE(cveEstado: string): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ADACE(TRAMITE_ID, cveEstado)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la lista de unidades de medida.
   * @returns Observable con la respuesta que contiene un arreglo de Catalogo.
   */
  obtenerUnidadesMedida(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_UNIDAD_MEDIDA(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la plantilla del trámite 32504.
   * @returns Observable con la respuesta que contiene los datos de la plantilla.
   */
  obtenerPlantilla(): Observable<BaseResponse<PlantillaReponseT32504>> {
    const URL = `${this.urlServer}${API_GET_PLANTILLA(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<PlantillaReponseT32504>>(URL);
  }
}
