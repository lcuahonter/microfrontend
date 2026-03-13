/**
 * Servicio para la gestión de catálogos del trámite 32516.
 * 
 * Este servicio proporciona métodos para obtener datos de catálogos desde archivos JSON
 * ubicados en los assets de la aplicación. Se utiliza para cargar las opciones de menús
 * desplegables y configuraciones relacionadas con el trámite 32516.
 * 
 * @description Maneja la comunicación HTTP para la carga de catálogos de datos
 * necesarios para el funcionamiento de formularios y componentes del trámite.
 * 
 * @version 1.0.0
 * @since 2024
 */
import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { map } from 'rxjs';

/**
 * Servicio Angular para la gestión de catálogos del trámite 32516.
 * 
 * Proporciona métodos para cargar y gestionar datos de catálogos desde archivos JSON
 * almacenados en los assets de la aplicación. Este servicio centraliza el acceso
 * a los datos de configuración necesarios para los formularios y componentes
 * relacionados con el trámite 32516.
 * 
 * @class CatalogosService
 * @injectable
 * @providedIn 'root'
 * 
 * @example
 * ```typescript
 * constructor(private catalogosService: CatalogosService) {}
 * 
 * // Obtener opciones de un menú desplegable
 * this.catalogosService.obtenerMenuDesplegable('opciones.json')
 *   .subscribe(opciones => {
 *     console.log(opciones);
 *   });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  /**
   * URL base para los archivos JSON de catálogos del trámite 32516.
   * 
   * Esta ruta apunta a la ubicación de los assets donde se almacenan
   * los archivos JSON que contienen los datos de los catálogos.
   * 
   * @type {string}
   * @constant
   * @default '/assets/json/32516/'
   */
  url: string = '/assets/json/32516/';

  /**
   * URL base para los archivos JSON relacionados con el proceso de levantar acta.
   * 
   * Ruta específica para los archivos JSON que contienen datos necesarios
   * para el procedimiento de levantamiento de actas del trámite 32516.
   * 
   * @type {string}
   * @constant
   * @default '/assets/json/32516/'
   */
  urlLevantar: string = '/assets/json/32516/';

  
  /**
   * Constructor del servicio CatalogosService.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del servicio,
   * específicamente el cliente HTTP utilizado para realizar solicitudes a los
   * archivos JSON de catálogos.
   * 
   * @constructor
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes HTTP.
   *                           Se inyecta automáticamente por el sistema de DI de Angular.
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // No es necesario instanciar manualmente el servicio
   * constructor(private catalogosService: CatalogosService) {}
   * ```
   */
  constructor(private readonly http: HttpClient) { }

  /**
   * Obtiene la lista de opciones de un menú desplegable desde un archivo JSON.
   * 
   * Este método realiza una solicitud HTTP GET para cargar las opciones de un
   * catálogo específico desde un archivo JSON ubicado en los assets de la aplicación.
   * Los datos son transformados para extraer únicamente la propiedad 'data' de la respuesta.
   * 
   * @method obtenerMenuDesplegable
   * @param {string} fileName - Nombre del archivo JSON que contiene las opciones del catálogo.
   *                           Debe incluir la extensión .json (ejemplo: 'opciones.json').
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos Catalogo
   *                                   con las opciones del menú desplegable.
   * 
   * @description Construye la URL completa concatenando la URL base con el nombre del archivo,
   *              realiza la petición HTTP y mapea la respuesta para extraer los datos.
   * 
   * @example
   * ```typescript
   * // Obtener opciones de un catálogo específico
   * this.catalogosService.obtenerMenuDesplegable('estados.json')
   *   .subscribe({
   *     next: (opciones) => {
   *       this.opcionesEstados = opciones;
   *     },
   *     error: (error) => {
   *       console.error('Error al cargar catálogo:', error);
   *     }
   *   });
   * ```
   * 
   * @throws {Error} Puede arrojar errores HTTP si el archivo no existe o hay problemas de conectividad.
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL = this.url + fileName;
    return this.http.get<Catalogo[]>(BASE_URL);
  }

  /**
   * Obtiene la lista de opciones de menú desplegable para el proceso de levantar acta.
   * 
   * Método especializado para cargar catálogos específicos del procedimiento de
   * levantamiento de actas. Utiliza la URL base configurada para este tipo de
   * archivos y transforma la respuesta para extraer los datos relevantes.
   * 
   * @method obtenerLevantarActaDesplegable
   * @param {string} fileName - Nombre del archivo JSON que contiene las opciones
   *                           específicas para levantar acta. Debe incluir la extensión .json.
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos Catalogo
   *                                   con las opciones específicas para el proceso de levantar acta.
   * 
   * @description Construye la URL utilizando la ruta específica para archivos de levantar acta,
   *              realiza la petición HTTP GET y mapea la respuesta para obtener solo los datos.
   * 
   * @example
   * ```typescript
   * // Obtener opciones específicas para levantar acta
   * this.catalogosService.obtenerLevantarActaDesplegable('tipos_acta.json')
   *   .subscribe({
   *     next: (tiposActa) => {
   *       this.opcionesTiposActa = tiposActa;
   *     },
   *     error: (error) => {
   *       console.error('Error al cargar tipos de acta:', error);
   *     }
   *   });
   * ```
   * 
   * @throws {Error} Puede arrojar errores HTTP si el archivo no existe o hay problemas de red.
   */
  obtenerLevantarActaDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL_LEVANTAR = this.urlLevantar + fileName;
    return this.http.get<RespuestaCatalogos>(BASE_URL_LEVANTAR).pipe(
      map(response => response.data)
    );
  }

  
  /**
   * Obtiene la lista de opciones de unidades de medida desde un archivo JSON.
   * 
   * Método específico para cargar catálogos de unidades de medida utilizados
   * en el trámite 32516. Utiliza la misma URL base que el proceso de levantar acta
   * y proporciona las opciones necesarias para campos relacionados con mediciones.
   * 
   * @method obtenerUnidadDesplegable
   * @param {string} fileName - Nombre del archivo JSON que contiene las unidades de medida.
   *                           Debe incluir la extensión .json (ejemplo: 'unidades_medida.json').
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos Catalogo
   *                                   con las opciones de unidades de medida disponibles.
   * 
   * @description Construye la URL utilizando la ruta configurada para archivos de unidades,
   *              ejecuta la petición HTTP GET y transforma la respuesta para extraer los datos.
   * 
   * @example
   * ```typescript
   * // Obtener unidades de medida disponibles
   * this.catalogosService.obtenerUnidadDesplegable('unidades.json')
   *   .subscribe({
   *     next: (unidades) => {
   *       this.opcionesUnidades = unidades;
   *       console.log('Unidades cargadas:', unidades);
   *     },
   *     error: (error) => {
   *       console.error('Error al cargar unidades de medida:', error);
   *     }
   *   });
   * ```
   * 
   * @throws {Error} Puede arrojar errores HTTP si el archivo no está disponible o hay problemas de conectividad.
   */
  obtenerUnidadDesplegable(fileName: string): Observable<Catalogo[]> {
    const BASE_URL_UNIDAD_MEDIDA = this.urlLevantar + fileName;
    return this.http.get<RespuestaCatalogos>(BASE_URL_UNIDAD_MEDIDA).pipe(
      map(response => response.data)
    );
  }

    /**
   * Opciones predefinidas para radio buttons de exención de pago.
   * 
   * Contiene las opciones estáticas utilizadas en componentes de radio button
   * para determinar si existe exención de pago en el trámite. Proporciona
   * opciones binarias con etiquetas descriptivas y valores booleanos.
   * 
   * @type {Array<{label: string, value: string}>}
   * @constant
   * @readonly
   * 
   * @property {Object[]} RadioOpcion - Arreglo de objetos con opciones de radio button.
   * @property {string} RadioOpcion[].label - Etiqueta visible al usuario ('Sí' o 'No').
   * @property {string} RadioOpcion[].value - Valor de la opción ('true' o 'false' como string).
   * 
   * @example
   * ```typescript
   * // Usar las opciones en un componente
   * export class MiComponente {
   *   opcionesExencion = this.catalogosService.RadioOpcion;
   * 
   *   // En el template
   *   // <mat-radio-group>
   *   //   <mat-radio-button 
   *   //     *ngFor="let opcion of opcionesExencion" 
   *   //     [value]="opcion.value">
   *   //     {{ opcion.label }}
   *   //   </mat-radio-button>
   *   // </mat-radio-group>
   * }
   * ```
   * 
   * @since 1.0.0
   */
    RadioOpcion = [
      { 
        /**
         * @property {string} label - Etiqueta para la opción afirmativa.
         */
        label: 'Sí', 
        
        /**
         * @property {string} value - Valor string que representa verdadero.
         */
        value: 'true' 
      },
      { 
        /**
         * @property {string} label - Etiqueta para la opción negativa.
         */
        label: 'No', 
        
        /**
         * @property {string} value - Valor string que representa falso.
         */
        value: 'false' 
      }
    ];
}
