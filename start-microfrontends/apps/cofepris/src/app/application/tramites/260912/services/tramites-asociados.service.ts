import { Asociados } from '../modelos/tramites-asociados.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con trámites de asociados.
 * 
 * Este servicio proporciona métodos para obtener información de asociados
 * desde archivos JSON locales utilizando HttpClient de Angular.
 * 
 * @author Tu nombre
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```typescript
 * constructor(private tramitesService: TramitesAsociadosService) {}
 * 
 * obtenerAsociados() {
 *   this.tramitesService.enListaDeAsociados().subscribe(
 *     asociados => console.log(asociados)
 *   );
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TramitesAsociadosService {

  /**
   * Constructor del servicio TramitesAsociadosService.
   * 
   * Inicializa el servicio con las dependencias necesarias para realizar
   * peticiones HTTP a través del HttpClient de Angular.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones HTTP
   * 
   * @memberof TramitesAsociadosService
   * @constructor
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por el inyector de dependencias de Angular
   * // No es necesario llamarlo manualmente
   * ```
   */
  constructor(private http: HttpClient) { 
     // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene la lista completa de asociados desde un archivo JSON local.
   * 
   * Este método realiza una petición HTTP GET para recuperar la información
   * de todos los asociados almacenada en el archivo JSON ubicado en los assets.
   * 
   * @returns {Observable<Asociados[]>} Observable que emite un array de objetos Asociados
   *                                   conteniendo la información de todos los asociados
   * 
   * @throws {HttpErrorResponse} Puede lanzar errores HTTP si el archivo no existe o no es accesible
   * 
   * @memberof TramitesAsociadosService
   * @method
   * 
   * @example
   * ```typescript
   * // Uso básico del método
   * this.tramitesAsociadosService.enListaDeAsociados().subscribe({
   *   next: (asociados: Asociados[]) => {
   *     console.log('Lista de asociados obtenida:', asociados);
   *     // Procesar la lista de asociados
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener asociados:', error);
   *   }
   * });
   * ```
   * 
   * @example
   * ```typescript
   * // Uso con async/await
   * async obtenerAsociadosAsync() {
   *   try {
   *     const asociados = await this.tramitesAsociadosService.enListaDeAsociados().toPromise();
   *     return asociados;
   *   } catch (error) {
   *     console.error('Error:', error);
   *     throw error;
   *   }
   * }
   * ```
   * 
   * @see {@link Asociados} Para más información sobre el modelo de datos
   * @see {@link HttpClient} Para más información sobre peticiones HTTP en Angular
   */
  enListaDeAsociados(): Observable<Asociados[]> {
    return this.http.get<Asociados[]>('assets/json/260912/asociadosList.json');
  }
}