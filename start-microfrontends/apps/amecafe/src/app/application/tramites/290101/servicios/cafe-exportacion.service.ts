/**
 * Servicio para la gestión de datos de café exportación del trámite 290101.
 *
 * Este servicio proporciona funcionalidades para obtener y procesar datos relacionados
 * con la exportación de café desde archivos JSON almacenados en el sistema de assets.
 * Forma parte del módulo AMECAFE para el manejo de trámites de exportación.
 *
 * @fileoverview Servicio Angular para el manejo de datos de café exportación
 * @author Sistema VUCEM 3.0
 * @version 1.0.0
 * @since 2025
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

/**
 * Servicio Injectable para la obtención de datos de café exportación.
 *
 * Esta clase proporciona métodos para acceder a los datos de exportación de café
 * almacenados en archivos JSON dentro del sistema de assets. Utiliza el HttpClient
 * de Angular para realizar las peticiones HTTP necesarias.
 *
 * @class CafeExportacionService
 * @implements {Injectable}
 * @example
 * ```typescript
 * constructor(private cafeService: CafeExportacionService) {}
 * 
 * ngOnInit() {
 *   this.cafeService.getDatos().subscribe(datos => {
 *     console.log('Datos de café:', datos);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CafeExportacionService {
  /**
   * URL base del archivo JSON que contiene los datos del café exportación.
   *
   * Esta propiedad define la ruta hacia el directorio donde se encuentran
   * almacenados los archivos JSON con la información de exportación de café
   * correspondiente al trámite 290101.
   *
   * @private
   * @readonly
   * @type {string}
   * @memberof CafeExportacionService
   */
  private jsonUrl = '/assets/json/290101/';

  /**
   * Constructor del servicio CafeExportacionService.
   *
   * Inicializa el servicio inyectando el HttpClient necesario para realizar
   * las peticiones HTTP a los archivos JSON que contienen los datos de
   * exportación de café.
   *
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes HTTP
   * @memberof CafeExportacionService
   */
  constructor(private http: HttpClient) {
 // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene los datos del café exportación desde el archivo JSON.
   *
   * Este método realiza una petición HTTP GET para recuperar los datos
   * de exportación de café almacenados en el archivo JSON correspondiente
   * al trámite 290101. Los datos se devuelven como un Observable para
   * permitir el manejo asíncrono de la información.
   *
   * @method getDatos
   * @returns {Observable<any>} Observable que emite los datos del café exportación
   * @throws {HttpErrorResponse} En caso de error en la petición HTTP
   * @example
   * ```typescript
   * this.cafeExportacionService.getDatos().subscribe({
   *   next: (datos) => {
   *     console.log('Datos obtenidos:', datos);
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener datos:', error);
   *   }
   * });
   * ```
   * @memberof CafeExportacionService
   */
/* eslint-disable @typescript-eslint/no-explicit-any */

  getDatos(): Observable<any> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
    );
  } 
  
}