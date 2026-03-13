/**
 * Servicio para la gestión de servicios extraordinarios en el trámite 40301 del sistema AGA.
 *
 * Este archivo contiene el servicio Angular que maneja las operaciones HTTP relacionadas
 * con los servicios extraordinarios del trámite CAAT Naviero. Proporciona funcionalidad
 * para obtener catálogos y configuraciones desde el servidor de datos auxiliares,
 * gestionando las respuestas y errores de manera centralizada.
 *
 * El servicio implementa:
 * - Comunicación HTTP con el servidor de catálogos auxiliares
 * - Manejo de errores con RxJS operators
 * - Tipado estricto para respuestas del servidor
 * - Configuración de URLs basada en variables de entorno
 *
 * @fileoverview Servicio para gestión de servicios extraordinarios del trámite 40301
 * @author Sistema de Gestión de Trámites - Frontend Team
 * @version 1.0.0
 * @since 1.0.0
 * @module ServiciosExtraordinariosService
 */

import { Observable, catchError, throwError } from 'rxjs';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Interfaz que define la estructura de una respuesta JSON del servidor de catálogos.
 *
 * Esta interfaz especifica el contrato para las respuestas HTTP que retorna el
 * servidor de catálogos auxiliares, garantizando la consistencia de tipos y
 * facilitando el manejo de datos en toda la aplicación. Se utiliza para
 * deserializar las respuestas JSON y proporcionar tipado estricto.
 *
 * @interface JSONResponse
 *
 * @example
 * ```typescript
 * // Ejemplo de respuesta típica del servidor:
 * const respuesta: JSONResponse = {
 *   id: 12345,
 *   descripcion: 'Catálogo de servicios extraordinarios',
 *   codigo: 'SE_001',
 *   data: '{"configuracion": "valor", "estado": "activo"}'
 * };
 * ```
 *
 * @since 1.0.0
 */
export interface JSONResponse {
  /**
   * @property {number} id
   * Identificador único de la respuesta del catálogo.
   */
  id: number;

  /**
   * @property {string} descripcion
   * Descripción textual del catálogo o servicio consultado.
   */
  descripcion: string;

  /**
   * @property {string} codigo
   * Código alfanumérico único que identifica el tipo de catálogo.
   */
  codigo: string;

  /**
   * @property {string} data
   * Información adicional del catálogo en formato JSON serializado como cadena.
   */
  data: string;
}

/**
 * Servicio Angular para la gestión de servicios extraordinarios del trámite 40301.
 *
 * Este servicio proporciona funcionalidad centralizada para acceder a los catálogos
 * y configuraciones de servicios extraordinarios desde el servidor de datos auxiliares.
 * Implementa el patrón de inyección de dependencias de Angular y maneja las
 * comunicaciones HTTP de manera reactiva utilizando RxJS Observables.
 *
 * Funcionalidades principales:
 * - Consulta de catálogos por identificador único
 * - Manejo centralizado de errores HTTP
 * - Configuración automática de URLs basada en entorno
 * - Tipado estricto para respuestas del servidor
 * - Integración con el sistema de inyección de dependencias de Angular
 *
 * @service
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * // Inyección del servicio en un componente:
 * constructor(private serviciosService: ServiciosExtraordinariosService) {}
 *
 * // Uso del servicio para obtener un catálogo:
 * this.serviciosService.obtenerTramite(123).subscribe({
 *   next: (respuesta) => console.log('Catálogo:', respuesta),
 *   error: (error) => console.error('Error:', error)
 * });
 * ```
 *
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})

export class ServiciosExtraordinariosService {
  /**
   * URL del servidor de catálogos auxiliares configurada desde variables de entorno.
   *
   * Esta propiedad almacena la URL base para realizar peticiones HTTP al servidor
   * de catálogos auxiliares. Se inicializa automáticamente desde la configuración
   * de entorno, permitiendo diferentes URLs para desarrollo, pruebas y producción
   * sin modificar el código fuente.
   *
   * @property {string} urlServerCatalogos
   * @readonly
   *
   * @example
   * ```typescript
   * // Ejemplo de URL típica:
   * // "https://api.aga.gob.mx/catalogos-auxiliares"
   * // "http://localhost:3000/catalogos" (desarrollo)
   * ```
   *
   * @since 1.0.0
   */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Constructor del servicio de servicios extraordinarios.
   *
   * Inyecta el cliente HTTP de Angular necesario para realizar peticiones
   * al servidor de catálogos auxiliares. La inyección de dependencias es
   * manejada automáticamente por el framework de Angular, proporcionando
   * una instancia configurada del HttpClient.
   *
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones al servidor
   *
   * @example
   * ```typescript
   * // Angular maneja automáticamente la inyección:
   * // - http: Instancia configurada de HttpClient con interceptors globales
   * // - Configuración automática de headers, timeouts y otros aspectos HTTP
   * ```
   *
   * @since 1.0.0
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene un catálogo específico por su identificador único desde el servidor.
   *
   * Este método realiza una petición HTTP GET al servidor de catálogos auxiliares
   * para obtener la información de un catálogo específico. La respuesta se maneja
   * de forma reactiva utilizando RxJS Observables, incluyendo manejo de errores
   * centralizado que propaga los errores HTTP para su manejo en los componentes.
   *
   * @method obtenerTramite
   * @param {number} id - Identificador único del catálogo a obtener del servidor
   * @returns {Observable<JSONResponse>} Observable que emite la respuesta del servidor con los datos del catálogo
   *
   * @example
   * ```typescript
   * // Obtener catálogo específico:
   * this.serviciosExtraordinarios.obtenerTramite(12345).subscribe({
   *   next: (catalogo) => {
   *     console.log('ID:', catalogo.id);
   *     console.log('Descripción:', catalogo.descripcion);
   *     console.log('Datos:', JSON.parse(catalogo.data));
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener catálogo:', error);
   *     // Manejar error (mostrar mensaje, redirigir, etc.)
   *   }
   * });
   *
   * // Con async/await:
   * try {
   *   const catalogo = await this.serviciosExtraordinarios.obtenerTramite(12345).toPromise();
   *   // Procesar catálogo...
   * } catch (error) {
   *   // Manejar error...
   * }
   * ```
   *
   * @throws {Observable<any>} Error HTTP propagado cuando falla la petición al servidor
   *
   * @since 1.0.0
   */
  obtenerTramite(id: number): Observable<JSONResponse> {
    return this.http.get<JSONResponse>(`${this.urlServerCatalogos}/${id}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
