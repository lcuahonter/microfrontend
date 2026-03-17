/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-empty-function */
/**
 * @Injectable
 * @description Servicio para obtener los datos del menú desplegable de NICO.
 */
import { Catalogo } from '@ng-mf/data-access-user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@ng-mf/data-access-user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NicoService {
  /**
   * @property {string} url
   * @description URL base para los archivos JSON que contienen los datos del menú desplegable.
   */
  url: string = '/assets/json/80202/';

  /**
   * @constructor
   * @description Constructor que inicializa el cliente HTTP para realizar solicitudes.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private readonly http: HttpClient) { }
  /**
   * @constructor
   * @description Constructor del servicio NicoService que inicializa las dependencias necesarias
   * para el funcionamiento del servicio. Recibe por inyección de dependencias el cliente HTTP
   * de Angular que será utilizado para realizar las peticiones a los archivos JSON estáticos.
   * 
   * El constructor utiliza el modificador 'private readonly' para asegurar que la instancia
   * de HttpClient sea inmutable y solo accesible dentro de la clase, siguiendo las mejores
   * prácticas de encapsulación en TypeScript y Angular.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular inyectado automáticamente por el
   *   sistema de inyección de dependencias. Se utiliza para realizar peticiones GET
   *   a los archivos JSON que contienen los datos de los catálogos NICO.
   * 
   * @memberof NicoService
   * @public
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por Angular
   * // No es necesario instanciar manualmente el servicio
   * // Angular se encarga de la inyección de dependencias
   * 
   * // En un componente:
   * constructor(private nicoService: NicoService) {
   *   // El servicio ya está listo para usar
   * }
   * ```
   * 
   * @see {@link HttpClient} - Cliente HTTP de Angular para realizar peticiones

  /**
   * @method obtenerMenuDesplegable
   * @description Método principal del servicio que obtiene y procesa los datos de catálogos NICO
   * desde archivos JSON estáticos. Realiza una petición HTTP GET al archivo especificado,
   * procesa la respuesta y extrae únicamente los datos del catálogo mediante el operador map de RxJS.
   * 
   * Este método encapsula toda la lógica de obtención y transformación de datos, proporcionando
   * una interfaz limpia para los componentes que necesiten acceder a información de códigos NICO.
   * La respuesta se transforma automáticamente de RespuestaCatalogos a un array de Catalogo,
   * extrayendo solo la propiedad 'data' que contiene la información relevante.
   * 
   * @param {string} fileName - Nombre del archivo JSON que contiene los datos del catálogo NICO.
   *   Debe incluir la extensión .json y corresponder a un archivo existente en la ruta configurada.
   *   Ejemplos de nombres válidos: 'catalogo-nico.json', 'codigos-operacion.json'
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un array de objetos Catalogo
   *   conteniendo los datos del menú desplegable. Cada elemento del array representa
   *   una opción disponible en el catálogo NICO con su respectiva información de código,
   *   descripción y metadatos asociados.
   * 
   * @memberof NicoService
   * @public
   * 
   * @example
   * ```typescript
   * // Obtener catálogo de códigos NICO básico
   * this.nicoService.obtenerMenuDesplegable('catalogo-nico.json')
   *   .subscribe({
   *     next: (catalogos) => {
   *       console.log('Catálogos obtenidos:', catalogos);
   *       // Procesar los datos del catálogo
   *       this.opcionesMenu = catalogos;
   *     },
   *     error: (error) => {
   *       console.error('Error al obtener catálogo:', error);
   *     }
   *   });
   * ```
   * 
   * @example
   * ```typescript
   * // Usar con async/await
   * async cargarCatalogos() {
   *   try {
   *     const catalogos = await this.nicoService
   *       .obtenerMenuDesplegable('codigos-operacion.json')
   *       .toPromise();
   *     this.procesarCatalogos(catalogos);
   *   } catch (error) {
   *     this.manejarError(error);
   *   }
   * }
   * ```
   * 
   * @throws {HttpErrorResponse} Puede lanzar errores HTTP si el archivo no existe,
   *   no es accesible, o hay problemas de conectividad. Los errores deben ser
   *   manejados apropiadamente por el código que consume este método.
   * 
   * @see {@link Catalogo} - Interfaz que define la estructura de cada elemento del catálogo
   * @see {@link RespuestaCatalogos} - Interfaz de la respuesta completa del servidor
   * @see {@link HttpClient.get} - Método HTTP GET utilizado internamente
   * @see {@link Observable} - Tipo de retorno reactivo para manejo asíncrono
   */
  obtenerMenuDesplegable(fileName: string): Observable<Catalogo[]> {
    const baseUrl = this.url + fileName;
    return this.http.get<RespuestaCatalogos>(baseUrl).pipe(
      map(response => response.data)
    );
  }
}
