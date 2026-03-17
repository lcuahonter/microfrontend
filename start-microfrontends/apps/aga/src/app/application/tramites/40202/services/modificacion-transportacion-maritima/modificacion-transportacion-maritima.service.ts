import { API_GET_COLONIAS, API_GET_EMPRESAS_CAAT, API_GET_ENTIDADES_FEDERATIVAS, API_GET_MUNICIPIOS, API_GET_PAISES, API_GET_VALIDA_AGENTE_NAVIERO, API_POST_GUARDAR_SOLICITUD } from '../../../../core/server/api-router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuardarResponse } from '../../../40201/models/guardar-solicitud.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonaCaat } from '../../models/empresa-caat.model';
import { TRAMITE_ID } from '../../constantes/modificacion-transportacion-maritima.enum';
import { TransportacionMaritima40202State } from '../../estados/tramite40202.store';

/**
 * Servicio para la gestión de datos relacionados con la transportación marítima.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Clase que representa el servicio de transportación marítima.
 * Este servicio se encarga de realizar peticiones HTTP para obtener datos relacionados con la transportación marítima.
 */
export class ModificacionTransportacionMaritimaService {

  /**
   * Host base de la API (se obtiene de la configuración de entorno).
   */
  urlServer = `${ENVIRONMENT.API_HOST}/api/`;

  /**
   * Constructor del servicio TransportacionMaritimaService.
   * @param http - Instancia de HttpClient para realizar peticiones HTTP.
   * @description El constructor inyecta la dependencia HttpClient para realizar peticiones HTTP.
   */
  constructor(
    private http: HttpClient
  ) {
    // El constructor se utiliza para la inyección de dependencias
  }

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
   * Metodo para buscar empresa CAAT.
   * @param rfcLogueado rfc del usuario logueado
   * @param extranjera si es empresa extranjera
   * @param rfc rfc a buscar
   * @param razonSocial razon social a buscar
   * @param caat caat a buscar
   * @returns 
   */
  obtenerBuscarEmpresaCaat(
    rfcLogueado: string,
    extranjera: boolean,
    rfc?: string,
    razonSocial?: string,
    caat?: string
  ): Observable<BaseResponse<PersonaCaat[]>> {
    const URL = `${this.urlServer}${API_GET_EMPRESAS_CAAT(TRAMITE_ID, rfcLogueado)}`;
    let params = new HttpParams();
    if (rfc) {
      params = params.set('rfcEmpMaritima', rfc);
    }
    if (razonSocial) {
      params = params.set('razonSocialEmpMaritima', razonSocial);
    }
    if (caat) {
      params = params.set('folioCaat', caat);
    }
    params = params.set('extranjeroEmpMaritima', extranjera);
    return this.http.get<BaseResponse<PersonaCaat[]>>(URL, { params });
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
   * Valida si el RFC corresponde a un agente naviero.
   * @param rfc RFC a validar.
   * @returns Observable con la respuesta de la validación.
   */
  validaAgenteNaviero(rfc: string): Observable<BaseResponse<boolean>> {
    const URL = `${this.urlServer}${API_GET_VALIDA_AGENTE_NAVIERO(
      TRAMITE_ID, rfc)}`;
    return this.http.get<BaseResponse<boolean>>(URL);
  }


  /**
     * Metodo para guardar la solicitud del trámite 40201.
     * @param request request con los datos de la solicitud
     * @returns Observable<BaseResponse<ResultadoSolicitud>>
     */
  guardarSolicitud(
    request: TransportacionMaritima40202State
  ): Observable<BaseResponse<GuardarResponse>> {
    const URL = `${this.urlServer}${API_POST_GUARDAR_SOLICITUD(TRAMITE_ID)}`;
    return this.http.post<BaseResponse<GuardarResponse>>(URL, request);
  }
}
