import { CambioDeModalidadForm, CambioModalidadResponse, RespuestaCatalogos } from '../modelos/cambio-de-modalidad.model';
import { CambioModalidadState, CambioModalidadStore,} from '../estados/tramite80208.store';
import { Observable, map } from 'rxjs';
import { CambioModalidadQuery } from '../estados/tramite80208.query';
import { ENVIRONMENT } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * @service CambioModalidadService
 * @description
 * Servicio para gestionar las operaciones relacionadas con el cambio de modalidad.
 * Proporciona métodos para obtener datos simulados, servicios IMMEX y cambios de modalidad desde archivos JSON.
 * 
 * @example
 * // Inyectar el servicio en un componente
 * constructor(private cambioModalidadService: CambioModalidadService) {}
 * 
 * // Obtener datos simulados
 * this.cambioModalidadService.getDatosSimulados().subscribe(data => { ... });
 * 
 * @see CambioDeModalidadForm
 * @see CambioModalidadResponse
 * @see RespuestaCatalogos
 * @see CambioModalidadState
 * @see CambioModalidadStore
 * @see CambioModalidadQuery
 * @see HttpCoreService
 * @see HttpClient
 * 
 * @compodoc
 */
/**
 * @compodoc
 * @description
 * Servicio Angular para gestionar el cambio de modalidad en el trámite 80208.
 * Proporciona métodos para obtener datos simulados, servicios IMMEX, y realizar operaciones sobre el estado del formulario.
 * Utiliza HttpClient y HttpCoreService para la comunicación con APIs y archivos JSON locales.
 */
@Injectable({
  providedIn: 'root'
})  
export class CambioModalidadService {

  /**
   * @property {string} datosSimuladosUrl
   * @description URL base para obtener los datos simulados desde archivos JSON.
   * @private
   */
  private datosSimuladosUrl = '/assets/json/80208/';

  /**
   * @property tramiteState - Estado del trámite de cambio de modalidad.
   * @description
   * Objeto que contiene el estado del trámite de cambio de modalidad, definido por la interfaz `CambioModalidadState`.
   * Se inicializa como un objeto vacío y se utilizará para almacenar el estado del formulario y otros datos relevantes.
   * @type {CambioModalidadState}
   */

  tramiteState:CambioModalidadState= {} as CambioModalidadState;

  /**
   * @constructor
   * @description Constructor del servicio.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(
    private http: HttpClient,
    public httpService: HttpCoreService,
    public cambioModalidadStore: CambioModalidadStore,
    public cambioModalidadQuery: CambioModalidadQuery,
  ) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * @method getDatosSimulados
   * @description Obtiene los datos simulados para el formulario de cambio de modalidad.
   * @returns {Observable<CambioDeModalidadForm>} Observable que emite los datos del formulario.
   */
  getDatosSimulados(): Observable<CambioDeModalidadForm> {
    return this.http.get<CambioDeModalidadForm>(`${this.datosSimuladosUrl}cambio-de-modalidad.json`);
  }

  /**
   * @method getServiciosImmx
   * @description Obtiene los servicios IMMEX desde un archivo JSON simulado.
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta de los catálogos.
   */
  getServiciosImmx(): Observable<RespuestaCatalogos> {
    return this.httpService.get<RespuestaCatalogos>(`${ENVIRONMENT.API_HOST}/api/catalogo/servicios-immex`, {}, false).pipe(map((res: RespuestaCatalogos) => {
            return res;
          }));
  }

  /**
   * @method getCambioDeModalidad
   * @description Obtiene la respuesta del cambio de modalidad desde un archivo JSON simulado.
   * @returns {Observable<CambioModalidadResponse>} Observable que emite la respuesta del cambio de modalidad.
   */
  getCambioDeModalidad(tramiteID: string): Observable<CambioModalidadResponse> {
    return this.httpService.get<CambioModalidadResponse>(`${ENVIRONMENT.API_HOST}/api/sat-t${tramiteID}/catalogo/modalidad-immex`, {}, false).pipe(map((res: CambioModalidadResponse) => {
            return res;
          }));
  }

  /**
   * @method actualizarEstadoFormulario
   * @description
   * Actualiza el estado del formulario en el store de cambio de modalidad.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS:CambioModalidadState): void {
   this.cambioModalidadStore.actualizarEstado({
      seleccionaLaModalidad: DATOS.seleccionaLaModalidad,
      folio: DATOS.folio,
      ano: DATOS.ano,
      seleccionaModalidad: DATOS.seleccionaModalidad,
      cambioDeModalidad: DATOS.cambioDeModalidad,
      serviciosImmx: DATOS.serviciosImmx,
      rfcEmpresa: DATOS.rfcEmpresa,
      numeroPrograma: DATOS.numeroPrograma,
      tiempoPrograma: DATOS.tiempoPrograma,
      datos: DATOS.datos,
      ServiciosDatos: DATOS.ServiciosDatos
      
      })
  }

  /**
   * @method getDatosDeLaSolicitudData
   * @description
   * Obtiene los datos de la solicitud de cambio de modalidad desde un archivo JSON simulado.
   * @returns {Observable<ServiciosState>} Observable que emite los datos de la solicitud.
   */
  getDatosDeLaSolicitudData(): Observable<CambioModalidadState> {
    return this.http.get<CambioModalidadState>('assets/json/80208/cambio-de-modalidad-datos.json');
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<CambioModalidadState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<CambioModalidadState> {
    return this.cambioModalidadQuery.allStoreData$;
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST para guardar la solicitud.
   * 
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: CambioModalidadState): Observable<CambioModalidadResponse> {
    return this.httpService.post<CambioModalidadResponse>(`${ENVIRONMENT.API_HOST}/api/solicitud/guardar`, { body: body });
  }

} 