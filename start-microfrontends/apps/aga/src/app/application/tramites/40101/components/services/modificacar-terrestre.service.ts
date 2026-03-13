
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponseChofer, ApiResponseSolicitante, CatalogoLista, VehiculoTabla } from '../../models/registro-muestras-mercancias.model';
import { IniciarResponse } from '../../pages/solicitante-page/solicitante-page.component';

/**
 * @service modificarTerrestreService
 * @description
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado terrestre en el trámite 40101.
 * Proporciona métodos para obtener catálogos, tablas de vehículos y otros datos necesarios para el trámite.
 *
 * @providedIn root
 */

export interface FirmaDatosRequest {
  cadena_original: string; // CADENAHEX
  sello: string; // FIRMAHEX
  certificate_serial_number: string;
  solicitudId: string;
}
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
   * Obtiene el catálogo de colores de vehículos.
   * @returns Observable con la lista de catálogos de colores de vehículos.
   */
  obtenerColorVehiculo(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/api/sat-t40101/vehiculos/colores`, { headers: modificarTerrestreService.getApiHeaders() });
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
    return this.http.get<CatalogoLista>(`${this.host}/api/sat-t40101/vehiculos/tipos-vehiculo/pariveh`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
     * Obtiene los datos del solicitante desde el API.
     * @returns Observable con los datos del solicitante.
     */
  obtenerDatosSolicitante(): Observable<ApiResponseSolicitante> {
    const FULL_URL = `${this.host}/api/sat-t40101/solicitud/registro/iniciar`;
    return this.http.get<ApiResponseSolicitante>(FULL_URL, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
   * Get the National Driver Data using the curp and RFC
   * @param curp - The CURP of the driver
   * @param rfc - The RFC of the driver
   * @returns Observable with the driver data
   */
  buscarChoferNacional(curp: string, rfc: string): Observable<ApiResponseChofer> {
    const FULL_URL = `${this.host}/api/sat-t40101/chofer/detalles`;
    return this.http.post<ApiResponseChofer>(FULL_URL, { curp: curp, rfc: rfc }, { headers: modificarTerrestreService.getApiHeaders() });
  }


  /**
      * Obtiene el catálogo de tipos de vehículo de arrastre.
      * @returns Observable con la lista de catálogos de vehículo de arrastre.
      */
  obtenerTipoArrastre(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/api/sat-t40101/vehiculos/tipos-vehiculo/arrastre`, { headers: modificarTerrestreService.getApiHeaders() });
  }
  /**
  * Obtiene el catálogo de años.
  * @returns Observable con la lista de catálogos de años.
  */
  obtenerAno(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/40101/ano.json`);
  }

  /**
   * Obtiene la solicitud del país.
   * @returns Observable con la solicitud del país.
   */
  obtenerPaisEmisor(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/api/sat-t40101/catalogo/paises`, { headers: modificarTerrestreService.getApiHeaders() });
  }

  /**
   * Obtiene la tabla de pedimentos de vehículos.
   * @returns Observable con la tabla de vehículos.
   */
  obtenerPedimentoTabla(): Observable<VehiculoTabla> {
    return this.http.get<VehiculoTabla>(`assets/json/40101/vahiculo-dummy.json`);
  }

  guardarDatosTramite(datos: unknown): Observable<IniciarResponse> {
    const FULL_URL = `${this.host}/api/sat-t40101/solicitud/registro/guardar`;
    return this.http.post<IniciarResponse>(FULL_URL, datos, { headers: modificarTerrestreService.getApiHeaders() });
  }

  firmaDatos(datos: FirmaDatosRequest): Observable<IniciarResponse> {
    const FULL_URL = `${this.host}/api/sat-t40101/solicitud/registro/${datos.solicitudId}/firmar`;
    return this.http.post<IniciarResponse>(FULL_URL, datos, { headers: modificarTerrestreService.getApiHeaders() });
  }


}