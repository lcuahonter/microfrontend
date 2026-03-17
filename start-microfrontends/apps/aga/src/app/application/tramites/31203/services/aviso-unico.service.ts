
import { AvisoValor, PreOperativo } from '../models/aviso.model';
import { Observable, catchError, throwError } from 'rxjs';
import { UnicoState, UnicoStore } from '../estados/renovacion.store';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * @class
 * @name AvisoUnicoService
 * @description
 * Servicio que proporciona métodos para obtener datos relacionados con el aviso único.
 */
@Injectable({
  providedIn: 'root',
})
export class AvisoUnicoService {
  static get(): never {
    throw new Error('Method not implemented.');
  }
    /**
    * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
    */
  urlServer = ENVIRONMENT.URL_SERVER;
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio `AvisoUnicoService`.
   * @param http Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(
    private http: HttpClient,
     private unicoStore: UnicoStore,
    ) {
    // Constructor
  }

  /**
   * @method
   * @name obtenerDatosLocalidad
   * @description
   * Obtiene los datos de la localidad desde un archivo JSON.
   * @returns {Observable<unknown>} Un observable que emite los datos de la localidad.
   * En caso de error, lanza un observable con el error capturado.
   */
  obtenerDatosLocalidad(): Observable<unknown> {
    return this.http.get('assets/json/31203/aviso.json').pipe(
      catchError((error: unknown) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * @method
   * @name getSolicitante
   * @description
   * Obtiene los datos del solicitante desde un archivo JSON.
   * @returns {Observable<unknown>} Un observable que emite los datos del solicitante.
   */
  getSolicitante(): Observable<AvisoValor> {
    return this.http.get<AvisoValor>('assets/json/31203/renovacion.json');
  }

  /**
    * @method
    * @name obtenerRadio
    * @description
    * Obtiene una lista de objetos de tipo `PreOperativo` desde un archivo JSON local.
    * @returns {Observable<PreOperativo[]>} Un observable que emite un arreglo de objetos `PreOperativo`.
    * @example
    * this.avisoUnicoService.obtenerRadio().subscribe((data: PreOperativo[]) => {
    *   console.log(data);
    * });
    */
  obtenerRadio(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/31203/tipoPersonaradio.json');
  }

  /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   * @param DATOS Objeto con los datos del formulario de tipo Solicitud10301State.
   */
  actualizarEstadoFormulario(DATOS: UnicoState): void {
    this.unicoStore.setmapTipoTramite(DATOS.mapTipoTramite);
    this.unicoStore.setmapDeclaracionSolicitud(DATOS.mapDeclaracionSolicitud);
    this.unicoStore.setenvioAviso(DATOS.envioAviso);
    this.unicoStore.setnumeroAviso(DATOS.numeroAviso);
    this.unicoStore.setclaveReferencia(DATOS.claveReferencia);
    this.unicoStore.setnumeroOperacion(DATOS.numeroOperacion);
    this.unicoStore.setcadenaDependencia(DATOS.cadenaDependencia);
    this.unicoStore.setbanco(DATOS.banco);
    this.unicoStore.setllavePago(DATOS.llavePago);
    this.unicoStore.setfechaPago(DATOS.fechaPago);
    this.unicoStore.setimportePago(DATOS.importePago);
  }

  /**
* Obtiene los datos del trámite desde un archivo JSON local.
* @returns Observable con los datos del formulario de tipo UnicoState.
*/
  public getDatosDeTrtamitelDoc(): Observable<UnicoState> {
    return this.http.get<UnicoState>(
      'assets/json/31203/aviso-unico-de-renovacion.json'
    );
  }
}