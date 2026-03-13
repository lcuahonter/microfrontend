import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CHOFER_DETALLES, API_CHOFER_DETALLES_NSS, API_FIRMAR, API_GET_VEHICULOS_COLORES, API_GUARDAR, API_MODIFICAR_INICIAR, API_PAISES, API_PARIVEH, API_PARQUE_VEHICULAR, API_UNIDAD_ARRASTRE } from '../../../../core/server/api-router';
import { ApiResponseChoferExtranjero, ApiResponseChoferNacional, ApiResponseParqueVehicular, ApiResponseSolicitante, ApiResponseUnidadArrastre, CatalogoLista, VehiculoTablaDatos } from '../../models/registro-muestras-mercancias.model';
import { FirmaDatosRequest } from '../../../40101/components/services/modificacar-terrestre.service';
import { IniciarResponse } from '../../../40101/pages/solicitante-page/solicitante-page.component';

/**
 * @service modificarTerrestreService
 * @description
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado terrestre en el trámite 40103.
 * Proporciona métodos para obtener catálogos, tablas de vehículos y otros datos necesarios para el trámite.
 *
 * @providedIn root
 */
@Injectable({
  providedIn: 'root'
})
export class modificarTerrestreService {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios.
   */
  host: string;

  private static getApiHeaders(): HttpHeaders {
    const CLAVEUSUARIO = localStorage.getItem('ClaveUsuario') || '';
    const RFC = localStorage.getItem('Rfc') || '';
    const CVEROLE = localStorage.getItem('CveRole') || '';

    return new HttpHeaders({
      'ClaveUsuario': CLAVEUSUARIO,
      'Rfc': RFC,
      'CveRole': CVEROLE
    });
  }
  /**
  * Constructor del servicio.
  * @param http Cliente HTTP para realizar peticiones a recursos locales o remotos.
  */
  constructor(private http: HttpClient) {
    this.host = ENVIRONMENT.API_HOST;
  }

  /**
   * Obtiene el catálogo de tipos de vehículo.
   * @returns Observable con la lista de catálogos de tipos de vehículo.
   */
  obtenerTipoDeVehiculo(): Observable<CatalogoLista> {
    /**
     * URL completa para obtener los tipos de vehículo.
     * @type {string}
     */
    return this.http.get<CatalogoLista>(`${this.host}${API_PARIVEH}`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
   * Obtiene el catálogo de colores de vehículos.
   * @returns Observable con la lista de catálogos de colores de vehículos.
   */
  obtenerColorVehiculo(): Observable<CatalogoLista> {
    /**
     * URL completa para obtener los colores de vehículo.
     * @type {string}
     */
    return this.http.get<CatalogoLista>(`${this.host}${API_GET_VEHICULOS_COLORES}`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
    * Obtiene el catálogo de tipos de vehículo de arrastre.
    * @returns Observable con la lista de catálogos de vehículo de arrastre.
    */
  obtenerTipoArrastre(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/api/sat-t40103/vehiculos/tipos-vehiculo/arrastre`, { headers: modificarTerrestreService.getApiHeaders() });
  }
  /**
  * Obtiene el catálogo de años.
  * @returns Observable con la lista de catálogos de años.
  */
  obtenerAno(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/40103/ano.json`);
  }

  /**
   * Obtiene la solicitud del país.
   * @returns Observable con la solicitud del país.
   */
  obtenerPaisEmisor(): Observable<CatalogoLista> {
    /**
     * URL completa para obtener los países.
     * @type {string}
     */
    return this.http.get<CatalogoLista>(`${this.host}${API_PAISES}`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  
// Método para enviar los datos de la firma al servidor
// Recibe un objeto de tipo FirmaDatosRequest y devuelve un Observable con la respuesta del tipo IniciarResponse
// Realiza una petición POST al endpoint definido en API_FIRMAR, incluyendo los encabezados de la API
firmaDatos(datos: FirmaDatosRequest): Observable<IniciarResponse> {
  return this.http.post<IniciarResponse>(`${this.host}${API_FIRMAR}`, datos, { headers: modificarTerrestreService.getApiHeaders() });
}

  /**
   * Obtiene la tabla de pedimentos de vehículos.
   * @returns Observable con la tabla de vehículos.
   */
  obtenerPedimentoTabla(): Observable<VehiculoTablaDatos> {
    return this.http.get<VehiculoTablaDatos>(`assets/json/40103/vahiculo-dummy.json`);
  }

  /**
   * Obtiene los datos del solicitante desde la API.
   * @returns Observable con los datos del solicitante.
   */
  obtenerDatosSolicitante(): Observable<ApiResponseSolicitante> {
    return this.http.get<ApiResponseSolicitante>(`${this.host}${API_MODIFICAR_INICIAR}`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
   * Guarda los datos del trámite 40103.
   * @param payload El cuerpo de la solicitud con todos los datos del trámite a guardar.
   * @returns Un observable con la respuesta del servidor.
   */
  guardarDatosTramite(payload: unknown): Observable<IniciarResponse> {
    return this.http.post<IniciarResponse>(`${this.host}${API_GUARDAR}`, payload, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
   * Busca los detalles de un chofer nacional por RFC y/o CURP.
   * @param payload Objeto con rfc y curp del chofer.
   * @param isExistente Indica si se debe buscar en los registros existentes.
   * @returns Un observable con los detalles del chofer.
   */
  buscarChoferNacional(payload: { RFC: string; CURP: string }, isExistente: boolean): Observable<ApiResponseChoferNacional> {
    let params = new HttpParams();
    if (isExistente) {
      params = params.set('isExistente', 'true');
    }
    return this.http.post<ApiResponseChoferNacional>(`${this.host}${API_CHOFER_DETALLES}`, {rfc:payload.RFC,curp:payload.CURP}, { headers: modificarTerrestreService.getApiHeaders(), params });
  }

  /**
   * Busca los detalles de un chofer extranjero por NSS.
   * @param nss Número del Seguro Social del chofer.
   * @param isExistente Indica si se debe buscar en los registros existentes.
   * @returns Un observable con los detalles del chofer extranjero.
   */
  buscarChoferExtranjero(nss: string, isExistente: boolean): Observable<ApiResponseChoferExtranjero> {
    let params = new HttpParams();
    if (isExistente) {
      params = params.set('isExistente', 'true');
    }
    return this.http.get<ApiResponseChoferExtranjero>(`${this.host}${API_CHOFER_DETALLES_NSS(nss)}`, { headers: modificarTerrestreService.getApiHeaders(), params });
  }

  /**
   * Busca un vehículo del parque vehicular por VIN y/o placas.
   * @param params Parámetros de búsqueda (vin, placas).
   * @param isExistente Indica si se debe buscar en los registros existentes.
   * @returns Un observable con los datos del vehículo.
   */
  buscarParqueVehicular(params: { VIN: string; PLACAS?: string }): Observable<ApiResponseParqueVehicular> {
    let httpParams = new HttpParams().set('vin', params.VIN);
    if (params.PLACAS) {
      httpParams = httpParams.set('placas', params.PLACAS);
    }
 
    return this.http.get<ApiResponseParqueVehicular>(`${this.host}${API_PARQUE_VEHICULAR}`, { headers: modificarTerrestreService.getApiHeaders(), params: httpParams });
  }

  /**
   * Busca una unidad de arrastre por VIN, placas y/o id.
   * @param params Parámetros de búsqueda (vin, placas, idVehiculo).
   * @param isExistente Indica si se debe buscar en los registros existentes.
   * @returns Un observable con los datos de la unidad de arrastre.
   */
  buscarUnidadArrastre(params: { VIN: string; PLACAS?: string; IDVEHICULO?: string }, isExistente: boolean): Observable<ApiResponseUnidadArrastre> {
    let httpParams = new HttpParams().set('vin', params.VIN);
    if (params.PLACAS) {
      httpParams = httpParams.set('placas', params.PLACAS);
    }
    if (params.IDVEHICULO) {
      httpParams = httpParams.set('idVehiculo', params.IDVEHICULO);
    }
    if (isExistente) {
      httpParams = httpParams.set('isExistente', 'true');
    }
    return this.http.get<ApiResponseUnidadArrastre>(`${this.host}${API_UNIDAD_ARRASTRE}`, { headers: modificarTerrestreService.getApiHeaders(), params: httpParams });
  }
}