import { Observable, map } from 'rxjs';
import { DatosDelProveedoresManual } from '../models/proveedores.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite420101State } from '../estados/tramite420101Store.store';

/**
 * Servicio para el registro y gestión de proveedores del trámite 420101.
 * 
 * @description Este servicio proporciona métodos para obtener información relacionada
 *              con proveedores y el registro de toma de muestras de mercancías para
 *              el trámite 420101. Utiliza archivos JSON estáticos como fuente de datos.
 * 
 * @example
 * ```typescript
 * constructor(private registrarProveedoresService: RegistrarProveedoresService) {}
 * 
 * // Obtener datos de proveedores manuales
 * this.registrarProveedoresService.proveedoresManual().subscribe(datos => {
 *   console.log(datos);
 * });
 * ```
 * 
 * @since 3.0
 * @author Sistema VUCEM
 */
@Injectable({
  providedIn: 'root',
})
export class RegistrarProveedoresService {

  /**
   * URL base para las peticiones a los recursos JSON relacionados con el trámite 420101.
   * @private
   * @type {string}
   */
  private apiUrl = 'assets/json/420101/';

  /**
   * @constructor
   * @description Constructor que inicializa el servicio HTTP necesario para realizar solicitudes.
   * @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) { }
  
  /**
   * Obtiene los datos de proveedores manuales desde un archivo JSON.
   * 
   * @description Este método realiza una petición HTTP GET para obtener los datos
   *              de proveedores manuales desde el archivo JSON correspondiente.
   * 
   * @returns {Observable<DatosDelProveedoresManual>} Observable que emite los datos de proveedores manuales.
   * 
   * @example
   * ```typescript
   * this.registrarProveedoresService.proveedoresManual().subscribe({
   *   next: (datos) => {
   *     console.log('Datos de proveedores:', datos);
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener proveedores:', error);
   *   }
   * });
   * ```
   */
  proveedoresManual(): Observable<DatosDelProveedoresManual> {
    return this.http.get<DatosDelProveedoresManual>(`${this.apiUrl}proveedores.json`).pipe(
      map((res) => res)
    );
  }

/**
 * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
 * 
 * @description Este método realiza una petición HTTP GET para obtener los datos del estado
 *              del trámite 420101 relacionados con el registro de toma de muestras de mercancías.
 *              Los datos se cargan desde un archivo JSON estático ubicado en los assets.
 * 
 * @returns {Observable<Tramite420101State>} Observable que emite los datos del estado del trámite 420101,
 *          cargados desde el archivo JSON especificado en la ruta de assets.
 * 
 * @example
 * ```typescript
 * this.registrarProveedoresService.getRegistroTomaMuestrasMercanciasData().subscribe({
 *   next: (estadoTramite) => {
 *     console.log('Estado del trámite 420101:', estadoTramite);
 *   },
 *   error: (error) => {
 *     console.error('Error al obtener datos del registro:', error);
 *   }
 * });
 * ```
 * 
 * @throws {HttpErrorResponse} Error HTTP si no se puede cargar el archivo JSON.
 */
getRegistroTomaMuestrasMercanciasData(): Observable<Tramite420101State> {
  return this.http.get<Tramite420101State>('assets/json/420101/respuestaDeActualizacionDe.json');
}

}
