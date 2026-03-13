import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con las bodegas del trámite 290101.
 * 
 * Este servicio proporciona métodos para obtener información de bodegas desde archivos JSON
 * almacenados en los assets de la aplicación. Está diseñado específicamente para el trámite
 * 290101 y maneja la comunicación HTTP para la obtención de datos de bodegas.
 * 
 * @class BodegasService
 * @since 1.0.0
 * @author Sistema VUCEM 3.0
 * @example
 * ```typescript
 * constructor(private bodegasService: BodegasService) {}
 * 
 * ngOnInit() {
 *   this.bodegasService.getDatos().subscribe(datos => {
 *     console.log('Datos de bodegas:', datos);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BodegasService {
  /**
   * URL base para los datos de las bodegas del trámite 290101.
   * 
   * Esta ruta apunta al directorio donde se almacenan los archivos JSON
   * que contienen la información de las bodegas relacionadas con el trámite.
   * 
   * @private
   * @readonly
   * @type {string}
   * @memberof BodegasService
   * @constant
   * @default '/assets/json/290101/'
   */
  private jsonUrl = '/assets/json/290101/';

  /**
   * Constructor del servicio BodegasService.
   * 
   * Inicializa el servicio con las dependencias necesarias para realizar
   * operaciones HTTP y obtener datos de bodegas desde archivos JSON.
   * 
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes HTTP.
   *                           Se utiliza para obtener datos desde los archivos JSON
   *                           ubicados en los assets de la aplicación.
   * @memberof BodegasService
   * @since 1.0.0
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por el sistema de inyección de dependencias de Angular
   * // No es necesario instanciar manualmente este servicio
   * ```
   */
  constructor(private http: HttpClient) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene los datos de las bodegas desde el archivo JSON correspondiente al trámite 290101.
   * 
   * Este método realiza una solicitud HTTP GET para obtener la información de las bodegas
   * almacenada en formato JSON. Los datos obtenidos pueden incluir información como
   * nombres de bodegas, ubicaciones, capacidades, y otros atributos relevantes.
   * 
   * @method getDatos
   * @returns {Observable<any>} Observable que emite los datos de las bodegas.
   *                           El Observable puede contener un array de objetos con
   *                           la información de cada bodega disponible.
   * @memberof BodegasService
   * @since 1.0.0
   * @throws {HttpErrorResponse} Si ocurre un error durante la solicitud HTTP.
   * @example
   * ```typescript
   * this.bodegasService.getDatos().subscribe({
   *   next: (bodegas) => {
   *     console.log('Bodegas obtenidas:', bodegas);
   *     // Procesar los datos de las bodegas
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener bodegas:', error);
   *   }
   * });
   * ```
   * @example
   * ```typescript
   * // Usando async/await
   * async obtenerBodegas() {
   *   try {
   *     const bodegas = await this.bodegasService.getDatos().toPromise();
   *     return bodegas;
   *   } catch (error) {
   *     console.error('Error:', error);
   *   }
   * }
   * ```
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  getDatos(): Observable<any> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      // Se pueden agregar operadores adicionales si es necesario
    );
  }
}