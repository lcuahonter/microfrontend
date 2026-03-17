/**
 * Servicio para la obtención y gestión de datos de la tabla de hechos del trámite 32516.
 *
 * Este servicio proporciona métodos para cargar y gestionar los datos relacionados con la tabla de hechos
 * específica del trámite 32516. Realiza solicitudes HTTP para obtener información desde archivos JSON
 * externos ubicados en los assets de la aplicación, facilitando la carga de datos estructurados
 * para la visualización en componentes de tabla.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio inyectable para la gestión de datos de la tabla de hechos del trámite 32516.
 *
 * Proporciona funcionalidades para:
 * - Obtener datos de la tabla de hechos desde archivos JSON externos
 * - Gestionar la comunicación HTTP con recursos estáticos
 * - Proporcionar datos estructurados para componentes de visualización
 *
 * Este servicio actúa como intermediario entre los componentes que muestran tablas de hechos
 * y los datos almacenados en archivos JSON, garantizando una arquitectura limpia y
 * una separación clara de responsabilidades.
 *
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class HechosTablaServicios {
  /**
   * Ruta del archivo JSON que contiene los datos de la tabla de hechos del trámite 32516.
   *
   * Esta constante define la ubicación del archivo JSON que almacena los datos estructurados
   * de la tabla de hechos. El archivo se encuentra ubicado en los assets de la aplicación
   * bajo la ruta específica del trámite 32516.
   *
   * Ruta completa: '/assets/json/32516/hechos-tabla-datos.json'
   *
   * @constant {string}
   * @private
   * @readonly
   */
  private jsonUrl = '/assets/json/32516/hechos-tabla-datos.json';
  
  /**
   * Constructor del servicio HechosTablaServicios.
   *
   * Inicializa las dependencias necesarias para el funcionamiento del servicio,
   * específicamente el cliente HTTP que se utilizará para realizar las peticiones
   * a los archivos JSON que contienen los datos de la tabla de hechos.
   *
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones HTTP a recursos externos y archivos JSON
   * 
   * @example
   * ```typescript
   * // El servicio se inyecta automáticamente en componentes o otros servicios
   * constructor(private hechosService: HechosTablaServicios) {}
   * ```
   */
  constructor(private http: HttpClient) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene los datos de la tabla de hechos desde un archivo JSON externo.
   *
   * Este método realiza una petición HTTP GET para cargar los datos de la tabla de hechos
   * del trámite 32516 desde un archivo JSON ubicado en los assets de la aplicación.
   * Los datos obtenidos contienen información estructurada que será utilizada para
   * poblar las tablas de hechos en los componentes de la interfaz de usuario.
   *
   * La petición se realiza de forma asíncrona y retorna un Observable que permite
   * suscribirse a los cambios y manejar tanto los datos exitosos como los errores
   * que puedan ocurrir durante la carga.
   *
   * Ruta del archivo: '/assets/json/32516/hechos-tabla-datos.json'
   *
   * @returns {Observable<any>} Observable que emite los datos de la tabla de hechos como un array de objetos
   * 
   * @example
   * ```typescript
   * this.hechosTablaServicios.obtenerDatos().subscribe({
   *   next: (datos) => {
   *     console.log('Datos de la tabla de hechos:', datos);
   *     // Procesar y mostrar los datos en la tabla
   *   },
   *   error: (error) => {
   *     console.error('Error al cargar datos de hechos:', error);
   *   }
   * });
   * ```
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo JSON o si ocurre un problema en la petición
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  obtenerDatos(): Observable<any> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      // Aquí se pueden agregar operadores de RxJS si es necesario
    );
  } 

  
   
}