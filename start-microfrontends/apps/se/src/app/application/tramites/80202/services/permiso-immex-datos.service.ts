import { BuscarPayload, FraccionPayload, FraccionResponse, GuardarFraccionResponse, fraccionInfo } from '../models/immex-ampliacion-sensibles.model';
import { ImmexAmpliacionSensiblesStore, ImmexRegistroState } from '../estados/immex-ampliacion-sensibles.store';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../shared/servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { CadenaOriginalRequest } from '../../130118/model/request/cadena-original-request.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { FirmarRequest } from '@libs/shared/data-access-user/src/core/models/shared/firma-electronica/request/firmar-request.model';
import { HttpClient } from '@angular/common/http';
import { ImmexAmpliacionSensiblesQuery } from '../estados/immex-ampliacion-sensibles.query';
import { Injectable } from '@angular/core';
import { PROC_80202 } from '../servers/api-routes';


@Injectable({
  providedIn: 'root'
})
export class PermisoImmexDatosService {
  /**
   * @property {string} jsonUrl
   * @description URL del archivo JSON que contiene los datos del permiso IMMEX.
   */
  private jsonUrl = '/assets/json/80202/immex-table.json';

  /**
   * @constructor
   * @description Constructor que inicializa el cliente HTTP para realizar solicitudes.
   * @param {HttpClient} httpClient - Cliente HTTP para realizar solicitudes.
   */
  constructor(private httpClient: HttpClient,private readonly tramite80202Store:ImmexAmpliacionSensiblesStore, private tramite80202Query: ImmexAmpliacionSensiblesQuery) {}

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<Solicitud110201State>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<ImmexRegistroState> {
    return this.tramite80202Query.selectSolicitud$;
  }
  
  /**
   * @method getDatos
   * @description Obtiene los datos del permiso IMMEX desde el archivo JSON.
   * @returns {Observable<unknown[]>} Observable que emite los datos del permiso IMMEX.
   */
  getDatos(): Observable<unknown> {
    return this.httpClient.get<unknown[]>(this.jsonUrl).pipe(
    );
  }  
  /**
   * @description
   * Obtiene los datos del registro de toma de muestras de mercancías para el trámite IMMEX.
   * Realiza una petición HTTP GET para recuperar la información desde un archivo JSON local.
   *
   * @returns Un observable que emite el estado del registro IMMEX.
   *
   * @memberof PermisoImmexDatosService
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<ImmexRegistroState> {
    return this.httpClient.get<ImmexRegistroState>('assets/json/80202/immexRegistro.json');
  }
  getNicos(): Observable<Catalogo[]> {
    return this.httpClient.get<Catalogo[]>('assets/json/80202/nico.json');
    
  }

   /**
   * Actualiza el estado del formulario en el store de Akita con los datos proporcionados.
   * @param {immexRegistroform} DATOS - Datos del formulario de registro IMMEX.
   * @returns {void}
   */
  actualizarEstadoFormulario(DATOS: ImmexRegistroState): void {
    this.tramite80202Store.updateImportacionAndExportacion(DATOS.importacion, DATOS.exportacion);
  }

   /**
   * Obtiene la lista de subfabricantes disponibles.
   * @method guardarFraccion
   * @returns {Observable<TableData>} Observable con la lista de subfabricantes disponibles.
   */
  guardarFraccion(body: BuscarPayload): Observable<GuardarFraccionResponse> {
     return this.httpClient.post<GuardarFraccionResponse>(API_ROUTES('/sat-t80202','80202').buscarfraccionarancelariaImportacion, body).pipe(
            map((response) => response),
            catchError(() => {
              const ERROR = new Error(`Error al obtener la lista de subfabricantes en ${API_ROUTES('/sat-t80202','80202').buscarPlantas}`);
              return throwError(() => ERROR);
            })
          );
  }


  guardarFraccionExportacion(body: FraccionPayload): Observable<FraccionResponse> {
     return this.httpClient.post<FraccionResponse>(API_ROUTES('/sat-t80202','80202').buscarfraccionArancelaria, body).pipe(
            map((response) => response),
            catchError(() => {
              const ERROR = new Error(`Error al obtener la lista de subfabricantes en ${API_ROUTES('/sat-t80202','80202').buscarPlantas}`);
              return throwError(() => ERROR);
            })
          );
  }

   /**
         * Envía una solicitud de firma electrónica.
         * @param idSolicitud - ID de la solicitud a firmar.
         * @param body - Cuerpo de la solicitud de firma.
         * @returns Observable con la respuesta del servidor.
         */
      enviarFirma<T>(idSolicitud: string | number, body: FirmarRequest): Observable<BaseResponse<T>> {
        return this.httpClient.post<BaseResponse<T>>(PROC_80202.API_POST_FIRMA(String(idSolicitud)), body).pipe(
          map(response => response),
          catchError(() => {
            const ERROR = new Error(`Error al firmar solicitud con ID ${idSolicitud}`);
            return throwError(() => ERROR);
          })
        );
      }
  
       /**
         * Obtiene la cadena original del trámite 130118.
         * @param body Objeto que contiene los datos necesarios para generar la cadena original.
         * @returns Un observable que emite la respuesta del servidor con la cadena original.
         */
        obtenerCadenaOriginal<T>(idSolicitud: string, body: CadenaOriginalRequest): Observable<BaseResponse<T>> {
          return this.httpClient.post<BaseResponse<T>>(PROC_80202.API_POST_CADENA_ORIGINAL(idSolicitud), body).pipe(
            map((response) => response),
            catchError(() => {
              const ERROR = new Error(`Error al obtener la cadena original en ${PROC_80202.API_POST_CADENA_ORIGINAL(idSolicitud)}`);
              return throwError(() => ERROR);
            })
          );
        }


}
