import { Anexo, Bitacora, Complimentaria, ComplimentariaDatos, DatosModificacion, DomicilioInfo, Federetarios, Operacions } from '../estados/models/plantas-consulta.model';
import { BuscarServicios, GuardarPayload, Params, RespuestTablaDatos, SocioAccionistaPayload, SolicitudPayload } from '../models/datos-tramite.model';
import { Catalogo, JSONResponse, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Observable, catchError, map, throwError } from 'rxjs';
import { DatosDelModificacion } from '../estados/models/datos-tramite.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80306 } from '../servers/api-route';
import { Tramite80306Query } from '../estados/tramite80306.query';
import { TramiteState } from '../estados/tramite80306.store';

/**
 * Servicio para manejar modificaciones utilizando Immer.
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para manejar modificaciones utilizando Immer.
 */
export class ImmerModificacionService {

  /**
   * Constructor del servicio ImmerModificacionService.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param Tramite80306Query Consulta para el estado del trámite 80306.
   */
  constructor(
    private http: HttpClient,
    private Tramite80306Query: Tramite80306Query
  ) { }

      /**
     * Obtener una lista de Transporte
     * 
     * @param {string} catalogo - El nombre del catálogo a obtener.
     * @returns {Observable<RespuestTablaDatos>} Un observable con la respuesta del catálogo de transporte.
     */
    getTablaData(catalogo: string): Observable<RespuestTablaDatos> {
      return this.http.get<RespuestTablaDatos>(`assets/json/80306/${catalogo}.json`);
    }

      /**
   * Obtener datos del solicitante
   *
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos del solicitante.
   */
  getDatosSolicitante(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80306/datosSolicitante.json`
    );
  }

    /**
   * Obtener datos del solicitante
   *
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos del solicitante.
   */
  getDatosModificacion(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80306/modificacion.json`
    );
  }

  /**
   * Obtiene los datos de modificación desde un archivo JSON local.
   * 
   * @returns {Observable<RespuestaCatalogos[]>} Un observable que emite un arreglo de objetos de tipo `RespuestaCatalogos`.
   */
  getModificacion(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(
      `assets/json/80306/modificacion.json`
    );
  }

  /**
   * Obtener datos de la tabla
   *
   * @returns {Observable<RespuestaCatalogos[]>} Un observable con la respuesta de los datos de la tabla.
   */
  getDatosTableData(): Observable<DatosDelModificacion[]> {
    return this.http.get<DatosDelModificacion[]>(
      `assets/json/80306/datosTabla.json`
    );
  }

    /**
     * Obtiene una lista de objetos de tipo `Complimentaria` desde un archivo JSON local.
     * 
     * @returns Un observable que emite un arreglo de objetos `Complimentaria`.
     */
    obtenerComplimentaria(): Observable<Complimentaria[]> {
    return this.http
      .get<ComplimentariaDatos>('assets/json/80306/complimentaria.json').pipe(map((res: ComplimentariaDatos) => res.data));
  }

  /**
   * Obtiene una lista de anexos desde un archivo JSON localizado en los activos.
   *
   * @returns {Observable<Anexo[]>} Un observable que emite un arreglo de objetos de tipo Anexo.
   */
  obtenerAnexo(): Observable<Anexo[]> {
    return this.http
      .get<{data: Anexo[]}>('assets/json/80306/anexo.json').pipe(map((res: {data:Anexo[]}) => res.data));
  }

  /**
   * Obtiene la lista de federatarios desde un archivo JSON local.
   * 
   * @returns Un observable que emite un arreglo de objetos de tipo `Federetarios`.
   */
  obtenerFederetarios(): Observable<Federetarios[]> {
    return this.http
      .get<{data: Federetarios[]}>('assets/json/80306/federetarios.json').pipe(map((res: {data: Federetarios[]}) => res.data));
  }
  
  /**
   * Obtiene una lista de operaciones desde un archivo JSON local.
   *
   * @returns Un observable que emite un arreglo de objetos de tipo `Operacions`.
   * El archivo JSON se encuentra en la ruta `assets/json/80306/operacion.json`.
   */
  obtenerOperacion(): Observable<Operacions[]> {
    return this.http
      .get<{data: Operacions[]}>('assets/json/80306/operacion.json').pipe(map((res: {data: Operacions[]}) => res.data));
  }

  /**
   * Obtiene la lista de plantas desde un archivo JSON localizado en los activos.
   * 
   * @returns {Observable<Operacions[]>} Un observable que emite un arreglo de objetos `Operacions`.
   */
  obtenerPlanta(): Observable<Operacions[]> {
    return this.http
      .get<{data: Operacions[]}>('assets/json/80306/planta.json').pipe(map((res: {data: Operacions[]}) => res.data));
  }

  /**
   * Obtiene una lista de servicios desde un archivo JSON local.
   *
   * @returns {Observable<Operacions[]>} Un observable que emite un arreglo de operaciones.
   */
  obtenerServicios(): Observable<Operacions[]> {
    return this.http
      .get<{data: Operacions[]}>('assets/json/80306/servicios.json').pipe(map((res: {data: Operacions[]}) => res.data));
  }

  /**
     * Obtiene la lista de estados.
     * @method obtenerListaEstado
     * @returns {Observable<Catalogo[]>} Observable con la lista de estados.
     */
    obtenerListaEstado(): Observable<Catalogo[]> {
      return this.http
        .get<{data: Catalogo[]}>('./assets/json/80306/estado.json').pipe(map((res: {data: Catalogo[]}) => res.data));
    }
  
    obtenerDomicilios(): Observable<DomicilioInfo[]> {
      return this.http
        .get<{data: DomicilioInfo[]}>('assets/json/80306/domicilio.json').pipe(map((res: {data: DomicilioInfo[]}) => res.data));
    }
  
    obtenerBitacora(): Observable<Bitacora[]> {
      return this.http
        .get<{data: Bitacora[]}>('assets/json/80306/bitacora.json').pipe(map((res: {data: Bitacora[]}) => res.data));
    }
  
    obtenerDatosGenerales(): Observable<DatosModificacion> {
      return this.http
        .get<{data: DatosModificacion}>('assets/json/80306/datos-modificacion.json').pipe(map((res: {data: DatosModificacion}) => res.data));
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
    return this.http.get<JSONResponse>(PROC_80306.LISTA_PROGRAMAS, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.LISTA_PROGRAMAS}`);
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
    return this.http.post(PROC_80306.OBTENER_SOLICITUD, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la solicitud en ${PROC_80306.OBTENER_SOLICITUD}`);
        return throwError(() => ERROR);
      })
    );
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
   * @see {@link PROC_80306.BUSCAR_SOCIO_ACCIONISTA} Para la ruta de API
   * @public
   */
  obtenerBuscarSocioAccionista(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80306.BUSCAR_SOCIO_ACCIONISTA, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.BUSCAR_SOCIO_ACCIONISTA}`);
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
    return this.http.post(PROC_80306.BUSCAR_NOTARIOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.BUSCAR_NOTARIOS}`);
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
   * @see {@link PROC_80306.OPERACION_IMMEX} Para la ruta de API
   * @public
   */
  obtenerOperacionImmex(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80306.OPERACION_IMMEX, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.OPERACION_IMMEX}`);
        return throwError(() => ERROR);
      })
    );
  }

  
  /**
   * Obtiene la información de submanufacturera desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerSubmanufacturera
   */
  obtenerSubmanufacturera(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.SUBMANUFACTURERA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.SUBMANUFACTURERA}`);
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Obtiene la información de manufacturera desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerManufacturera
   */
  obtenerManufacturera(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.MANUFACTURERA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.MANUFACTURERA}`);
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Obtiene la lista de servicios IMMEX desde la API del procedimiento 80308.
   * @param {SolicitudBody} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerServiciosImmex
   */
  obtenerServiciosImmex(body:SocioAccionistaPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80306.SERVICIOS_IMMEX, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.SERVICIOS_IMMEX}`);
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
  /**
   * @method obtenerDatosCertificacionSat
   */
  obtenerDatosCertificacionSat(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.CERTIFICACION_SAT, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.CERTIFICACION_SAT}`);
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Obtiene los datos de productos de exportación desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerProductosExportacion
   */
  obtenerProductosExportacion(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.PRODUCTOS_EXPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.PRODUCTOS_EXPORTACION}`);
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Obtiene los datos de productos de exportación desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerProductosImportacion
   */
  obtenerProductosImportacion(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.PRODUCTOS_IMPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.PRODUCTOS_IMPORTACION}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene los datos de fracciones sensibles desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerFraccionesSensibles
   */
  obtenerFraccionesSensibles(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.FRACCIONES_SENSIBLES, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.FRACCIONES_SENSIBLES}`);
        return throwError(() => ERROR);
      })
    );
  }

      /**
   * Obtiene la lista de servicios IMMEX desde la API del procedimiento 80306.
   * @param {BuscarServicios} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerServiciosImmex
   */
  obtenerBuscarServicios(body:BuscarServicios): Observable<JSONResponse> {
    return this.http.post(PROC_80306.BUSCAR_SERVICIOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.BUSCAR_SERVICIOS}`);
        return throwError(() => ERROR);
      })
    );
  }

    /**
   * Obtiene los datos de la bitácora IMMEX desde la API del procedimiento 80308.
   * @param {Params} queryParams - Parámetros de consulta necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerBitacora80306
   */
  obtenerBitacora80306(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80306.BITACORA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.BITACORA}`);
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
  guardar(body: GuardarPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80306.GUARDAR, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al guardar la solicitud en ${PROC_80306.GUARDAR}`);
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
    return this.http.get<JSONResponse>(PROC_80306.MOSTRAR, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80306.MOSTRAR}`);
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
  getAllState(): Observable<TramiteState> {
    return this.Tramite80306Query.selectSolicitud$;
  }

}
