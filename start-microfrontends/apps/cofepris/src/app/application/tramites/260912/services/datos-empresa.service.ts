import { DatosSociosTable, RepresentacionFederal } from '../modelos/datos-empresa.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones relacionadas con los datos de empresa.
 * 
 * Este servicio proporciona métodos para obtener información sobre socios, estados,
 * tipos de empresa y representación federal mediante archivos JSON estáticos.
 * Utiliza el patrón de inyección de dependencias de Angular para proveer
 * funcionalidades de acceso a datos de empresa.
 * 
 * @author [Nombre del desarrollador]
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```typescript
 * constructor(private datosEmpresaService: DatosEmpresaService) {}
 * 
 * ngOnInit() {
 *   this.datosEmpresaService.obtenerDatosTablaDeSocios().subscribe(socios => {
 *     this.listaSocios = socios;
 *   });
 * }
 * ```
 * 
 * @see {@link DatosSociosTable} Modelo de datos para socios
 * @see {@link RepresentacionFederal} Modelo de representación federal
 * @see {@link Catalogo} Modelo base para catálogos
 */
@Injectable({
  providedIn: 'root'
})  
export class DatosEmpresaService {

  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * 
   * Esta propiedad define la ruta base donde se encuentran almacenados
   * todos los archivos JSON que contienen los datos de empresa.
   * La ruta corresponde al directorio de assets específico para
   * el módulo de datos de empresa (120601).
   * 
   * @private
   * @readonly
   * @type {string}
   * @default '/assets/json/120601/'
   * @memberof DatosEmpresaService
   */
  private assetsJsonUrl = '/assets/json/120601/';

  /**
   * Constructor del servicio DatosEmpresaService.
   * 
   * Inicializa las dependencias necesarias para el funcionamiento del servicio.
   * El servicio utiliza HttpClient para realizar peticiones HTTP a los archivos
   * JSON que contienen los datos de empresa.
   * 
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar solicitudes HTTP a los archivos JSON
   * 
   * @memberof DatosEmpresaService
   * 
   * @example
   * ```typescript
   * // El constructor es llamado automáticamente por el inyector de dependencias de Angular
   * constructor(private datosEmpresaService: DatosEmpresaService) {
   *   // El servicio está listo para usar
   * }
   * ```
   */
  constructor(private http: HttpClient) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene los datos simulados para la tabla de socios de la empresa.
   * 
   * Este método realiza una petición HTTP GET para recuperar la información
   * de todos los socios asociados a la empresa. Los datos incluyen información
   * detallada de cada socio como nombres, participaciones, roles, etc.
   * 
   * @returns {Observable<DatosSociosTable[]>} Observable que emite un array con los datos de socios
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo o si ocurre un problema de red
   * @throws {Error} Error genérico si el formato de datos no es válido
   * 
   * @example
   * ```typescript
   * this.datosEmpresaService.obtenerDatosTablaDeSocios().subscribe({
   *   next: (socios) => {
   *     console.log('Datos de socios obtenidos:', socios);
   *     this.tablaSocios = socios;
   *     this.cargandoSocios = false;
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener datos de socios:', error);
   *     this.mostrarMensajeError('No se pudieron cargar los datos de socios');
   *   }
   * });
   * ```
   * 
   * @see {@link DatosSociosTable} Para más información sobre la estructura de datos de socios
   * @memberof DatosEmpresaService
   */
  obtenerDatosTablaDeSocios(): Observable<DatosSociosTable[]> {
    return this.http.get<DatosSociosTable[]>(`${this.assetsJsonUrl}datosSocios-table.json`);
  }

  /**
   * Obtiene el catálogo de tipos de empresa disponibles.
   * 
   * Este método recupera la lista de tipos de empresa que pueden ser utilizados
   * para clasificar o categorizar una empresa. A pesar del nombre del método,
   * internamente accede al archivo de tipos de empresa.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un array con los tipos de empresa disponibles
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo o si ocurre un problema de red
   * @throws {Error} Error genérico si el formato de datos no es válido
   * 
   * @example
   * ```typescript
   * this.datosEmpresaService.obtenerEstado().subscribe({
   *   next: (tiposEmpresa) => {
   *     console.log('Tipos de empresa obtenidos:', tiposEmpresa);
   *     this.listaTiposEmpresa = tiposEmpresa;
   *     this.cargarSelectTipoEmpresa();
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener tipos de empresa:', error);
   *   }
   * });
   * ```
   * 
   * @todo Considerar renombrar el método para que refleje mejor su funcionalidad (obtenerTiposEmpresa)
   * @see {@link Catalogo} Para más información sobre la estructura de catálogos
   * @memberof DatosEmpresaService
   */
  obtenerEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.assetsJsonUrl}tipoDeEmpresa.json`);
  }

  /**
   * Obtiene el catálogo de datos de representación federal.
   * 
   * Este método recupera la lista de opciones disponibles para la representación
   * federal de la empresa. Los datos incluyen información sobre diferentes tipos
   * de representación federal que puede tener una empresa.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un array con los datos de representación federal
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo o si ocurre un problema de red
   * @throws {Error} Error genérico si el formato de datos no es válido
   * 
   * @example
   * ```typescript
   * this.datosEmpresaService.obtenerDatosDeRepresentacionFederal().subscribe({
   *   next: (representaciones) => {
   *     console.log('Representaciones federales obtenidas:', representaciones);
   *     this.catalogoRepresentaciones = representaciones;
   *     this.inicializarFormulario();
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener representaciones federales:', error);
   *     this.manejarErrorCarga(error);
   *   }
   * });
   * ```
   * 
   * @see {@link Catalogo} Para más información sobre la estructura de catálogos
   * @memberof DatosEmpresaService
   */
  obtenerDatosDeRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.assetsJsonUrl}representacionFederal.json`);
  }

  /**
   * Obtiene los datos para la tabla de representación federal.
   * 
   * Este método recupera información detallada sobre las representaciones federales
   * en formato de tabla. Los datos incluyen información completa sobre cada
   * representación federal asociada a la empresa, incluyendo detalles específicos
   * y metadatos adicionales.
   * 
   * @returns {Observable<RepresentacionFederal[]>} Observable que emite un array con los datos detallados de representación federal
   * 
   * @throws {HttpErrorResponse} Error HTTP si no se puede acceder al archivo o si ocurre un problema de red
   * @throws {Error} Error genérico si el formato de datos no es válido
   * 
   * @example
   * ```typescript
   * this.datosEmpresaService.ObtenerTablaDeRepresentaciónFederal().subscribe({
   *   next: (tablaRepresentaciones) => {
   *     console.log('Tabla de representaciones obtenida:', tablaRepresentaciones);
   *     this.datosTablaRepresentacion = tablaRepresentaciones;
   *     this.configurarTabla();
   *   },
   *   error: (error) => {
   *     console.error('Error al obtener tabla de representaciones:', error);
   *     this.mostrarErrorTabla();
   *   }
   * });
   * ```
   * 
   * @see {@link RepresentacionFederal} Para más información sobre la estructura de datos de representación federal
   * @memberof DatosEmpresaService
   */
  ObtenerTablaDeRepresentaciónFederal(): Observable<RepresentacionFederal[]> {
    return this.http.get<RepresentacionFederal[]>(`${this.assetsJsonUrl}representacionFederal-table.json`);
  }
}