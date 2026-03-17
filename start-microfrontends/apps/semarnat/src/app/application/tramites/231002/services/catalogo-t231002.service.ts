import {
  API_GET_ADUANAS_SALIDA,
  API_GET_CLAVE_RESIDUO,
  API_GET_DESC_NICO_POR_CVE_NICO_FRACCION_CVE,
  API_GET_DESC_RESIDUO,
  API_GET_DIRECCIONES,
  API_GET_ENUM_CARACTERISTICAS,
  API_GET_NOMBRE_RESIDUO,
  API_GET_PAISES_DESTINO,
  API_GET_TIPO_CONTENEDOR,
} from './../../../core/server/api-router';
import {
  API_GET_FRACCIONES_ARANCELARIAS,
  API_GET_IMMEX,
  API_GET_MATERIAS_BITACORA,
  API_GET_MATERIA_ID,
  API_GET_NICO_POR_FRACCION_CVE,
  API_GET_UNIDAD_MEDIDA,
} from '../../../core/server/api-router';
import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ImmexResponse,
  SimpleCatalogoResponse,
} from '../../231001/models/catalogo-response';

import { DetalleSolicitudAvisos } from '../models/detalle-solicitud.model';
import { GET_DETALLE_SOLICITUD } from '../../../constantes/231001/api-constants';
import { Injectable } from '@angular/core';
import { MateriaResiduo } from '../models/materia-residuo.model';
import { Observable } from 'rxjs';
import { TRAMITE_ID } from '../constantes/aviso-retorno.enum';

export interface Domicilio {
  clave: number;
  domicilio: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogoT231002Service {
  constructor(private http: HttpClient) { }

  /**
   * Host base de la API (se obtiene de la configuración de entorno).
   */
  urlServer = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Obtiene los datos de IMMEX por RFC.
   * @param rfc RFC del solicitante.
   * @returns Observable con los datos de IMMEX.
   */
  obtenerDatosImmexByRfc(
    rfc: string
  ): Observable<SimpleCatalogoResponse<ImmexResponse[]>> {
    const URL = `${this.urlServer}${API_GET_IMMEX(TRAMITE_ID, rfc)}`;
    return this.http.get<SimpleCatalogoResponse<ImmexResponse[]>>(URL);
  }

  /**
   * Obtiene los datos de materias primas por número de bitácora.
   * @param noBitacora Número de bitácora.
   * @param rfc RFC del solicitante.
   * @returns Observable con los datos de materias primas.
   */
  obtenerMateriasPrimasPorNoBitacora(
    noBitacora: string,
    rfc: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const PARAMS = new HttpParams().set('bitacora', noBitacora);
    const URL = `${this.urlServer}${API_GET_MATERIAS_BITACORA(
      rfc,
      TRAMITE_ID
    )}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL, {
      params: PARAMS,
    });
  }

  /**
   * Obtiene una materia prima por su ID.
   * @param materiaId ID de la materia prima.
   * @returns Observable con los datos de la materia prima.
   */
  obtenerMateriaPrimaPorId(
    materiaId: string
  ): Observable<SimpleCatalogoResponse<MateriaResiduo>> {
    const URL = `${this.urlServer}${API_GET_MATERIA_ID(materiaId, TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<MateriaResiduo>>(URL);
  }

  /**
   * Obtiene las fracciones arancelarias.
   * @returns Observable con las fracciones arancelarias.
   */
  obtenerFraccionesArancelarias(): Observable<
    SimpleCatalogoResponse<Catalogo[]>
  > {
    const URL = `${this.urlServer}${API_GET_FRACCIONES_ARANCELARIAS(
      TRAMITE_ID
    )}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las claves NICO asociadas a una fracción arancelaria.
   * @param fraccionCve Clave de la fracción arancelaria.
   * @returns Observable con el catálogo de claves NICO.
   */
  obtenerClaveNico(
    fraccionCve: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_NICO_POR_FRACCION_CVE(
      TRAMITE_ID,
      fraccionCve
    )}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las unidades de medida comerciales disponibles.
   * @returns Observable con el catálogo de unidades de medida.
   */
  obtenerUnidadMedida(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_UNIDAD_MEDIDA(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene la descripción asociada a una clave NICO y fracción.
   * @param nicoCve Clave NICO.
   * @param fraccionCve Clave de la fracción arancelaria.
   * @returns Observable con el catálogo de descripciones NICO.
   */
  obtenerDescNico(
    nicoCve: string,
    fraccionCve: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_DESC_NICO_POR_CVE_NICO_FRACCION_CVE(
      TRAMITE_ID,
      nicoCve,
      fraccionCve
    )}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las claves de residuo disponibles.
   * @returns Observable con el catálogo de claves de residuo.
   */
  obtenerClaveResiduo(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_CLAVE_RESIDUO(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene los nombres de residuo disponibles.
   * @returns Observable con el catálogo de nombres de residuo.
   */
  obtenerNombreResiduo(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_NOMBRE_RESIDUO(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las descripciones de residuo disponibles.
   * @returns Observable con el catálogo de descripciones de residuo.
   */
  obtenerDescResiduo(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_DESC_RESIDUO(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene los tipos de contenedor disponibles.
   * @returns Observable con el catálogo de tipos de contenedor.
   */
  obtenerTipoContenedor(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_TIPO_CONTENEDOR(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las características (enumeración) usadas para materias.
   * @returns Observable con la enumeración de características.
   */
  obtenerCaracteristicaMateria(
    tipo: string
  ): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ENUM_CARACTERISTICAS(
      TRAMITE_ID,
      tipo
    )}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las aduanas de salida disponibles.
   * @returns Observable con el catálogo de aduanas de salida.
   */
  obtenerAduanaSalida(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ADUANAS_SALIDA(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene las direcciones asociadas a un programa IMMEX.
   * @param cveImmex Clave del programa IMMEX.
   * @returns Observable con el catálogo de direcciones.
   */
  obtenerDirecciones(
    cveImmex: string
  ): Observable<SimpleCatalogoResponse<Domicilio[]>> {
    const URL = `${this.urlServer}${API_GET_DIRECCIONES(TRAMITE_ID, cveImmex)}`;
    return this.http.get<SimpleCatalogoResponse<Domicilio[]>>(URL);
  }

  /**
   * Obtiene los países de destino disponibles.
   * @returns Observable con el catálogo de países de destino.
   */
  obtenerPaisesDestino(): Observable<SimpleCatalogoResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_PAISES_DESTINO(TRAMITE_ID)}`;
    return this.http.get<SimpleCatalogoResponse<Catalogo[]>>(URL);
  }


  /**
   * Obtiene el detalle de una solicitud específica del trámite 231001.
   * @param folioTramite folio del trámite.
   * @returns Observable con la respuesta que contiene el detalle de la solicitud.
   */
  getDetalleSolicitud(
    folioTramite: string
  ): Observable<SimpleCatalogoResponse<DetalleSolicitudAvisos>> {
    const URL = `${this.urlServer}${GET_DETALLE_SOLICITUD(TRAMITE_ID, folioTramite)}`;
    return this.http.get<SimpleCatalogoResponse<DetalleSolicitudAvisos>>(
      URL
    );
  }
}
