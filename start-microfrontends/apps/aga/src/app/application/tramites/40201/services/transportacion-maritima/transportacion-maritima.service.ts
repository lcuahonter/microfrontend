import {
  API_GET_COLONIAS,
  API_GET_CONTRIBUYENTES,
  API_GET_ENTIDADES_FEDERATIVAS,
  API_GET_MUNICIPIOS,
  API_GET_PAISES,
  API_GET_VALIDA_AGENTE_NAVIERO,
  API_OBTENER_EMPRESA_CAAT,
  API_POST_GUARDAR_SOLICITUD,
} from '../../../../core/server/api-router';
import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import {
  GuardarResponse,
  T40201Request,
} from '../../models/guardar-solicitud.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Tramite40201Store,
  TransportacionMaritima40201State,
} from '../../estados/store/tramite40201.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Contribuyente } from '../../models/contributente.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCaatTabla } from '../../models/transportacion-maritima.model';
import { TRAMITE_ID } from '../../constantes/transportacion-maritima.enum';

/**
 * Servicio para la gestión de datos relacionados con la transportación marítima.
 */
@Injectable({
  providedIn: 'root',
})

/**
 * Clase que representa el servicio de transportación marítima.
 * Este servicio se encarga de realizar peticiones HTTP para obtener datos relacionados con la transportación marítima.
 */
export class TransportacionMaritimaService {
  /**
   * Constructor del servicio TransportacionMaritimaService.
   * @param http - Instancia de HttpClient para realizar peticiones HTTP.
   * @description El constructor inyecta la dependencia HttpClient para realizar peticiones HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramite40201Store: Tramite40201Store
  ) {
    // El constructor se utiliza para la inyección de dependencias
  }

  /**
   * Host base de la API (se obtiene de la configuración de entorno).
   */
  urlServer = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Obtiene los datos de IMMEX por RFC.
   * @returns Observable con los datos de IMMEX.
   */
  obtenerPaises(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_PAISES(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * OBTIENE EL CATÁLOGO DE ESTADOS
   * @returns Observable con los datos de estados.
   */
  obtenerEstados(): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_ENTIDADES_FEDERATIVAS(TRAMITE_ID)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Obtiene el catálogo de municipios.
   * @returns Observable con los datos de municipios.
   */
  obtenerMunicipios(cveEstado: string): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_MUNICIPIOS(TRAMITE_ID, cveEstado)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Metodo para obtener la empresa CAAT.
   * @param rfc RFC de la empresa
   * @param razonSocial razón social de la empresa
   * @param caat codigo CAAT de la empresa
   * @param extranjera si la empresa es extranjera
   * @returns Observable<RespuestaCaatTabla>
   */
  obtenerBuscarEmpresaCaat(
    extranjera: boolean,
    rfc?: string,
    razonSocial?: string,
    caat?: string
  ): Observable<RespuestaCaatTabla> {
    const URL = `${this.urlServer}${API_OBTENER_EMPRESA_CAAT(TRAMITE_ID)}`;
    let params = new HttpParams();
    if (rfc) {
      params = params.set('rfc', rfc);
    }
    if (razonSocial) {
      params = params.set('denominacion', razonSocial);
    }
    if (caat) {
      params = params.set('folioCaat', caat);
    }
    params = params.set('extranjero', extranjera);
    return this.http.get<RespuestaCaatTabla>(URL, { params });
  }

  /**
   * Busca un contribuyente por RFC.
   * @param esFisico si el contribuyente es físico o moral
   * @param rfc rfc del contribuyente
   * @returns Observable<BaseResponse<Contributente>>
   * @description Este método realiza una petición HTTP GET para buscar un contribuyente por su RFC.
   */
  buscarContribuyente(
    esFisico: boolean,
    rfc: string
  ): Observable<BaseResponse<Contribuyente>> {
    const URL = `${this.urlServer}${API_GET_CONTRIBUYENTES(
      TRAMITE_ID,
      esFisico,
      rfc
    )}`;
    return this.http.get<BaseResponse<Contribuyente>>(URL);
  }

  /**
   * obtiene el catálogo de colonias.
   * @param cveMunicipio clave del municipio
   * @returns Observable<BaseResponse<Catalogo[]>>
   */
  obtenerColonias(cveMunicipio: string): Observable<BaseResponse<Catalogo[]>> {
    const URL = `${this.urlServer}${API_GET_COLONIAS(
      TRAMITE_ID,
      cveMunicipio
    )}`;
    return this.http.get<BaseResponse<Catalogo[]>>(URL);
  }

  /**
   * Actualiza el estado del formulario de transportación marítima.
   * @param DATOS - Datos del estado de transportación marítima.
   * @description Este método actualiza el estado del formulario en el store de la aplicación con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: TransportacionMaritima40201State): void {
    this.tramite40201Store.setTramite40201State(DATOS);
  }

  /**
   * Metodo para guardar la solicitud del trámite 40201.
   * @param request request con los datos de la solicitud
   * @returns Observable<BaseResponse<ResultadoSolicitud>>
   */
  guardarSolicitud(
    request: T40201Request
  ): Observable<BaseResponse<GuardarResponse>> {
    const URL = `${this.urlServer}${API_POST_GUARDAR_SOLICITUD(TRAMITE_ID)}`;
    return this.http.post<BaseResponse<GuardarResponse>>(URL, request);
  }



  /**
   * Valida si el RFC corresponde a un agente naviero.
   * @param rfc RFC a validar.
   * @returns Observable con la respuesta de la validación.
   */
  validaAgenteNaviero(rfc: string): Observable<BaseResponse<boolean>> {
    const URL = `${this.urlServer}${API_GET_VALIDA_AGENTE_NAVIERO(
      TRAMITE_ID, rfc)}`;
    return this.http.get<BaseResponse<boolean>>(URL);
  }
}
