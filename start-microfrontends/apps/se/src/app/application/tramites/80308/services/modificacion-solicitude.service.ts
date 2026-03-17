/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Complimentaria,
  DatosImmex,
  DomicilioInfo,
  Federetarios,
  GuardarPayload,
  Operacions,
  Params,
  SolicitudBody,
  SolicitudData,
  SolicitudIdPayload,
} from '../models/plantas-consulta.model';
import { HttpCoreService, JSONResponse, JsonResponseCatalogo } from '@ng-mf/data-access-user';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Anexo } from '../../../shared/models/anexos.model';
import { Bitacora } from '../../../shared/models/bitacora.model';
import { DatosModificacion } from '../../../shared/models/modificacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_80308 } from '../servers/api-route';
import { Tramite80308Query } from '../estados/tramite80308.query';
import { TramiteState } from '../estados/tramite80308.store';

/**
 * @service
 * @name ModificacionSolicitudeService
 * @description Servicio para la gestión de solicitudes de modificación
 */
@Injectable({
  providedIn: 'root',
})
/**
 * @class ModificacionSolicitudeService
 */
export class ModificacionSolicitudeService {

  // eslint-disable-next-line no-empty-function
  /**
   * @constructor
   */
  constructor(private http: HttpClient,
    public httpService: HttpCoreService,
    private tramite80308Query: Tramite80308Query
  ){}

  /**
   * Obtiene la lista de estados.
   * @method obtenerListaEstado
   * @returns {Observable<Catalogo[]>} Observable con la lista de estados.
   */
  /**
   * @method obtenerListaEstado
   */
  obtenerListaEstado(): Observable<JsonResponseCatalogo> {
    return this.httpService.get<JsonResponseCatalogo>(
      PROC_80308.ESTADOS,
      {},
      false
    );
  }

  /**
   * Obtiene la lista de domicilios desde un archivo JSON local.
   * @returns Observable con arreglo de DomicilioInfo.
   */
  /**
   * @method obtenerDomicilios
   */
  obtenerDomicilios(): Observable<DomicilioInfo[]> {
    return this.http
      .get<DomicilioInfo[]>('assets/json/80308/domicilio.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene la lista de domicilios desde la API del procedimiento 80308.
   * @param {SolicitudData} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerDomicilios80308
   */
  obtenerDomicilios80308(body:SolicitudData): Observable<JSONResponse> {
    return this.http.post(PROC_80308.BUSCAR_DOMICILIOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.BUSCAR_DOMICILIOS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la solicitud por ID desde la API del procedimiento 80308.
   * @param {SolicitudIdPayload} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerBuscaSolicitudId
   */
  obtenerBuscaSolicitudId(body:SolicitudIdPayload): Observable<JSONResponse> {
    return this.http.post(PROC_80308.BUSCAR_ID_SOLICITUD, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.BUSCAR_ID_SOLICITUD}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la información del socio accionista desde la API del procedimiento 80308.
   * @param {SolicitudData} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerSocioAccionista80308
   */
  obtenerSocioAccionista80308(body:SolicitudBody): Observable<JSONResponse> {
    return this.http.post(PROC_80308.SOCIO_ACCIONISTA, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.BUSCAR_DOMICILIOS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de notarios desde la API del procedimiento 80308.
   * @param {SolicitudBody} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerBuscarNotarios
   */
  obtenerBuscarNotarios(body:SolicitudBody): Observable<JSONResponse> {
    return this.http.post(PROC_80308.BUSCAR_NOTARIOS, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.BUSCAR_NOTARIOS}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene la lista de operaciones desde la API del procedimiento 80308.
   * @param {SolicitudBody} body - Datos necesarios para la solicitud.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method obtenerOperacions
   */
  obtenerOperacions(body:SolicitudBody): Observable<JSONResponse> {
    return this.http.post(PROC_80308.OPERACIONES, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.OPERACIONES}`);
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
    return this.http.get<JSONResponse>(PROC_80308.SUBMANUFACTURERA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.SUBMANUFACTURERA}`);
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
    return this.http.get<JSONResponse>(PROC_80308.MANUFACTURERA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.MANUFACTURERA}`);
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
  obtenerServiciosImmex(body:SolicitudBody): Observable<JSONResponse> {
    return this.http.post(PROC_80308.SERVICIOS_IMMEX, body).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.SERVICIOS_IMMEX}`);
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
    return this.http.get<JSONResponse>(PROC_80308.CERTIFICACION_SAT, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.CERTIFICACION_SAT}`);
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
    return this.http.get<JSONResponse>(PROC_80308.PRODUCTOS_EXPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.PRODUCTOS_EXPORTACION}`);
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
    return this.http.get<JSONResponse>(PROC_80308.PRODUCTOS_IMPORTACION, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.PRODUCTOS_IMPORTACION}`);
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
    return this.http.get<JSONResponse>(PROC_80308.FRACCIONES_SENSIBLES, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.FRACCIONES_SENSIBLES}`);
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
   * @method obtenerBitacora80308
   */
  obtenerBitacora80308(queryParams: Params): Observable<JSONResponse> {
    const PARAMS_OBJ: { [param: string]: string | number | boolean } = { ...queryParams };
    return this.http.get<JSONResponse>(PROC_80308.BITACORA, { params: PARAMS_OBJ }).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al obtener la lista de plantas en ${PROC_80308.BITACORA}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Guarda los datos del trámite 80308 en la API correspondiente.
   * @param {GuardarPayload} payload - Objeto que contiene los datos a guardar.
   * @returns {Observable<JSONResponse>} Observable con la respuesta JSON.
   */
  /**
   * @method guardarDatos80308
   */
  guardarDatos80308(payload: GuardarPayload): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_80308.GUARDAR, payload).pipe(
      map((response) => response as JSONResponse),
      catchError(() => {
        const ERROR = new Error(`Error al guardar los datos en ${PROC_80308.GUARDAR}`);
        return throwError(() => ERROR);
      })
    );
  }

  /**
   * Obtiene el historial de bitácora desde un archivo JSON local.
   * @returns Observable con arreglo de Bitacora.
   */
  /**
   * @method obtenerBitacora
   */
  obtenerBitacora(): Observable<Bitacora[]> {
    return this.http
      .get<Bitacora[]>('assets/json/80308/bitacora.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene los datos generales de modificación desde un archivo JSON local.
   * @returns Observable con un objeto DatosModificacion.
   */
  /**
   * @method obtenerDatosGenerales
   */
  obtenerDatosGenerales(): Observable<DatosModificacion> {
    return this.http
      .get<DatosModificacion>('assets/json/80308/datos-modificacion.json')
      .pipe(map((res: any) => res.data));
  }

  
  /**
   * Obtiene la lista de federatarios desde un archivo JSON local.
   * @returns Observable con arreglo de Federetarios.
   */
  /**
   * @method obtenerFederetarios
   */
  obtenerFederetarios(): Observable<Federetarios[]> {
    return this.http
      .get<Federetarios[]>('assets/json/80308/federetarios.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene información de operaciones desde un archivo JSON local.
   * @returns Observable con arreglo de Operacions.
   */
  /**
   * @method obtenerOperacion
   */
  obtenerOperacion(): Observable<Operacions[]> {
    return this.http
      .get<Operacions[]>('assets/json/80308/operacion.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene los datos de complimentaria desde un archivo JSON local.
   * @returns Observable con arreglo de Complimentaria.
   */
  /**
   * @method obtenerComplimentaria
   */
  obtenerComplimentaria(): Observable<Complimentaria[]> {
    return this.http
      .get<Complimentaria[]>('assets/json/80308/complimentaria.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene los datos del anexo desde un archivo JSON local.
   * @returns Observable con arreglo de Anexo.
   */
  /**
   * @method obtenerAnexo
   */
  obtenerAnexo(): Observable<Anexo[]> {
    return this.http
      .get<Anexo[]>('assets/json/80308/anexo.json')
      .pipe(map((res: any) => res.data));
  }

  /**
   * Obtiene los datos del trámite desde un archivo JSON local.
   * @returns Observable con objeto parcial de TramiteState.
   */
  /**
   * @method obtenerTramiteDatos
   */
  obtenerTramiteDatos(): Observable<Partial<TramiteState>> {
    return this.http
      .get<Partial<TramiteState>>('assets/json/80308/tramite_datos.json')
      .pipe(map((res: any) => res.data));
  }


 /**
   * Obtiene los datos del anexo desde un archivo JSON local.
   * @returns Observable con arreglo de Anexo.
   */
  /**
   * @method obtenerFraccion
   */
  obtenerFraccion(): Observable<Anexo[]> {
    return this.http
      .get<Anexo[]>('assets/json/80308/fraccion.json')
      .pipe(map((res) => res));
  }

  /**
   * Obtiene los datos del anexo desde un archivo JSON local.
   * @returns Observable con arreglo de Anexo.
   */
  /**
   * @method obtenerImmex
   */
  obtenerImmex(): Observable<DatosImmex[]> {
    return this.http
      .get<DatosImmex[]>('assets/json/80308/immex.json')
      .pipe(map((res: any) => res.data));
  }

  /**
 * Obtiene todo el estado del trámite 120401 como un Observable.
 * @returns Observable con el estado completo del trámite 120401
 */
/**
 * @method getAllState
 */
getAllState(): Observable<TramiteState> {
  return this.tramite80308Query.tramiteState$;
}


/**
     * Obtiene la lista de plantas desde un archivo JSON localizado en los activos.
     * 
     * @returns {Observable<Operacions[]>} Un observable que emite un arreglo de objetos `Operacions`.
     */
    /**
     * @method obtenerPlanta
     */
    obtenerPlanta(): Observable<Operacions[]> {
      return this.http
        .get<{data: Operacions[]}>('assets/json/80308/planta.json').pipe(map((res: {data: Operacions[]}) => res.data));
    }

     /**
         * Obtiene una lista de servicios desde un archivo JSON local.
         *
         * @returns {Observable<Operacions[]>} Un observable que emite un arreglo de operaciones.
         */
        /**
         * @method obtenerServicios
         */
        obtenerServicios(): Observable<Operacions[]> {
          return this.http
            .get<{data: Operacions[]}>('assets/json/80308/servicios.json').pipe(map((res: {data: Operacions[]}) => res.data));
        }
    }
