/**
 * @fileoverview Servicio principal para gestión de solicitudes del trámite 80302
 * @description Este archivo contiene el servicio Angular que maneja todas las operaciones
 * relacionadas con las solicitudes del trámite 80302 (modificaciones al programa IMMEX)
 * en el sistema VUCEM, incluyendo consultas, actualizaciones y guardado de datos
 * @author Sistema VUCEM
 * @version 1.0.0
 * @since 2024
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Anexo, Complimentaria, Federetarios, GuardarSolicitudPayload, Operacions, PlantasResponse, SolicitudPayload } from '../estados/models/plantas-consulta.model';
import { HttpCoreService,JSONResponse } from '@ng-mf/data-access-user';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Params, Programa, SocioAccionistaPayload } from '../estados/models/payload.model';
import { DatosDelModificacion } from '../estados/models/datos-tramite.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80302 } from '../servers/api-route';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Solicitud80302State } from '../../../estados/tramites/tramite80302.store';
import { Tramite80302Query } from '../../../estados/queries/tramite80302.query';

/**
 * Servicio principal para gestión de solicitudes del trámite 80302
 * @service SolicitudService
 * @description Servicio Angular que centraliza todas las operaciones relacionadas
 * con las solicitudes del trámite 80302 para modificaciones al programa IMMEX.
 * Proporciona métodos para consultar datos desde archivos JSON locales y APIs remotas,
 * gestionar actualizaciones de plantas, socios, anexos, operaciones y bitácora
 * @injectable
 * @example
 * ```typescript
 * constructor(private solicitudService: SolicitudService) {}
 * 
 * // Obtener datos del solicitante
 * this.solicitudService.getDatosSolicitante().subscribe(datos => {
 *   console.log('Datos del solicitante:', datos);
 * });
 * 
 * // Buscar plantas
 * const programa = { rfc: 'ABC123', idPrograma: '12345' };
 * this.solicitudService.obtenerListaDomicilios(programa).subscribe(plantas => {
 *   console.log('Plantas encontradas:', plantas);
 * });
 * ```
 * @see {@link PROC_80302} Para las rutas de API utilizadas
 * @see {@link Tramite80302Query} Para consultas de estado reactivas
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
  /**
   * Constructor del servicio de solicitudes del trámite 80302
   * @constructor
   * @description Inicializa el servicio con las dependencias necesarias para
   * realizar operaciones HTTP tanto a archivos locales como a APIs remotas,
   * así como para acceso a consultas reactivas del estado del trámite
   * @param {HttpClient} http - Cliente HTTP de Angular para realizar peticiones
   * @param {HttpCoreService} httpService - Servicio HTTP core personalizado para operaciones avanzadas
   * @param {Tramite80302Query} Tramite80302Query - Query de Akita para consultas reactivas del estado
   */
  constructor(private http: HttpClient, 
    public httpService: HttpCoreService,
    private Tramite80302Query: Tramite80302Query
  ) {}

  /**
   * Obtiene los datos del solicitante desde archivo JSON local
   * @method getDatosSolicitante
   * @description Consulta los datos básicos del solicitante desde un archivo
   * JSON local ubicado en los assets del proyecto
   * @returns {Observable<RespuestaCatalogos[]>} Observable con la información del solicitante
   * @example
   * ```typescript
   * this.solicitudService.getDatosSolicitante().subscribe(datos => {
   *   console.log('Datos del solicitante:', datos);
   * });
   * ```
   * @see {@link RespuestaCatalogos} Para la estructura de datos de respuesta
   * @public
   */
  getDatosSolicitante(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80302/datosSolicitante.json`
    );
  }

  /**
   * Obtiene los datos de modificación desde archivo JSON local
   * @method getDatosModificacion
   * @description Consulta los datos de modificación del programa IMMEX desde
   * un archivo JSON local ubicado en los assets del proyecto
   * @returns {Observable<RespuestaCatalogos[]>} Observable con los datos de modificación
   * @example
   * ```typescript
   * this.solicitudService.getDatosModificacion().subscribe(datos => {
   *   console.log('Datos de modificación:', datos);
   * });
   * ```
   * @see {@link RespuestaCatalogos} Para la estructura de datos de respuesta
   * @public
   */
  getDatosModificacion(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80302/modificacion.json`
    );
  }

  /**
   * Obtiene datos de modificación (método alternativo)
   * @method getModificacion
   * @description Método alternativo para obtener datos de modificación
   * desde el mismo archivo JSON local
   * @returns {Observable<RespuestaCatalogos[]>} Observable con los datos de modificación
   * @example
   * ```typescript
   * this.solicitudService.getModificacion().subscribe(datos => {
   *   console.log('Modificación:', datos);
   * });
   * ```
   * @see {@link getDatosModificacion} Para el método principal de modificación
   * @public
   */
  getModificacion(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80302/modificacion.json`
    );
  }

  /**
   * Obtiene los datos de la tabla desde archivo JSON local
   * @method getDatosTableData
   * @description Consulta los datos para poblar tablas dinámicas desde
   * un archivo JSON local con información de modificaciones del trámite
   * @returns {Observable<DatosDelModificacion[]>} Observable con los datos de la tabla
   * @example
   * ```typescript
   * this.solicitudService.getDatosTableData().subscribe(datos => {
   *   console.log('Datos de tabla:', datos);
   * });
   * ```
   * @see {@link DatosDelModificacion} Para la estructura de datos de tabla
   * @public
   */
  getDatosTableData(): Observable<DatosDelModificacion[]> {
    return this.http.get<DatosDelModificacion[]>(
      `assets/json/80302/datosTabla.json`
    );
  }

  /**
   * Obtiene la lista de datos complementarios desde archivo JSON local
   * @method obtenerComplimentaria
   * @description Consulta los datos complementarios de socios y accionistas
   * desde un archivo JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Complimentaria[]>} Observable con los datos complementarios
   * @example
   * ```typescript
   * this.solicitudService.obtenerComplimentaria().subscribe(datos => {
   *   console.log('Datos complementarios:', datos);
   * });
   * ```
   * @see {@link Complimentaria} Para la estructura de datos complementarios
   * @public
   */
  obtenerComplimentaria(): Observable<Complimentaria[]> {
    return this.http
      .get<Complimentaria[]>('assets/json/80302/complimentaria.json').pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene la lista de anexos desde archivo JSON local
   * @method obtenerAnexo
   * @description Consulta los anexos de productos de exportación e importación
   * desde un archivo JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Anexo[]>} Observable con la información de anexos
   * @example
   * ```typescript
   * this.solicitudService.obtenerAnexo().subscribe(anexos => {
   *   console.log('Anexos:', anexos);
   * });
   * ```
   * @see {@link Anexo} Para la estructura de datos de anexos
   * @public
   */
  obtenerAnexo(): Observable<Anexo[]> {
    return this.http
      .get<Anexo[]>('assets/json/80302/anexo.json').pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene la lista de notarios federales desde archivo JSON local
   * @method obtenerFederetarios
   * @description Consulta la información de notarios federales autorizados
   * desde un archivo JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Federetarios[]>} Observable con los datos de notarios federales
   * @example
   * ```typescript
   * this.solicitudService.obtenerFederetarios().subscribe(notarios => {
   *   console.log('Notarios federales:', notarios);
   * });
   * ```
   * @see {@link Federetarios} Para la estructura de datos de notarios
   * @public
   */
  obtenerFederetarios(): Observable<Federetarios[]> {
    return this.http
      .get<Federetarios[]>('assets/json/80302/federetarios.json').pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene la lista de operaciones IMMEX desde archivo JSON local
   * @method obtenerOperacion
   * @description Consulta las operaciones del programa IMMEX desde un archivo
   * JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Operacions[]>} Observable con las operaciones IMMEX
   * @example
   * ```typescript
   * this.solicitudService.obtenerOperacion().subscribe(operaciones => {
   *   console.log('Operaciones IMMEX:', operaciones);
   * });
   * ```
   * @see {@link Operacions} Para la estructura de datos de operaciones
   * @public
   */
  obtenerOperacion(): Observable<Operacions[]> {
    return this.http
      .get<Operacions[]>('assets/json/80302/operacion.json').pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene los datos completos del trámite desde archivo JSON local
   * @method obtenerTramiteDatos
   * @description Consulta los datos principales del trámite 80302 desde un archivo
   * JSON local, retornando un objeto parcial del estado del trámite
   * @returns {Observable<Partial<Solicitud80302State>>} Observable con datos parciales del estado del trámite
   * @example
   * ```typescript
   * this.solicitudService.obtenerTramiteDatos().subscribe(datos => {
   *   console.log('Datos del trámite:', datos);
   * });
   * ```
   * @see {@link Solicitud80302State} Para la estructura completa del estado
   * @public
   */
  obtenerTramiteDatos(): Observable<Partial<Solicitud80302State>> {
    return this.http
      .get<Partial<Solicitud80302State>>('assets/json/80302/tramite_datos.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene la lista de plantas desde archivo JSON local
   * @method obtenerPlanta
   * @description Consulta la información de plantas del programa IMMEX desde
   * un archivo JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Operacions[]>} Observable con los datos de plantas
   * @example
   * ```typescript
   * this.solicitudService.obtenerPlanta().subscribe(plantas => {
   *   console.log('Plantas:', plantas);
   * });
   * ```
   * @see {@link Operacions} Para la estructura de datos de plantas
   * @public
   */
  obtenerPlanta(): Observable<Operacions[]> {
    return this.http
      .get<{data: Operacions[]}>('assets/json/80302/planta.json').pipe(map((res: {data: Operacions[]}) => res.data));
  }

  /**
   * Obtiene la lista de servicios desde archivo JSON local
   * @method obtenerServicios
   * @description Consulta los servicios disponibles del programa IMMEX desde
   * un archivo JSON local, extrayendo la propiedad 'data' de la respuesta
   * @returns {Observable<Operacions[]>} Observable con la información de servicios
   * @example
   * ```typescript
   * this.solicitudService.obtenerServicios().subscribe(servicios => {
   *   console.log('Servicios:', servicios);
   * });
   * ```
   * @see {@link Operacions} Para la estructura de datos de servicios
   * @public
   */
  obtenerServicios(): Observable<Operacions[]> {
    return this.http
      .get<{data: Operacions[]}>('assets/json/80302/servicios.json').pipe(map((res: {data: Operacions[]}) => res.data));
  }

  /**
   * Busca información de socios y accionistas en el servidor remoto
   * @method obtenerBuscarSocioAccionista
   * @description Realiza una consulta al servidor para buscar información
   * detallada de socios y accionistas del programa IMMEX basada en los
   * parámetros proporcionados
   * @param {SocioAccionistaPayload} body - Parámetros de búsqueda de socios y accionistas
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456', idPrograma: '12345' };
   * this.solicitudService.obtenerBuscarSocioAccionista(parametros).subscribe(
   *   respuesta => console.log('Socios encontrados:', respuesta),
   *   error => console.error('Error en búsqueda:', error)
   * );
   * ```
   * @see {@link SocioAccionistaPayload} Para la estructura de parámetros
   * @see {@link PROC_80302.BUSCAR_SOCIO_ACCIONISTA} Para la ruta de API
   * @public
   */
  obtenerBuscarSocioAccionista(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80302.BUSCAR_SOCIO_ACCIONISTA, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.BUSCAR_SOCIO_ACCIONISTA}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Busca información de notarios en el servidor remoto
   * @method obtenerBuscarNotarios
   * @description Realiza una consulta al servidor para buscar información
   * de notarios federales autorizados basada en los parámetros proporcionados
   * @param {SocioAccionistaPayload} body - Parámetros de búsqueda de notarios
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456', estado: 'CDMX' };
   * this.solicitudService.obtenerBuscarNotarios(parametros).subscribe(
   *   respuesta => console.log('Notarios encontrados:', respuesta),
   *   error => console.error('Error en búsqueda:', error)
   * );
   * ```
   * @see {@link SocioAccionistaPayload} Para la estructura de parámetros
   * @see {@link PROC_80302.BUSCAR_NOTARIOS} Para la ruta de API
   * @public
   */
  obtenerBuscarNotarios(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80302.BUSCAR_NOTARIOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.BUSCAR_NOTARIOS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene información de operaciones IMMEX del servidor remoto
   * @method obtenerOperacionImmex
   * @description Consulta las operaciones específicas del programa IMMEX
   * desde el servidor, incluyendo detalles de producción y exportación
   * @param {SocioAccionistaPayload} body - Parámetros de consulta de operaciones IMMEX
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456', idPrograma: '12345' };
   * this.solicitudService.obtenerOperacionImmex(parametros).subscribe(
   *   respuesta => console.log('Operaciones IMMEX:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link SocioAccionistaPayload} Para la estructura de parámetros
   * @see {@link PROC_80302.OPERACION_IMMEX} Para la ruta de API
   * @public
   */
  obtenerOperacionImmex(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80302.OPERACION_IMMEX, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.OPERACION_IMMEX}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de productos de exportación del servidor remoto
   * @method obtenerAnexoExportacion
   * @description Consulta los productos destinados a exportación del programa IMMEX
   * desde el servidor remoto utilizando parámetros de consulta específicos
   * @param {Params} queryParams - Parámetros de consulta para filtrar productos de exportación
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456', tipoProducto: 'exportacion' };
   * this.solicitudService.obtenerAnexoExportacion(parametros).subscribe(
   *   respuesta => console.log('Productos de exportación:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link Params} Para la estructura de parámetros de consulta
   * @see {@link PROC_80302.ANEXO_EXPORTACION} Para la ruta de API
   * @public
   */
  obtenerAnexoExportacion(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.ANEXO_EXPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.ANEXO_EXPORTACION}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de productos de importación del servidor remoto
   * @method obtenerAnexoImportacion
   * @description Consulta los productos destinados a importación del programa IMMEX
   * desde el servidor remoto utilizando parámetros de consulta específicos
   * @param {Params} queryParams - Parámetros de consulta para filtrar productos de importación
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456', tipoProducto: 'importacion' };
   * this.solicitudService.obtenerAnexoImportacion(parametros).subscribe(
   *   respuesta => console.log('Productos de importación:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link Params} Para la estructura de parámetros de consulta
   * @see {@link PROC_80302.ANEXO_IMPORTACION} Para la ruta de API
   * @public
   */
  obtenerAnexoImportacion(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.ANEXO_IMPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.ANEXO_IMPORTACION}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la bitácora de modificaciones del servidor remoto
   * @method obtenerBitacora
   * @description Consulta el historial completo de modificaciones del programa IMMEX
   * desde el servidor remoto, proporcionando trazabilidad de cambios realizados
   * @param {Params} queryParams - Parámetros de consulta para filtrar registros de bitácora
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { idPrograma: '12345' };
   * this.solicitudService.obtenerBitacora(parametros).subscribe(
   *   respuesta => console.log('Bitácora de modificaciones:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link Params} Para la estructura de parámetros de consulta
   * @see {@link PROC_80302.BITACORA} Para la ruta de API
   * @public
   */
  obtenerBitacora(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.BITACORA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.BITACORA}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene los datos de certificación SAT del servidor remoto
   * @method obtenerDatosCertificacionSat
   * @description Consulta el estado de certificación del SAT para el RFC especificado,
   * validando el estatus fiscal del contribuyente en el sistema tributario
   * @param {Params} queryParams - Parámetros de consulta incluyendo el RFC a validar
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456' };
   * this.solicitudService.obtenerDatosCertificacionSat(parametros).subscribe(
   *   respuesta => console.log('Certificación SAT:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link Params} Para la estructura de parámetros de consulta
   * @see {@link PROC_80302.CERTIFICACION_SAT} Para la ruta de API
   * @public
   */
  obtenerDatosCertificacionSat(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.CERTIFICACION_SAT, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.CERTIFICACION_SAT}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de domicilios/plantas del servidor remoto
   * @method obtenerListaDomicilios
   * @description Consulta las plantas asociadas al programa IMMEX desde el servidor
   * remoto utilizando los parámetros del programa específico
   * @param {Programa} body - Parámetros del programa para consultar plantas
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const programa = {
   *   rfc: 'ABC123456',
   *   idPrograma: '12345',
   *   tipoPrograma: 'IMMEX'
   * };
   * this.solicitudService.obtenerListaDomicilios(programa).subscribe(
   *   respuesta => console.log('Plantas encontradas:', respuesta),
   *   error => console.error('Error al buscar plantas:', error)
   * );
   * ```
   * @see {@link Programa} Para la estructura de parámetros del programa
   * @see {@link PROC_80302.BUSCAR_PLANTAS} Para la ruta de API
   * @public
   */
  obtenerListaDomicilios(body: Programa): Observable<JSONResponse> {
    return this.http.post(PROC_80302.BUSCAR_PLANTAS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.BUSCAR_PLANTAS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Actualiza la lista de domicilios/plantas en el servidor remoto
   * @method actualizarDomicilios
   * @description Envía las modificaciones de plantas al servidor para actualizar
   * su estado, incluyendo cambios de estatus, información y configuración
   * @param {PlantasResponse} body - Datos de las plantas a actualizar
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const plantasActualizar = {
   *   plantas: [{ idPlanta: 1, estatus: true }],
   *   idSolicitud: '123456'
   * };
   * this.solicitudService.actualizarDomicilios(plantasActualizar).subscribe(
   *   respuesta => console.log('Plantas actualizadas:', respuesta),
   *   error => console.error('Error al actualizar:', error)
   * );
   * ```
   * @see {@link PlantasResponse} Para la estructura de datos de actualización
   * @see {@link PROC_80302.UPDATE_PLANTAS} Para la ruta de API
   * @public
   */
  actualizarDomicilios(body: PlantasResponse): Observable<JSONResponse> {
    return this.http.post(PROC_80302.UPDATE_PLANTAS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al actualizar la lista de plantas en ${PROC_80302.UPDATE_PLANTAS}`);
        return throwError(() => ERROR);
      })
    );

  }

  /**
   * Guarda la solicitud completa en el servidor remoto
   * @method guardar
   * @description Envía la solicitud completa del trámite 80302 al servidor
   * para su almacenamiento y procesamiento final
   * @param {GuardarSolicitudPayload} body - Datos completos de la solicitud a guardar
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const solicitudCompleta = {
   *   datosSolicitante: {...},
   *   plantas: [...],
   *   operaciones: [...]
   * };
   * this.solicitudService.guardar(solicitudCompleta).subscribe(
   *   respuesta => console.log('Solicitud guardada:', respuesta),
   *   error => console.error('Error al guardar:', error)
   * );
   * ```
   * @see {@link GuardarSolicitudPayload} Para la estructura de datos completa
   * @see {@link PROC_80302.GUARDAR} Para la ruta de API
   * @public
   */
  guardar(body: GuardarSolicitudPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80302.GUARDAR, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al guardar la solicitud en ${PROC_80302.GUARDAR}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene una solicitud específica por su ID del servidor remoto
   * @method obtenerSolicitudId
   * @description Consulta una solicitud existente del trámite 80302 utilizando
   * su identificador único para recuperar todos sus datos
   * @param {SolicitudPayload} body - Parámetros con el ID de la solicitud a consultar
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametrosSolicitud = { idSolicitud: '123456' };
   * this.solicitudService.obtenerSolicitudId(parametrosSolicitud).subscribe(
   *   respuesta => console.log('Solicitud encontrada:', respuesta),
   *   error => console.error('Error al consultar solicitud:', error)
   * );
   * ```
   * @see {@link SolicitudPayload} Para la estructura de parámetros
   * @see {@link PROC_80302.OBTENER_SOLICITUD} Para la ruta de API
   * @public
   */
  obtenerSolicitudId(body: SolicitudPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80302.OBTENER_SOLICITUD, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la solicitud en ${PROC_80302.OBTENER_SOLICITUD}`);
        return throwError(() => ERROR);
      })
    );
  }

/**   * Obtiene la lista de programas IMMEX del servidor remoto
   * @method obtenerListaProgramas
   * @description Consulta los programas IMMEX asociados al RFC proporcionado
   * desde el servidor remoto utilizando parámetros de consulta específicos
   * @param {Params} queryParams - Parámetros de consulta para filtrar programas IMMEX
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @example
   * ```typescript
   * const parametros = { rfc: 'ABC123456' };
   * this.solicitudService.obtenerListaProgramas(parametros).subscribe(
   *   respuesta => console.log('Programas IMMEX:', respuesta),
   *   error => console.error('Error al consultar:', error)
   * );
   * ```
   * @see {@link Params} Para la estructura de parámetros
   * @see {@link PROC_80302.LISTA_PROGRAMAS} Para la ruta de API
   * @public
   */
  obtenerListaProgramas(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.LISTA_PROGRAMAS, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.LISTA_PROGRAMAS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**   * Obtiene la configuración de visualización del servidor remoto
   * @method obtenerMostrar
   * @description Consulta la configuración de qué elementos mostrar
   * en la interfaz del trámite 80302 desde el servidor remoto
   * @param {Params} queryParams - Parámetros de consulta para filtrar configuración de visualización
   * @returns {Observable<JSONResponse>} Observable con la respuesta del servidor
   * @public
   */
  obtenerMostrar(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80302.MOSTRAR, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80302.MOSTRAR}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene el estado completo de la solicitud 80302 desde el store reactivo
   * @method getAllState
   * @description Proporciona acceso reactivo al estado completo de la solicitud
   * del trámite 80302 a través del query de Akita, permitiendo suscripciones
   * a cambios en tiempo real
   * @returns {Observable<Solicitud80302State>} Observable con el estado completo de la solicitud
   * @example
   * ```typescript
   * this.solicitudService.getAllState().subscribe(estado => {
   *   console.log('Estado completo:', estado);
   *   console.log('ID Solicitud:', estado.idSolicitud);
   *   console.log('Datos Solicitante:', estado.datosSolicitante);
   * });
   * ```
   * @see {@link Solicitud80302State} Para la estructura del estado completo
   * @see {@link Tramite80302Query.selectSolicitud$} Para el observable fuente
   * @public
   */
  getAllState(): Observable<Solicitud80302State> {
    return this.Tramite80302Query.selectSolicitud$;
  }

}

  
