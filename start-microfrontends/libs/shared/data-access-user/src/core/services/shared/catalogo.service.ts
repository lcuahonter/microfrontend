
/**
 * @fileoverview Servicio centralizado para el manejo de catálogos del sistema VUCEM.
 * 
 * Este archivo contiene el servicio principal para la consulta y gestión de todos los catálogos
 * utilizados en el sistema VUCEM, incluyendo países, estados, medios de transporte, servicios IMMEX,
 * tratados comerciales y clasificaciones NICO.
 * 
 * @version 1.0.0
 * @since 1.0.0
 * @author Sistema VUCEM
 */
import {
  API_FRACCIONES_ARANCELARIAS,
  API_PEXIM_FRACCION_ARANCELARIA,
  API_UMT,
  CATALOGO_ACUERDOS,
  CATALOGO_ACUERDOS_PAIS,
  CATALOGO_ADUANAS,
  CATALOGO_ANOS,
  CATALOGO_BANCOS,
  CATALOGO_CLASIFICACION_PRODUCTO,
  CATALOGO_CODIGO,
  CATALOGO_COLONIAS,
  CATALOGO_ENTIDADES_FEDERATIVAS,
  CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO,
  CATALOGO_ESTADOS,
  CATALOGO_ESTADO_FISICO_MERCANCIA,
  CATALOGO_FORMA_FARMACEUTICA,
  CATALOGO_IDIOMA,
  CATALOGO_IMMEX,
  CATALOGO_LOCALIDADES,
  CATALOGO_MEDIO_TRANSPORTE,
  CATALOGO_MUNICIPIOS_DELEGACIONES,
  CATALOGO_NICO,
  CATALOGO_NOMBRE_PRODUCTO,
  CATALOGO_NOMBRE_SUBPRODUCTO,
  CATALOGO_PAISES,
  CATALOGO_PAISES_BLOQUE,
  CATALOGO_PAISES_DESTINO,
  CATALOGO_PAISES_MEXICO,
  CATALOGO_PAIS_BLOQUE_CLAVE,
  CATALOGO_REGIMENES,
  CATALOGO_REGIMEN_ENUM,
  CATALOGO_REPRESENTACION_FEDERAL,
  CATALOGO_SCIAN,
  CATALOGO_SECTORES,
  CATALOGO_SELECCIONAR_REGLA,
  CATALOGO_TIPOS_PRODUCTO,
  CATALOGO_TIPO_FACTURA,
  CATALOGO_TIPO_MECANISMO_ASIGNACION,
  CATALOGO_TRATADOS_ACUERDOS,
  CATALOGO_TRATADO_ACUERDO,
  CATALOGO_TRATADO_ACUERDOS,
  CATALOGO_TRATADO_ACUERDO_NEW,
  CATALOGO_TRATADO_ACUERDO_PAIS,
  CATALOGO_TRATADO_ACUERDO_PAIS_TITRAC,
  CATALOGO_UNIDAD_DE_MASA_BRUTA,
  CATALOGO_UNIDAD_MASA_BRUTA,
  CLASIFICACION,
  CLASIFICACION_REGIMEN,
  CLASSIFICACIONES_REGIMEN,
  COMUN_URL,
  FRACCIONES_ARANCELARIAS,
  FRACCION_HTS,
  OFICIO_ASIGNACION,
  PAISES_POR_BLOQUE,
  PAIS_DESTINO,
  REPRESENTACION_FEDERAL_CATALOGO,
  TIPO_EMPRESA,
  REGIMEN_CLASSIFICACIONES,
  UNIDADES_MEDIDA_COMERCIAL,
  API_UNIDADES_MEDIDA_TARIFARIA,
  API_CATALOGOS_PAISES_TODOS,
  API_MOSTRAR_PARTIDAS_SOLICITUD,
  UNIDADES_MEDIDA_CATALOGO,
  API_ACTIVIDAD_PRODUCTIVA_PROSEC,
  API_REPRESENTACION_FEDERAL_PARAM,
  API_UNIDADES_MEDIDAS_TARIFARIAS,
  API_FRACCIONES_ARANCELARIAS_AUTO_COMPLETE,
  API_ESTADO_UNIDADES_ADMINISTRATIVAS,
  CATALOGO_REPRESENTACION_FEDERAL_VECINA,
  REGIMEN_CLASSIFICACIONES_10,
  API_PEXIM_FRACCION_ARANCELARIA_10,
  API_UNIDADES_MEDIDA_TARIFARIA_10,
  CATALOGO_REPRESENTACION_FEDERAL_10,
  CATALOGO_UNIDAD_DE_MEDIDA,
  FRACCION_ARANCELARIA_DIVICIONES,
  CATALOGO_ESQUEMA_REGLA,
  API_GET_DEPENDENCIA,
  CATALOGO_REGIMENES_CLADIFICACION,
  AGREGAR_PRODUCTOR,
  JUNTAS_TECNICAS_CATALOGO,
  // API_PAISES_POR_BLOQUE
} from '../../servers/api-router';

// import { AGREGAR_PRODUCTOR, CATALOGO_ACUERDOS, CATALOGO_ACUERDOS_PAIS, CATALOGO_ADUANAS, CATALOGO_TRATADOS, CATALOGO_BANCOS, CATALOGO_CLASIFICACION_PRODUCTO, CATALOGO_COLONIAS, CATALOGO_ENTIDADES_FEDERATIVAS, CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO, CATALOGO_ESTADOS, CATALOGO_ESTADO_FISICO_MERCANCIA, CATALOGO_FORMA_FARMACEUTICA, CATALOGO_IDIOMA, CATALOGO_IMMEX, CATALOGO_LOCALIDADES, CATALOGO_MEDIO_TRANSPORTE, CATALOGO_MUNICIPIOS_DELEGACIONES, CATALOGO_NICO, CATALOGO_PAISES, CATALOGO_PAISES_BLOQUE, CATALOGO_PAISES_MEXICO, CATALOGO_PAIS_BLOQUE_CLAVE, CATALOGO_REGIMENES, CATALOGO_REPRESENTACION_FEDERAL, CATALOGO_SCIAN, CATALOGO_SECTORES, CATALOGO_SELECCIONAR_REGLA, CATALOGO_TIPOS_PRODUCTO, CATALOGO_TIPO_FACTURA, CATALOGO_TRATADOS_ACUERDOS, CATALOGO_TRATADO_ACUERDO, CATALOGO_TRATADO_ACUERDOS_PAIS, CATALOGO_TRATADO_ACUERDO_NEW, CATALOGO_TRATADO_ACUERDO_PAIS, CATALOGO_TRATADO_ACUERDO_PAIS_TITRAC, CATALOGO_UNIDAD_DE_MASA_BRUTA, CATALOGO_UNIDAD_MASA_BRUTA, COMUN_URL, UNIDADES_MEDIDA_COMERCIAL } from '../../servers/api-router';
// import { AGREGAR_PRODUCTOR, CATALOGO_ACUERDOS, CATALOGO_ACUERDOS_PAIS, CATALOGO_ADUANAS, CATALOGO_BANCOS, CATALOGO_CLASIFICACION_PRODUCTO, CATALOGO_COLONIAS, CATALOGO_ENTIDADES_FEDERATIVAS, CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO, CATALOGO_ESTADOS, CATALOGO_ESTADO_FISICO_MERCANCIA, CATALOGO_FORMA_FARMACEUTICA, CATALOGO_IDIOMA, CATALOGO_IMMEX, CATALOGO_LOCALIDADES, CATALOGO_MEDIO_TRANSPORTE, CATALOGO_MUNICIPIOS_DELEGACIONES, CATALOGO_NICO, CATALOGO_PAISES, CATALOGO_PAISES_BLOQUE, CATALOGO_PAISES_DESTINO, CATALOGO_PAIS_BLOQUE_CLAVE, CATALOGO_REGIMENES, CATALOGO_REPRESENTACION_FEDERAL, CATALOGO_SCIAN, CATALOGO_SECTORES, CATALOGO_SELECCIONAR_REGLA, CATALOGO_TIPOS_PRODUCTO, CATALOGO_TIPO_FACTURA, CATALOGO_TRATADOS_ACUERDOS, CATALOGO_TRATADO_ACUERDO, CATALOGO_TRATADO_ACUERDOS, CATALOGO_TRATADO_ACUERDO_NEW, CATALOGO_TRATADO_ACUERDO_PAIS, CATALOGO_TRATADO_ACUERDO_PAIS_TITRAC, CATALOGO_UNIDAD_DE_MASA_BRUTA, CLASIFICACION_REGIMEN, CATALOGO_UNIDAD_MASA_BRUTA, COMUN_URL, FRACCION_HTS, PAIS_DESTINO, UNIDADES_MEDIDA_COMERCIAL,CATALOGO_TRATADO_ACUERDOS_PAIS, CATALOGO_ANOS } from '../../servers/api-router';


import { BaseResponse } from '../../models/shared/base-response.model';
import { CATALOGO_USOS_ESPECIFICO_MERCANCIA } from '../../servers/api-router';
import { Catalogo } from '../../models/shared/catalogos.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MostrarPartidas } from '../../models/shared/mostrar-partidas';

/**
 * Servicio centralizado para la gestión de catálogos del sistema VUCEM.
 * 
 * Este servicio proporciona métodos para consultar diferentes tipos de catálogos
 * utilizados en los trámites del sistema, incluyendo:
 * - Catálogos geográficos (países, estados)
 * - Catálogos comerciales (tratados, acuerdos, medios de transporte)
 * - Catálogos especializados (IMMEX, NICO)
 * - Catálogos de clasificación y agrupación
 * 
 * Todos los métodos retornan Observables que emiten objetos BaseResponse
 * conteniendo arrays de elementos Catalogo, proporcionando una interfaz
 * consistente para el manejo de datos de catálogos.
 * 
 * @description
 * El servicio utiliza el patrón de inyección de dependencias de Angular
 * y está configurado como singleton ('root') para optimizar el uso de memoria
 * y mantener consistencia en toda la aplicación.
 * 
 * @example
 * ```typescript
 * // Inyección en un componente
 * constructor(private catalogoService: CatalogoServices) {}
 * 
 * // Uso básico para obtener países
 * this.catalogoService.paisesCatalogo('110219')
 *   .subscribe(response => {
 *     this.paises = response.datos;
 *   });
 * ```
 * 
 * @see BaseResponse
 * @see Catalogo
 * @see HttpClient
 * @since 1.0.0
 * @author Sistema VUCEM
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogoServices {
  /**
   * URL base del host para todas las consultas de catálogos.
   *
   * Esta propiedad almacena la URL base configurada desde las variables de entorno
   * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
   *
   * @type {string}
   * @readonly
   * @since 1.0.0
   */
  host: string;

  /**
   * Constructor del servicio de catálogos.
   *
   * Inicializa el servicio configurando la URL base del host desde las constantes
   * de configuración e inyectando el cliente HTTP necesario para realizar las
   * consultas a los diferentes endpoints de catálogos.
   *
   * @param http - Cliente HTTP de Angular para realizar peticiones a los servicios REST
   *
   * @example
   * ```typescript
   * // Angular maneja la inyección automáticamente
   * constructor(private catalogoService: CatalogoServices) {
   *   // El servicio está listo para usar
   * }
   * ```
   *
   * @see HttpClient
   * @see COMUN_URL.BASE_URL
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  constructor(private http: HttpClient) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene el catálogo de servicios IMMEX (Industria Manufacturera, Maquiladora y de Servicios de Exportación).
   *
   * Este método consulta el catálogo de servicios disponibles bajo el programa IMMEX,
   * que permite a las empresas importar temporalmente bienes para ser utilizados en
   * procesos productivos o de servicios destinados a la exportación, sin cubrir
   * el pago del impuesto general de importación.
   *
   * @param tramite - Identificador único del trámite (ej: '110219', '130118') que determina
   *                  el contexto y versión del catálogo IMMEX a consultar
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta del servidor
   *          conteniendo el array de servicios IMMEX disponibles
   *
   * @throws {HttpErrorResponse} Error HTTP si la consulta falla o el servicio no está disponible
   *
   * @example
   * ```typescript
   * this.catalogoServices.immexCatalogo('110219')
   *   .pipe(
   *     takeUntil(this.destroyed$),
   *     catchError(error => {
   *       console.error('Error al obtener catálogo IMMEX:', error);
   *       return of({ datos: [], exito: false });
   *     })
   *   )
   *   .subscribe(response => {
   *     if (response.exito) {
   *       this.serviciosIMMEX = response.datos;
   *     }
   *   });
   * ```
   *
   * @see CATALOGO_IMMEX
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  immexCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_IMMEX(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de estados de la República Mexicana.
   *
   * Este método consulta el catálogo oficial de entidades federativas (estados)
   * de México, incluyendo información como códigos oficiales, nombres completos
   * y datos administrativos relevantes para los trámites del sistema VUCEM.
   *
   * @param tramite - Identificador del trámite que determina la versión específica
   *                  del catálogo de estados a consultar
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta
   *          conteniendo el array completo de estados mexicanos
   *
   * @throws {HttpErrorResponse} Error HTTP en caso de falla en la comunicación con el servidor
   *
   * @example
   * ```typescript
   * // Cargar estados para un selector
   * this.catalogoServices.estadosCatalogo('110219')
   *   .subscribe(response => {
   *     this.estadosDisponibles = response.datos.map(estado => ({
   *       clave: estado.clave,
   *       nombre: estado.descripcion
   *     }));
   *   });
   *
   * this.catalogoServices.estadosCatalogo('130118')
   *   .pipe(
   *     map(response => response.datos.filter(estado => estado.activo))
   *   )
   *   .subscribe(estadosActivos => {
   *     this.catalogoEstados.catalogos = estadosActivos;
   *   });
   * ```
   *
   * @see CATALOGO_ESTADOS
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  estadosCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESTADOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo internacional de países.
   *
   * Este método consulta el catálogo oficial de países reconocidos internacionalmente,
   * incluyendo códigos ISO, nombres oficiales en español, y información relevante
   * para operaciones de comercio exterior y trámites aduaneros del sistema VUCEM.
   *
   * @param tramite - Identificador del trámite que especifica el contexto y versión
   *                  del catálogo de países a consultar
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta
   *          del servidor con el listado completo de países disponibles
   *
   * @throws {HttpErrorResponse} Error HTTP si hay problemas de conectividad o el servicio no responde
   *
   * @example
   * ```typescript
   * this.catalogoServices.paisesCatalogo('110219')
   *   .pipe(
   *     takeUntil(this.destroyed$)
   *   )
   *   .subscribe(response => {
   *     this.catalogoPaises.catalogos = response.datos;
   *     this.paisesDisponibles = true;
   *   });
   *
   * this.catalogoServices.paisesCatalogo('130118')
   *   .pipe(
   *     map(response => response.datos.filter(pais =>
   *       pais.descripcion.includes('América')
   *     ))
   *   )
   *   .subscribe(paisesAmerica => {
   *     this.paisesRegionales = paisesAmerica;
   *   });
   * ```
   *
   * @see CATALOGO_PAISES
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  paisesCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAISES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  /*
    * Obtiene el catálogo de países de destino para el trámite especificado.
    * @param {string} tramite - El ID del trámite.
    * @return {Observable<BaseResponse<Catalogo[]>>}
    * /
    */
  paisesDestinoCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAISES_DESTINO(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de códigos NICO (Nomenclatura de Designación y Codificación de Mercancías).
   *
   * Este método consulta el catálogo de códigos NICO asociados a una fracción arancelaria específica.
   * Los códigos NICO proporcionan una clasificación detallada de mercancías para efectos de
   * comercio exterior, complementando la información de las fracciones arancelarias con
   * especificaciones técnicas y comerciales más precisas.
   *
   * @param tramite - Identificador del trámite que determina el contexto de la consulta
   * @param claveFraccion - Código de la fracción arancelaria para la cual se requieren
   *                        los códigos NICO asociados (ej: '72162101')
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta
   *          conteniendo el array de códigos NICO específicos para la fracción
   *
   * @throws {HttpErrorResponse} Error HTTP si la fracción no existe o hay problemas de conectividad
   *
   * @example
   * ```typescript
   * this.catalogoServices.nicosCatalogo('110219', '72162101')
   *   .pipe(
   *     takeUntil(this.destroyed$),
   *     catchError(error => {
   *       this.mostrarError('No se encontraron códigos NICO para esta fracción');
   *       return of({ datos: [], exito: false });
   *     })
   *   )
   *   .subscribe(response => {
   *     if (response.exito && response.datos.length > 0) {
   *       this.codigosNICO = response.datos;
   *       this.habilitarSelectorNICO = true;
   *     } else {
   *       this.codigosNICO = [];
   *       this.habilitarSelectorNICO = false;
   *     }
   *   });
   *
   * this.fraccionControl.valueChanges
   *   .pipe(
   *     debounceTime(300),
   *     distinctUntilChanged(),
   *     switchMap(fraccion =>
   *       this.catalogoServices.nicosCatalogo('130118', fraccion)
   *     )
   *   )
   *   .subscribe(nicosResponse => {
   *     this.actualizarNICOsDisponibles(nicosResponse.datos);
   *   });
   * ```
   *
   * @see CATALOGO_NICO
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  nicosCatalogo(
    tramite: string,
    claveFraccion: string
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_NICO(tramite, claveFraccion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tratados y acuerdos según el trámite y el tipo de tratado/acuerdo especificados.
   *
   * @param tramite - Identificador del trámite para filtrar los datos del catálogo.
   * @param ideTipoTratadoAcuerdo - Identificador del tipo de tratado o acuerdo.
   * @returns Un observable que emite la respuesta base con el arreglo de elementos del catálogo.
   */
  tratadosAcuerdosCatalogoDatos(tramite: string, ideTipoTratadoAcuerdo: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDO(tramite, ideTipoTratadoAcuerdo)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
 * Obtiene el catálogo de tratados y acuerdos.
 * @param {string} tramite - El ID del trámite.
 * @param {string} ideTipoTratadoAcuerdo - El ID del tipo de tratado/acuerdo.
 * @returns {Observable<BaseResponse<Catalogo[]>>}
 */
  tratadosAcuerdosCatalogo(tramite: string, ideTipoTratadoAcuerdo: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADOS_ACUERDOS(tramite, ideTipoTratadoAcuerdo)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
  * Obtiene el catálogo de tratados y acuerdos.
  * @param {string} tramite - El ID del trámite.
  * @param {string} ideTipoTratadoAcuerdo - El ID del tipo de tratado/acuerdo.
  * @returns {Observable<BaseResponse<Catalogo[]>>}
  */
  tratadosAcuerdoCatalogo(tramite: string, ideTipoTratadoAcuerdo: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDOS(tramite, ideTipoTratadoAcuerdo)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de países destino según el trámite y los datos proporcionados.
   *
   * @param tramite - Identificador del trámite para el cual se solicita el catálogo.
   * @param payloadDatos - Objeto que contiene la clave del tratado (`cveTratado`) y la clave del país (`cvePais`).
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos de países destino.
   */
  paisDestinoCatalogo(tramite: string, payloadDatos: { cveTratado: string, cvePais: string, }): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${PAIS_DESTINO(tramite, payloadDatos)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }


  /**
   * Obtiene el catálogo de fracciones HTS basado en el trámite y los datos proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se solicita el catálogo.
   * @param payloadDatos - Objeto que contiene la clave del tratado (`cveTratado`) y la clave del país (`cvePais`).
   * @returns Un observable que emite la respuesta base con un arreglo de elementos del catálogo.
   */
  fraccionHtsCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${FRACCION_HTS(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
  * Obtiene el catálogo de fracciones arancelarias según el trámite e identificador proporcionado.
  *
  * Este método realiza una petición HTTP GET al servicio correspondiente para recuperar 
  * la lista de fracciones arancelarias disponibles.
  *
  * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la consulta.
  * @param {string} id - Identificador específico utilizado para filtrar las fracciones arancelarias.
  * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo de fracciones arancelarias.
  */
  fraccionesArancelariasCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_PEXIM_FRACCION_ARANCELARIA(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias según el trámite e identificador proporcionado.
   *
   * Este método realiza una petición HTTP GET al servicio correspondiente para recuperar 
   * la lista de fracciones arancelarias disponibles.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la consulta.
   * @param {string} id - Identificador específico utilizado para filtrar las fracciones arancelarias.
   * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo de fracciones arancelarias.
   */
  fraccionesArancelariasCatalogo10(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_PEXIM_FRACCION_ARANCELARIA_10(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
    * Obtiene el catálogo de unidades de medida tarifarias según el trámite e identificador proporcionado.
    *
    * Este método realiza una solicitud HTTP GET para recuperar las unidades de medida tarifarias 
    * asociadas al trámite indicado.
    *
    * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la consulta.
    * @param {string} id - Identificador específico utilizado para filtrar las unidades de medida tarifarias.
    * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo de unidades de medida tarifarias.
    */
  unidadesMedidaTarifariaCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_UNIDADES_MEDIDA_TARIFARIA(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de unidades de medida tarifarias según el trámite e identificador proporcionado.
   *
   * Este método realiza una solicitud HTTP GET para recuperar las unidades de medida tarifarias 
   * asociadas al trámite indicado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la consulta.
   * @param {string} id - Identificador específico utilizado para filtrar las unidades de medida tarifarias.
   * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo de unidades de medida tarifarias.
   */
  unidadesMedidaTarifariaCatalogo10(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_UNIDADES_MEDIDA_TARIFARIA_10(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   *  Obtiene el catálogo de unidades de medidas tarifarias según el trámite e identificador proporcionado.
   *
   * Este método realiza una solicitud HTTP GET para recuperar las unidades de medidas tarifarias 
   * asociadas al trámite indicado.
   * @param tramite 
   * @param id 
   * @returns 
   */
  unidadesMedidasTarifariasCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_UNIDADES_MEDIDAS_TARIFARIAS(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }



  /**
     * Obtiene el catálogo de bloques comerciales (tratados o acuerdos) relacionados con el trámite especificado.
     *
     * Este método realiza una solicitud HTTP GET para recuperar la lista de tratados o acuerdos 
     * comerciales disponibles para el trámite.
     *
     * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la consulta.
     * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo de bloques comerciales.
     */
  bloqueCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDOS(tramite, 'TITRAC.TA')}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene la información de las partidas asociadas a una solicitud específica.
   *
   * Este método realiza una petición HTTP GET al endpoint correspondiente para recuperar 
   * la lista de partidas registradas en la solicitud del trámite indicado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación asociado a la solicitud.
   * @param {number} solicitudId - Identificador único de la solicitud cuyas partidas se desean consultar.
   * @returns {Observable<BaseResponse<MostrarPartidas[]>>} Un observable que emite la respuesta base con la lista de partidas de la solicitud.
   */
  mostrarPartidasSolicitud(tramite: string, solicitudId: number): Observable<BaseResponse<MostrarPartidas[]>> {
    const ENDPOINT = `${this.host}${API_MOSTRAR_PARTIDAS_SOLICITUD(tramite, solicitudId)}`;
    return this.http.get<BaseResponse<MostrarPartidas[]>>(ENDPOINT);
  }
  /**
   * Obtiene el catálogo de clasificación de régimen según el trámite y los datos proporcionados.
   *
   * @param tramite - El identificador del trámite para el cual se solicita el catálogo.
   * @param payloadDatos - Objeto que contiene información adicional, incluyendo el trámite y el id requerido.
   * @returns Un observable que emite la respuesta base con el arreglo de elementos del catálogo.
   */
  clasificacionRegimenCatalogo(tramite: string, payloadDatos: { tramite: string, id: string }): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CLASIFICACION_REGIMEN(tramite, payloadDatos)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  /*
   * Obtiene el catálogo de clasificación de régimen según el trámite y la clave del régimen.
   * @param {string} tramite - El ID del trámite.
   * @param {string} cveRegimen - La clave del régimen.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  getClasificacionRegimen(tramite: string, cveRegimen: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CLASSIFICACIONES_REGIMEN(tramite).replace(CLASIFICACION, cveRegimen)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene la lista de clasificaciones de régimen para un trámite y clave de clasificación específicos.
   *
   * @param tramite - El identificador del trámite para el cual se solicitan las clasificaciones de régimen.
   * @param cveClasificacion - La clave de la clasificación que se desea consultar.
   * @returns Un observable que emite la respuesta base con un arreglo de objetos de tipo Catalogo.
   */
  getRegimenClasificacion(tramite: string, cveClasificacion: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${REGIMEN_CLASSIFICACIONES(tramite).replace(CLASIFICACION, cveClasificacion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene la lista de clasificaciones de régimen 10 para un trámite y clave de clasificación específicos.
   *
   * @param tramite - El identificador del trámite para el cual se solicita la clasificación.
   * @param cveClasificacion - La clave de la clasificación a consultar.
   * @returns Un observable que emite una respuesta base con un arreglo de objetos de tipo Catalogo.
   */
  getRegimenClasificacion10(tramite: string, cveClasificacion: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${REGIMEN_CLASSIFICACIONES_10(tramite).replace(CLASIFICACION, cveClasificacion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de países (bloques).
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  paisesBloqueCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAISES_BLOQUE(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de países (bloques).
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  obtenerProductoNuevo(body: any): Observable<BaseResponse<any>> {
    const ENDPOINT = `${this.host}${AGREGAR_PRODUCTOR()}`;
    return this.http.post<any>(ENDPOINT, { body: body });
  }

  /*
   * Obtiene el catálogo de entidades federativas.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  entidadesFederativasCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ENTIDADES_FEDERATIVAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de representación federal.
   * @param {string} tramite - El ID del trámite.
   * @param {string} cveEntidad - La clave de la entidad.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  representacionFederalCatalogo(tramite: string, cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REPRESENTACION_FEDERAL(tramite, cveEntidad)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
  * Obtiene el catálogo de representación federal.
  * @param {string} tramite - El ID del trámite.
  * @param {string} cveEntidad - La clave de la entidad.
  * @returns {Observable<BaseResponse<Catalogo[]>>}
  */
  representacionFederalCatalogo10(tramite: string, cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REPRESENTACION_FEDERAL_10(tramite, cveEntidad)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo completo de países disponibles para el trámite especificado.
   *
   * Este método realiza una solicitud HTTP GET al servicio correspondiente para recuperar 
   * la lista completa de países asociados al trámite.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación para el cual se consultan los países.
   * @returns {Observable<BaseResponse<Catalogo[]>>} Un observable que emite la respuesta base con el catálogo completo de países.
   */
  todosPaisesSeleccionados(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_CATALOGOS_PAISES_TODOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de tipos de factura.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  tipoFacturaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TIPO_FACTURA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de unidad de medida de la masa bruta.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  unidadMasaBrutaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_UNIDAD_MASA_BRUTA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }


  /*
   * Obtiene el catálogo de idiomas.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  catalogoIdioma(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_IDIOMA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de medios de transporte.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  catalogoMedioTransporte(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_MEDIO_TRANSPORTE(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de unidades de medida comercial.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   */
  unidadesMedidaComercialCatalogo(
    tramite: string
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${UNIDADES_MEDIDA_COMERCIAL(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de países organizados por bloques comerciales.
   *
   * Este método consulta el catálogo de países agrupados por bloques o regiones
   * comerciales (como TLCAN/T-MEC, Unión Europea, MERCOSUR, etc.), facilitando
   * la selección de países según los acuerdos comerciales vigentes y las
   * preferencias arancelarias aplicables.
   *
   * @param tramite - Identificador del trámite para el cual se requiere el catálogo
   *                  de países organizados por bloques comerciales
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta
   *          con el listado de países agrupados por bloques comerciales
   *
   * @throws {HttpErrorResponse} Error HTTP si el servicio no está disponible
   *
   * @example
   * ```typescript
   * this.catalogoServices.paisBloqueCatalogo('110219')
   *   .pipe(
   *     takeUntil(this.destroyed$)
   *   )
   *   .subscribe(response => {
   *     this.paisCatalogo.catalogos = response.datos;
   *     this.organizarPaisesPorBloque(response.datos);
   *   });
   *
   * this.catalogoServices.paisBloqueCatalogo('130118')
   *   .pipe(
   *     map(response => response.datos.filter(pais =>
   *       pais.grupo === 'TLCAN' || pais.grupo === 'T-MEC'
   *     ))
   *   )
   *   .subscribe(paisesNorteamerica => {
   *     this.paisesBloqueSeleccionado = paisesNorteamerica;
   *   });
   * ```
   *
   * @see CATALOGO_PAISES_BLOQUE
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  paisBloqueCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAISES_BLOQUE(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de medios de transporte disponibles para operaciones de comercio exterior.
   *
   * Este método consulta el catálogo oficial de medios de transporte utilizados
   * en operaciones de importación y exportación, incluyendo transporte marítimo,
   * aéreo, terrestre, ferroviario y otros medios especializados, con sus
   * características, restricciones y códigos oficiales.
   *
   * @param tramite - Identificador del trámite que determina los medios de transporte
   *                  aplicables y las regulaciones específicas
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta
   *          del servidor con el listado completo de medios de transporte disponibles
   *
   * @throws {HttpErrorResponse} Error HTTP si hay problemas de conectividad con el catálogo
   *
   * @example
   * ```typescript
   * this.catalogoServices.medioTransporteCatalogo('110219')
   *   .pipe(
   *     takeUntil(this.destroyed$)
   *   )
   *   .subscribe(response => {
   *     this.mediosTransporte = response.datos;
   *     this.habilitarSelectorTransporte = true;
   *   });
   *
   * this.catalogoServices.medioTransporteCatalogo('130118')
   *   .pipe(
   *     map(response => response.datos.filter(medio =>
   *       medio.tipo === 'MARITIMO' || medio.tipo === 'AEREO'
   *     ))
   *   )
   *   .subscribe(transporteInternacional => {
   *     this.mediosInternacionales = transporteInternacional;
   *   });
   *
   * this.origenControl.valueChanges
   *   .pipe(
   *     switchMap(origen =>
   *       this.catalogoServices.medioTransporteCatalogo('110219')
   *     ),
   *     map(response => this.filtrarPorOrigen(response.datos, this.origenControl.value))
   *   )
   *   .subscribe(mediosPermitidos => {
   *     this.actualizarOpcionesTransporte(mediosPermitidos);
   *   });
   * ```
   *
   * @see CATALOGO_MEDIO_TRANSPORTE
   * @see BaseResponse
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  medioTransporteCatalogo(
    tramite: string
  ): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_MEDIO_TRANSPORTE(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);

  }
  /*
* Obtiene el catálogo de seleccionarReglal ID del trámite.
* @param {string} tramite - El ID del trámite.
* @returns {Observable<BaseResponse<Catalogo[]>>} - Observable con la respuesta del servidor.
*/
  seleccionarReglaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_SELECCIONAR_REGLA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
   * Obtiene el catálogo de sectores ID del trámite.
   * @param {string} tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>} - Observable con la respuesta del servidor.
   */
  sectoresCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_SECTORES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /*
  * Obtiene el catálogo de unidades de masa bruta correspondiente al trámite proporcionado.
  * @param {string} tramite - El ID del trámite.
  * @returns {Observable<BaseResponse<Catalogo[]>>} - Observable con la respuesta del servidor que contiene el catálogo de unidades de masa bruta.
  */
  unidadDeMasaBrutaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_UNIDAD_DE_MASA_BRUTA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tratados y acuerdos internacionales aplicables a un país específico.
   * @param tramite - El ID del trámite.
   * @returns {Observable<BaseResponse<Catalogo[]>>} - Observable con la respuesta del servidor.
   */
  tratadoCatalogoPais(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDO_PAIS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de países aplicables a un trámite específico.
   * @param tramite - El ID del trámite.
   * @param clave - La clave del país.
   * @returns {Observable<BaseResponse<Catalogo[]>>} - Observable con la respuesta del servidor.
   */
  paisCatalogo(tramite: string, clave: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAIS_BLOQUE_CLAVE(tramite, clave)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos del catálogo de tratados o acuerdos para un trámite específico.
   * Recibe como parámetros el tipo de trámite y el ID del tipo de tratado/acuerdo.
   * Realiza una petición HTTP GET al endpoint correspondiente y devuelve un observable con la respuesta tipada como `BaseResponse<Catalogo[]>`.
   */
  tratadosAcuerdosCatalogoDatosNew(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDO_NEW(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
 * Obtiene la lista de países asociados a un tratado específico para un trámite determinado.
 * Recibe como parámetros el tipo de trámite y el ID del tratado.
 * Realiza una petición HTTP GET al endpoint correspondiente y devuelve un observable con la respuesta tipada como `BaseResponse<Catalogo[]>`.
 */
  getPaisesPorTratado(tramite: string, tratadoId: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ACUERDOS(tramite, tratadoId)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los tratados o acuerdos asociados a un país específico para un trámite determinado.
   * Recibe como parámetros el tipo de trámite y la clave del país.
   * Realiza una petición HTTP GET al endpoint correspondiente y devuelve un observable con la respuesta tipada como `BaseResponse<Catalogo[]>`.
   */
  getTratadosAcuerdosPorPais(tramite: string, cvePais: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ACUERDOS_PAIS(tramite, cvePais)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }


  /**
   * Obtiene el catálogo de clasificaciones SCIAN (Sistema de Clasificación Industrial de América del Norte).
   *
   * @param tramite - Identificador del trámite que determina el contexto del catálogo SCIAN
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de clasificaciones SCIAN
   * @see CATALOGO_SCIAN
   */
  scianCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_SCIAN(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de regímenes aduaneros.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de regímenes
   * @see CATALOGO_REGIMENES
   */
  regimenesCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REGIMENES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de regímenes aduaneros.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de regímenes
   * @see CATALOGO_REGIMENES_CLADIFICACION
   */
    clasificacionRegimenesCatalogo(tramite: string, regimenId: string): Observable<BaseResponse<Catalogo[]>> {
      const ENDPOINT = `${this.host}${CATALOGO_REGIMENES_CLADIFICACION(tramite, regimenId)}`;
      return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

  /**
   * Obtiene el catálogo de aduanas.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de aduanas
   * @see CATALOGO_ADUANAS
   */
  aduanasCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ADUANAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de clasificación del producto.
   *
   * @param tramite - Identificador del trámite
   * @param procedimiento - Identificador del procedimiento
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de clasificaciones de producto
   * @see CATALOGO_CLASIFICACION_PRODUCTO
   */
  clasificacionProductoCatalogo(tramite: string, procedimiento: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_CLASIFICACION_PRODUCTO(tramite, procedimiento)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo específico de clasificación del producto.
   *
   * @param tramite - Identificador del trámite
   * @param idClasificacion - Identificador de la clasificación específica
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado específico
   * @see CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO
   */
  especificarClasificacionProductoCatalogo(tramite: string, idClasificacion: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESPECIFICAR_CLASIFICACION_PRODUCTO(tramite, idClasificacion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tipos de producto por trámite.
   *
   * @param tramite - Identificador del trámite
   * @param procedimientoTipo - Identificador del tipo de procedimiento
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de tipos de producto
   * @see CATALOGO_TIPOS_PRODUCTO
   */
  tiposProductoCatalogo(tramite: string, procedimientoTipo: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TIPOS_PRODUCTO(tramite, procedimientoTipo)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de formas farmacéuticas.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de formas farmacéuticas
   * @see CATALOGO_FORMA_FARMACEUTICA
   */
  formaFarmaceuticaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_FORMA_FARMACEUTICA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de estados físicos de mercancía.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de estados físicos
   * @see CATALOGO_ESTADO_FISICO_MERCANCIA
   */
  estadoFisicoMercanciaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESTADO_FISICO_MERCANCIA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de municipios y delegaciones por entidad federativa.
   *
   * @param tramite - Identificador del trámite
   * @param cveEntidad - Clave de la entidad federativa
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de municipios/delegaciones
   * @see CATALOGO_MUNICIPIOS_DELEGACIONES
   */
  municipiosDelegacionesCatalogo(tramite: string, cveEntidad: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_MUNICIPIOS_DELEGACIONES(tramite, cveEntidad)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de localidades por municipio.
   *
   * @param tramite - Identificador del trámite
   * @param cveMunicipio - Clave del municipio
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de localidades
   * @see CATALOGO_LOCALIDADES
   */
  localidadesCatalogo(tramite: string, cveMunicipio: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_LOCALIDADES(tramite, cveMunicipio)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de colonias por municipio/delegación.
   *
   * @param tramite - Identificador del trámite
   * @param cveMunicipioDelegacion - Clave del municipio o delegación
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de colonias
   * @see CATALOGO_COLONIAS
   */
  coloniasCatalogo(tramite: string, cveMunicipioDelegacion: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_COLONIAS(tramite, cveMunicipioDelegacion)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de bancos.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de bancos
   * @see CATALOGO_BANCOS
   */
  bancosCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_BANCOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de bancos.
   *
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de bancos
   * @see CATALOGO_BANCOS
   */
  codigoCatalogo(tramite: string, cveMunicipio: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_CODIGO(tramite, cveMunicipio)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  /**
   * Obtiene el catálogo de años disponibles.
   *  
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de años
   * @see CATALOGO_ANOS
   */

  anosCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ANOS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de países de México según el trámite especificado.
   *
   * @param tramite - El identificador del trámite para el cual se requiere el catálogo de países.
   * @returns Un observable que emite la respuesta base con el listado de países en el catálogo.
   */
  paisesMaxicoCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_PAISES_MEXICO(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);

  }




  /**
   * Obtiene el catálogo de usos específico de mercancía.
   * 
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de usos específicos de mercancía
   * @see CATALOGO_USOS_ESPECIFICO_MERCANCIA
   */
  usosEspecificoMercanciaCatalogo(tramite: string, procedimiento: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_USOS_ESPECIFICO_MERCANCIA(tramite, procedimiento)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de fracciones arancelarias
   * @see API_FRACCIONES_ARANCELARIAS
   */
  getFraccionesCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_FRACCIONES_ARANCELARIAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de fracciones arancelarias
   * @see API_FRACCIONES_ARANCELARIAS
   */
  getFracciones(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${FRACCIONES_ARANCELARIAS(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de Unidades de Medida de Transporte de Carga (UMT) según el trámite y régimen especificados.
   * @param tramite - Identificador del trámite
   * @param cveRegimen - Clave del régimen aduanero
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de UMT
   * @see API_UMT
   */

  getUMTCatalogo(tramite: string, cveRegimen: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_UMT(tramite).replace(CLASIFICACION, cveRegimen)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de países por bloque comercial según el trámite especificado.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de países por bloque comercial
   * @see PAISES_POR_BLOQUE
   */
  getpaisesBloqueCatalogo(tramite: string, claveBloque: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${PAISES_POR_BLOQUE(tramite, claveBloque)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de Actividad Productiva PROSEC asociado al trámite indicado.
   *
   * Este método construye dinámicamente el endpoint correspondiente y realiza una
   * solicitud HTTP GET para obtener un catálogo de opciones relacionado con la
   * actividad productiva del trámite PROSEC.
   *
   * @param {string} tramite - Identificador del trámite utilizado para armar la ruta del servicio.
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   *          Observable que emite la respuesta del servicio con la lista de elementos del catálogo.
   */
  getActividadProductivaProsecCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_ACTIVIDAD_PRODUCTIVA_PROSEC(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de Representación Federal de México filtrado por trámite y estado.
   *
   * Este método construye la URL del servicio utilizando los parámetros recibidos
   * y realiza una solicitud HTTP GET para recuperar la lista correspondiente.
   *
   * @param {string} tramite - Identificador del trámite requerido por el servicio.
   * @param {string} estado - Clave del estado que se utilizará como parámetro del catálogo.
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   *          Observable que emite la respuesta con el catálogo solicitado.
   */
  getRepresentacionFederalMexCatalogo(tramite: string, estado: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_REPRESENTACION_FEDERAL_PARAM(tramite, estado)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de fracciones arancelarias mediante una búsqueda tipo
   * autocompletado, basada en el trámite e identificador proporcionados.
   *
   * La URL se construye usando parámetros dinámicos y se realiza una petición
   * HTTP GET para obtener un catálogo filtrado de fracciones arancelarias.
   *
   * @param {string} tramite - Identificador del trámite usado para generar la ruta.
   * @param {string} id - Parámetro de búsqueda para autocompletar fracciones arancelarias.
   *
   * @returns {Observable<BaseResponse<Catalogo[]>>}
   *          Observable con la respuesta del servicio que contiene la lista de fracciones.
   */
  getFraccionesArancelariasAutoCompleteCatalogo(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_FRACCIONES_ARANCELARIAS_AUTO_COMPLETE(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }




  /**
   * Obtiene el catálogo tipo de empresa.
   * 
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de tipos de empresa
   * @see CATALOGO_TIPO_EMPRESA
   */
  obtenerTipoEmpresaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${TIPO_EMPRESA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);

  }

  /**
   * Obtiene el catálogo de regímenes aduaneros enumerados según el trámite especificado.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de regímenes enumerados
   * @see CATALOGO_REGIMEN_ENUM
  */
  regimenEnumCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REGIMEN_ENUM(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de tipos de mecanismo de asignación según el trámite especificado.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de tipos de mecanismo de asignación
   * @see CATALOGO_TIPO_MECANISMO_ASIGNACION
   */
  tipoMecanismoAsignacionCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TIPO_MECANISMO_ASIGNACION(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de nombres de producto según el trámite especificado.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de nombres de producto
   * @see CATALOGO_NOMBRE_PRODUCTO
   */
  nombreProductoCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_NOMBRE_PRODUCTO(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de nombres de subproducto según el trámite especificado.
   * @param tramite - Identificador del trámite
   * @returns {Observable<BaseResponse<Catalogo[]>>} Observable que emite la respuesta con el listado de nombres de subproducto
   * @see CATALOGO_NOMBRE_SUBPRODUCTO
   */
  nombreSubproductoCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_NOMBRE_SUBPRODUCTO(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }
  /**
   * Obtiene el catálogo de tratados y acuerdos (TITRAC) para un trámite específico.
   * @param tramite Identificador del trámite para el cual se requiere el catálogo TITRAC.
   * @returns Observable que emite la respuesta base con el arreglo de elementos del catálogo TITRAC.
   */
  tratadoAcuerdoPaisTitracCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_TRATADO_ACUERDO_PAIS_TITRAC(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de representación federal para un trámite específico.
   * @param tramite Identificador del trámite para el cual se requiere el catálogo de representación federal.
   * @returns Observable que emite la respuesta base con el arreglo de elementos del catálogo de representación federal.
   */
  catalogoRepresentacionFederal(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${REPRESENTACION_FEDERAL_CATALOGO(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene el catálogo de asignación para un trámite específico.
   *
   * @param tramite - Identificador del trámite para el cual se solicita el catálogo de asignación.
   * @returns Un observable que emite la respuesta base con el arreglo de catálogos asociados al trámite.
   */
  asignacionCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${OFICIO_ASIGNACION(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);

  }

  /**
   * @description Obtiene el catálogo de estados de unidades administrativas.
   * @param tramite Trámite a consultar.
   * @param id Identificador relacionado.
   * @returns Observable con la lista de catálogo.
   */
  catalogoEstadoUnidadesAdministrativas(tramite: string, id: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_ESTADO_UNIDADES_ADMINISTRATIVAS(tramite, id)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * @description Obtiene el catálogo de representación federal vecina.
   * @param tramite Trámite a consultar.
   * @param claveEstado Clave del estado relacionado.
   * @returns Observable con la lista de catálogo.
   */
  catalogoRepresentacionFederalVecina(tramite: string, claveEstado: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_REPRESENTACION_FEDERAL_VECINA(tramite, claveEstado)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * @description Obtiene el catálogo de unidad de medida.
   * @param tramite Trámite a consultar.
   * @returns Observable con la lista de catálogo.
   */
  catalogoUnidadMedida(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_UNIDAD_DE_MEDIDA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * @description Obtiene el catálogo de fracción arancelaria divisiones.
   * @param tramite Trámite a consultar.
   * @returns Observable con la lista de catálogo.
   */
  catalogoFraccionDivisiones(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${FRACCION_ARANCELARIA_DIVICIONES(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  catalogoEsquemaRegla(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${CATALOGO_ESQUEMA_REGLA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  catalogoUnidadesMedida(tramite: string): Observable<BaseResponse<Catalogo[]>> {
  const ENDPOINT = `${this.host}${UNIDADES_MEDIDA_CATALOGO(tramite)}`;
  return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
}

 dependenciaCatalogo(tramite: string): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_DEPENDENCIA(tramite)}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  catalogojuntasTecnicas(tramite: string): Observable<BaseResponse<Catalogo[]>> {
  const ENDPOINT = `${this.host}${JUNTAS_TECNICAS_CATALOGO(tramite)}`;
  return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
}

}