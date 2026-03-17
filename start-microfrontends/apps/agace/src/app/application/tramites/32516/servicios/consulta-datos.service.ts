/**
 * Servicio para la consulta y gestión de datos del trámite 32516.
 *
 * Este servicio proporciona métodos para actualizar y obtener datos relacionados con el trámite 32516,
 * incluyendo la gestión del estado de la solicitud, mercancía y datos generales del formulario.
 * Actúa como intermediario entre los componentes y el store del trámite, así como para la obtención
 * de datos desde archivos JSON externos.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SeccionLibStore } from '@ng-mf/data-access-user';
import { TramiteState } from '../estados/tramite32516Store.store';
import { TramiteStore } from '../estados/tramite32516Store.store';

/**
 * Servicio inyectable para la consulta y gestión de datos del trámite 32516.
 *
 * Proporciona funcionalidades para:
 * - Actualizar datos de solicitud en el store
 * - Actualizar datos de mercancía/región en el store
 * - Actualizar el estado completo del formulario
 * - Obtener datos desde archivos JSON externos
 *
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class ConsultaDatosService {
  /**
   * Constructor del servicio ConsultaDatosService.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del servicio:
   * - HttpClient para realizar peticiones HTTP
   * - TramiteStore para gestionar el estado del trámite
   * - SeccionLibStore para gestionar el estado de secciones
   *
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones a APIs externas y archivos JSON
   * @param {TramiteStore} tramiteStore - Store para gestionar el estado del trámite 32516
   * @param {SeccionLibStore} seccionStore - Store para gestionar el estado de secciones de la librería
   */
  constructor(private http: HttpClient, private readonly tramiteStore: TramiteStore, private readonly seccionStore: SeccionLibStore ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
   }

    /**
   * Actualiza el estado completo del formulario en el store del trámite.
   *
   * Este método permite actualizar de manera integral todos los datos del formulario
   * del trámite 32516, incluyendo tanto los datos de la solicitud como los datos
   * de mercancía. Es útil cuando se necesita sincronizar todo el estado del formulario
   * de una sola vez, garantizando la consistencia entre todas las secciones.
   *
   * @param {TramiteState} DATOS - Objeto completo que contiene todos los datos del formulario del trámite
   * @param {TramiteState['SolicitudState']} DATOS.SolicitudState - Estado de la solicitud dentro del objeto de datos
   * @param {TramiteState['MercanciaState']} DATOS.MercanciaState - Estado de la mercancía dentro del objeto de datos
   * @returns {void}
   * 
   * @example
   * ```typescript
   * const datosCompletos: TramiteState = {
   *   SolicitudState: {
   *     numeroSolicitud: '123456',
   *     fechaSolicitud: new Date(),
   *     // ... otros campos de solicitud
   *   },
   *   MercanciaState: {
   *     tipoMercancia: 'Electrónicos',
   *     region: 'Norte',
   *     // ... otros campos de mercancía
   *   }
   * };
   * this.consultaDatosService.actualizarEstadoFormulario(datosCompletos);
   * ```
   */
  actualizarEstadoFormulario(DATOS: TramiteState): void {
    this.tramiteStore.update((state) => ({
      ...state,
      ...DATOS
    }))
  }
  /**
   * Obtiene los datos de la solicitud desde un archivo JSON externo.
   *
   * Este método realiza una petición HTTP GET para obtener los datos predefinidos
   * de la solicitud del trámite 32516 desde un archivo JSON ubicado en los assets
   * de la aplicación. Es útil para cargar datos de ejemplo, configuraciones por defecto,
   * o información de consulta relacionada con el trámite.
   *
   * La ruta del archivo JSON es: 'assets/json/32516/consulta-datos.json'
   *
   * @returns {Observable<TramiteState>} Observable que emite los datos completos del trámite incluyendo solicitud y mercancía
   * 
   * @example
   * ```typescript
   * this.consultaDatosService.getDatosDeLaSolicitudData().subscribe({
   *   next: (datos) => {
   *     console.log('Datos obtenidos:', datos);
   *     // Procesar los datos obtenidos
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener datos:', error);
   *   }
   * });
   * ```
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo JSON o si ocurre un problema en la petición
   */
  getDatosDeLaSolicitudData(): Observable<TramiteState> {
    return this.http.get<TramiteState>('assets/json/32516/consulta-datos.json');
  }
}
