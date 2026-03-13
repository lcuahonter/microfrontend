/**
 * Servicio para la gestión de catálogos utilizados en el trámite 290101.
 *
 * Este servicio proporciona métodos para obtener diferentes tipos de catálogos desde archivos JSON
 * ubicados en la carpeta de assets. Los catálogos incluyen información sobre aduanas, estados,
 * tipos de café, clasificaciones y opciones para formularios.
 *
 * @example
 * ```typescript
 * constructor(private catalogosService: CatalogosService) {}
 * 
 * ngOnInit() {
 *   this.catalogosService.obtenerAduanaDeIngreso().subscribe(data => {
 *     console.log(data);
 *   });
 * }
 * ```
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CatalogosService {
  /**
   * URL base para los archivos JSON de catálogos del trámite 290101.
   *
   * @private
   * @constant {string}
   */
  private jsonUrl = '/assets/json/290101/';
  
  /**
   * Constructor del servicio CatalogosService.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar peticiones a los archivos JSON.
   */
  constructor(private http: HttpClient) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene el catálogo de aduanas de ingreso.
   *
   * Este método realiza una petición HTTP GET para obtener la información
   * de las aduanas de ingreso disponibles desde un archivo JSON estático.
   *
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta del catálogo de aduanas.
   *
   * @example
   * ```typescript
   * this.catalogosService.obtenerAduanaDeIngreso().subscribe({
   *   next: (data) => console.log('Aduanas:', data),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  obtenerAduanaDeIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('/assets/json/290101/aduana_de_ingreso.json');
  }

  /**
   * Carga el catálogo de opciones de bodega (propia o alquilada).
   *
   * Este método obtiene las opciones disponibles para indicar si la bodega
   * es propia o alquilada desde un archivo JSON.
   *
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta del catálogo de bodegas.
   *
   * @example
   * ```typescript
   * this.catalogosService.cargarBodegaPropiaAlquilad().subscribe({
   *   next: (data) => console.log('Opciones de bodega:', data),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  cargarBodegaPropiaAlquilad(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.jsonUrl}propia-alquilada.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * Carga el catálogo de estados.
   *
   * Este método obtiene la lista de estados disponibles desde un archivo JSON
   * para su uso en formularios o componentes que requieran esta información.
   *
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta del catálogo de estados.
   *
   * @example
   * ```typescript
   * this.catalogosService.cargarEstadoCatalog().subscribe({
   *   next: (data) => console.log('Estados:', data),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  cargarEstadoCatalog(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.jsonUrl}estado.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * Carga el catálogo de clasificaciones.
   *
   * Este método obtiene las opciones de clasificación disponibles.
   * Actualmente utiliza el mismo archivo que las opciones de bodega.
   *
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta del catálogo de clasificaciones.
   *
   * @example
   * ```typescript
   * this.catalogosService.cargarClasificacion().subscribe({
   *   next: (data) => console.log('Clasificaciones:', data),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   * 
   * @todo Verificar si debe usar un archivo JSON específico para clasificaciones.
   */
  cargarClasificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`${this.jsonUrl}propia-alquilada.json`).pipe(
      map((response) => response)
    );
  } 

  /**
   * Carga el catálogo de tipos de café.
   *
   * Este método obtiene la lista de tipos de café disponibles desde un archivo JSON
   * específico para esta clasificación de productos.
   *
   * @returns {Observable<RespuestaCatalogos>} Observable que emite la respuesta del catálogo de tipos de café.
   *
   * @example
   * ```typescript
   * this.catalogosService.cargarTipoDeCafe().subscribe({
   *   next: (data) => console.log('Tipos de café:', data),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  cargarTipoDeCafe(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`/assets/json/290101/tipo-de-cafe.json`).pipe(
      map((response) => response)
    );
  }

  /**
   * Opciones para el radio button de exención de pago.
   *
   * Proporciona las opciones disponibles para indicar si aplica o no
   * la exención de pago en el trámite.
   *
   * Cada opción contiene las siguientes propiedades:
   * - `label`: Texto descriptivo mostrado al usuario.
   * - `value`: Valor string que representa la opción seleccionada.
   *
   * @constant {Array<{label: string, value: string}>}
   *
   * @example
   * ```typescript
   * const opciones = this.catalogosService.RadioOpcion;
   * console.log(opciones); // [{ label: 'Sí', value: 'true' }, { label: 'No', value: 'false' }]
   * ```
   */
  RadioOpcion = [
    /**
     * @property {string} label - Etiqueta para la opción afirmativa.
     * @property {string} value - Valor string 'true' para la opción afirmativa.
     */
    { label: 'Sí', value: 'true' },
    
    /**
     * @property {string} label - Etiqueta para la opción negativa.
     * @property {string} value - Valor string 'false' para la opción negativa.
     */
    { label: 'No', value: 'false' }
  ];
}
