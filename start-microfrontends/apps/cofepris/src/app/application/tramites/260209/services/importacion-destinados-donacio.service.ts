import { Tramite260209State, Tramite260209Store } from '../estados/tramite260209Store.store';
import { GuardarAdapter_260209 } from '../adapters/guardar-payload.adapter';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


/**
 * Servicio para gestionar las operaciones relacionadas con la importación 
 * destinada a donación dentro del trámite 260209.
 * 
 * Este servicio proporciona funcionalidades para:
 * - Actualizar el estado del formulario de importación
 * - Obtener datos de registro de toma de muestras de mercancías
 * - Interactuar con el almacén de estado del trámite 260209
 * 
 * @since 1.0.0
 * @author Sistema VUCEM 3.0
 */
@Injectable({
  providedIn: 'root'
})
export class ImportacionDestinadosDonacioService {

  /**
   * Cliente HTTP para realizar peticiones HTTP.
   * 
   * @private
   * @readonly
   * @type {HttpClient}
   * @memberof ImportacionDestinadosDonacioService
   */
  private readonly http: HttpClient;

  /**
   * Almacén de estado que gestiona la información del trámite 260209.
   * 
   * @private
   * @readonly
   * @type {Tramite260209Store}
   * @memberof ImportacionDestinadosDonacioService
   */
  private readonly tramite260209Store: Tramite260209Store;

  /**
   * Crea una instancia del servicio ImportacionDestinadosDonacioService.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular utilizado para realizar peticiones HTTP.
   * @param {Tramite260209Store} tramite260209Store - Almacén que gestiona el estado del proceso 260209.
   * 
   * @memberof ImportacionDestinadosDonacioService
   */
  constructor(
    http: HttpClient,
    tramite260209Store: Tramite260209Store
  ) {
    this.http = http;
    this.tramite260209Store = tramite260209Store;
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * Este método permite modificar el estado global del trámite 260209 mediante
   * la fusión de los datos existentes con los nuevos datos proporcionados.
   * 
   * @param {Tramite260209State} DATOS - Estado de la solicitud `Tramite260209State` con la información 
   *                                     del tipo de solicitud a actualizar en el almacén de estado.
   * 
   * @returns {void} No retorna ningún valor.
   * 
   * @example
   * ```typescript
   * const nuevosDatos: Tramite260209State = {
   *   tipoSolicitud: 'donacion',
   *   numeroExpediente: '123456'
   * };
   * this.service.actualizarEstadoFormulario(nuevosDatos);
   * ```
   * 
   * @memberof ImportacionDestinadosDonacioService
   */
  actualizarEstadoFormulario(DATOS: Tramite260209State): void {
    this.tramite260209Store.update((state) => ({
      ...state,
      ...DATOS
    }));
  }
  
    /**
     * Realiza la llamada al API para guardar el trámite 260209.
     * @param {Tramite260209State} state - Estado actual del trámite
     * @returns {Observable<any>} Respuesta del API
     */
    guardarTramite(state: Tramite260209State): Observable<object> {
      const PAYLOAD = GuardarAdapter_260209.toFormPayload(state);
      return this.http.post<object>('/api/tramites/260209/guardar', PAYLOAD);
    }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * 
   * Este método realiza una petición HTTP GET para cargar los datos de configuración
   * del trámite 260209 desde un archivo JSON estático ubicado en los assets de la aplicación.
   * Los datos incluyen información sobre el registro de toma de muestras de mercancías
   * para procesos de importación destinados a donación.
   * 
   * @returns {Observable<Tramite260209State>} Observable que emite los datos del estado de la solicitud
   *                                          `Tramite260209State`, cargados desde el archivo JSON
   *                                          especificado en la ruta de `assets`.
   * 
   * @throws {HttpErrorResponse} Puede arrojar errores HTTP si el archivo no existe o no es accesible.
   * 
   * @example
   * ```typescript
   * this.service.getRegistroTomaMuestrasMercanciasData().subscribe({
   *   next: (datos) => {
   *     console.log('Datos cargados:', datos);
   *     // Procesar los datos obtenidos
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar datos:', error);
   *   }
   * });
   * ```
   * 
   * @see {@link https://angular.io/guide/http} Documentación de HttpClient de Angular
   * @memberof ImportacionDestinadosDonacioService
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260209State> {
    return this.http.get<Tramite260209State>('assets/json/260209/datos.json');
  }
}
