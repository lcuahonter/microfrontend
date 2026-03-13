import { API_FIRMAR_SOLICITUD, API_GENERA_CADENA_ORIGINAL, API_GET_ADUANA_INGRESO, API_GET_DATOS_GENERALES_REVISION, API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL, API_GET_DATOS_MERCANCIA, API_GET_ESTABLECIMIENTOS_TIF, API_GET_HISTORIAL_INSPECCION_FISICA, API_GET_JUSTIFICACION, API_GET_MEDIO_TRANSPORTE, API_GET_OFICINAS_INSPECCION_SANIDAD, API_GET_PAGO_DERECHOS_REVISION, API_GET_PUNTOS_INSPECCION, API_GET_PUNTO_VERIFICACION_FEDERAL, API_GET_REGIMENES, API_GET_SOLICITUDES, API_GET_TERCEROS, API_HISTORIAL_CARROS_FERROCARRIL } from '../../../core/server/api-router';
import { ApiResponse, Catalogo, ENVIRONMENT, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { DatosGeneralesRevision, Destinatario, Exportador, HistorialCarrosFerroResponse, HistorialInspeccionFisica, HistorialInspeccionFisicaApiResponse, MercanciaApiResponse, MercanciaRevisionApiResponse,MercanciaTabla, MercanciasLista, PagoDeDerechos, PagoDerechosResponse } from '../models/pago-de-derechos.model';
import { Movilizacion, Solicitud } from '../models/datos-generales.model';
import { Observable, catchError, map, of, throwError } from 'rxjs';


import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Solicitud220501State } from '../estados/tramites220501.store';

import { Injectable } from '@angular/core';

import { Solicitud220501Query } from '../estados/tramites220501.query';

export interface SolicitudApi {
  id_solicitud: number;
  fecha_creation: string;
  mercancia: string;
  cantidad: string;
  proveedor: string;
}
export interface CadenaOriginalResponse {
  codigo: string;   
  mensaje: string;   
  datos: string;      
}
export interface CadenaOriginalRequest{
 
  documentos_requeridos: Array<{
    id_documento_seleccionado: number;
  }>;
}
export interface DocumentoRequeridoFirmarPyld {
  id_documento_seleccionado?: string | number;
  hash_documento?: string;
  sello_documento?: string;
}

export interface FirmaDatosRequest {
  /** Identificador de la solicitud */
  id_solicitud: number;

  /** Cadena original en hexadecimal */
  cadena_original: string;

  /** Número de serie del certificado */
  cert_serial_number: string;

  /** Número de autorización */
  num_autorizacion: string;

  /** Sello generado de la firma (hex o base64) */
  sello: string;

  /** Documentos requeridos para la firma */
  documentos_requeridos: DocumentoRequeridoFirmarPyld[];

  /** RFC del solicitante (opcional, puede usar guion bajo o camelCase) */
  rfcSolicitante?: string;
  rfc_solicitante?: string;

  /** ID del mecanismo (opcional) */
  id_mecanismo?: number;
}
export interface IniciarResponse {
  codigo?: string;
  mensaje?: string;
  datos?: {
    cadena_original?: string;
    id_solicitud?: number;
    cve_folio_caat?: string;
    num_folio_caat?: string;
    fecha_de_vigencia?: string;
    is_extranjero?: boolean;
    mensaje?: string;
    documento_detalle?: {
      llave_archivo?: string;
      nombre_archivo?: string;
      contenido?: string; // base64 if returned
    };
  };
}



/**
 * Servicio para gestionar las revisiones.
 */
@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios.
   */
  host: string;

  /**
 * Obtiene los encabezados (headers) necesarios para realizar llamadas a la API.
 * 
 * Esta función recupera los valores almacenados en el `localStorage` del navegador
 * correspondientes a la clave de usuario (`ClaveUsuario`), el RFC (`Rfc`) y el rol (`CveRole`),
 * y los incluye en un objeto `HttpHeaders` que será enviado en las peticiones HTTP.
 * 
 * @returns {HttpHeaders} Objeto con los encabezados personalizados para la autenticación o identificación del usuario.
 */


    private static getApiHeaders(): HttpHeaders {
    const CLAVEUSUARIO = localStorage.getItem('ClaveUsuario') || '';
    const RFC = localStorage.getItem('Rfc') || '';
    const CVEROLE = localStorage.getItem('CveRole') || '';

    return new HttpHeaders({
      'ClaveUsuario': CLAVEUSUARIO,
      'Rfc': RFC,
      'CveRole': CVEROLE
    });
  }

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - El cliente HTTP para realizar solicitudes.
   */
  constructor(
    private http: HttpClient,
    private solicitud220501Query: Solicitud220501Query
  ) {
    this.host = ENVIRONMENT.API_HOST;
  }

  /**
   * Obtiene los datos del catálogo de Aduanas de Ingreso desde la API.
   *
   * Este método realiza una solicitud HTTP GET al endpoint correspondiente y
   * utiliza los encabezados definidos en `getApiHeaders()` para la autenticación.
   *
   * En caso de error, se captura la excepción y se devuelve un arreglo vacío,
   * registrando el error en la consola.
   *
   * @returns {Observable<Catalogo[]>} Un observable con la lista de aduanas de ingreso.
   */

    getAduanaDeIngreso(procedimiento:string): Observable<Catalogo[]> {
       const ENDPOINT = `${this.host}${API_GET_ADUANA_INGRESO(procedimiento)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: RevisionService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          return of([error] as Catalogo[]);
        })
      );
  }
 /**
 * Obtiene las oficinas de inspección de sanidad agropecuaria asociadas
 * a una clave de aduana específica desde la API.
 *
 * Este método construye dinámicamente el endpoint utilizando la clave
 * proporcionada y realiza una solicitud HTTP GET con los encabezados
 * definidos en `getApiHeaders()`.
 *
 * En caso de error, se captura la excepción y se devuelve el error en un observable.
 *
 * @param {string} clave - Clave de la aduana para consultar las oficinas correspondientes.
 * @returns {Observable<Catalogo[]>} Un observable con la lista de oficinas de inspección de sanidad agropecuaria.
 */
  getOficianaInspeccion(clave:string,procedimiento:string): Observable<Catalogo[]> {
     const ENDPOINT = `${this.host}${API_GET_OFICINAS_INSPECCION_SANIDAD(procedimiento, clave)}`;
    
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: RevisionService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of(error);
        })
      );
  }

/**
 * Obtiene el catálogo de puntos de inspección asociados a una clave específica.
 *
 * Este método consulta el endpoint correspondiente del backend para recuperar
 * el listado de puntos de inspección (aduanas, módulos o ubicaciones) que
 * corresponden al parámetro `clave`.
 *
 * Flujo general del método:
 * 1. Construye dinámicamente el endpoint utilizando el número de trámite y la clave solicitada.
 * 2. Realiza una petición HTTP GET incluyendo los encabezados requeridos por el backend.
 * 3. Extrae y retorna únicamente la propiedad `datos` del `ApiResponse`,
 *    ya que esta contiene directamente el arreglo del catálogo.
 * 4. En caso de error, captura la excepción y devuelve un `Observable` con el error
 *    para evitar que la cadena de Observables quede interrumpida.
 *
 * @param clave - Código que identifica el conjunto de puntos de inspección a consultar.
 * @returns Un `Observable<Catalogo[]>` que emite la lista de puntos de inspección obtenida del backend.
 */
  getPuntoInspeccion(clave: string,procedimiento:string): Observable<Catalogo[]> {
  const ENDPOINT = `${this.host}${API_GET_PUNTOS_INSPECCION(procedimiento, clave)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { 
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response.datos),
    catchError(error => of(error))
  );
}

  /**
   * Obtiene los datos del establecimiento.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del establecimiento.
   */
getEstablecimiento(procedimiento: string, cveUcon: string): Observable<ApiResponse<Catalogo>> {
  const ENDPOINT = `${this.host}${API_GET_ESTABLECIMIENTOS_TIF(procedimiento, cveUcon)}`; // Pasa cveUcon aquí
  return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}

  /**
   * Obtiene los datos del régimen al que se destinarán las mercancías.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del régimen.
   */
  getRegimenDestinaran(procedimiento:string): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_REGIMENES(procedimiento)}`,
      { headers: RevisionService.getApiHeaders() }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos de la movilización nacional.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la movilización nacional.
   */
  getMovilizacionNacional(): Observable<Catalogo[]> {
      const ENDPOINT = `${this.host}${API_GET_MEDIO_TRANSPORTE('220501')}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: RevisionService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of([error]);
        })
      );
  }
  /**
   * Obtiene los datos del punto de verificación.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de verificación.
   */
  getPuntoVerificacion(): Observable<Catalogo[]> {
  const ENDPOINT = `${this.host}${API_GET_PUNTO_VERIFICACION_FEDERAL('220501')}`;

  return this.http.get<ApiResponse<Catalogo[]>>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response.datos),
    catchError(error => of(error))
  );
}

  /**
   * Obtiene los datos de la empresa transportista.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la empresa transportista.
   */
  getEmpresaTransportista(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/empresa-transportista.json');
  }

  /**
   * Obtiene los datos de la justificación.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la justificación.
   */
   getJustificacion(): Observable<ApiResponse<Catalogo>> {
  const ENDPOINT = `${this.host}${API_GET_JUSTIFICACION('220501')}`;

  return this.http.get<Catalogo>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}
  
  /**
   * Obtiene los datos del banco.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del banco.
   */
  getBanco(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/banco.json');
  }

  /** 
   * Servicio para obtener datos relacionados con la solicitud. 
   */
  getPagoDeDerechos(): Observable<PagoDeDerechos> {
    /** Obtiene la información del pago de derechos desde un archivo JSON. */
    return this.http.get<PagoDeDerechos>('assets/json/220501/pago-de-derechos.json');
  }

  /** 
   * Servicio para obtener los datos generales de la solicitud. 
   */
  getDatosDelaSolicitud(): Observable<Solicitud220501State> {
    /** Obtiene los datos de la solicitud desde un archivo JSON. */
    return this.http.get<Solicitud220501State>('assets/json/220501/datos-dela-solicitud.json');
  }

  /** 
   * Servicio para obtener los datos de movilización. 
   */
  getMovilizacion(): Observable<Movilizacion> {
    /** Obtiene los datos de la movilización desde un archivo JSON. */
    return this.http.get<Movilizacion>('assets/json/220501/movilizacion.json');
  }
  /**
   * Obtiene los datos de la tabla de exportadores.
   * 
   * @returns {Observable<Exportador[]>} - Lista de exportadores.
   */
 /**
   * Obtiene los datos de la tabla de exportadores.
   *
   * @returns {Observable<Exportador[]>} - Lista de exportadores.
   */
  obtenerTablaExportador(): Observable<ApiResponse<Exportador>> {
     const SOLICTIUDE_ID= this.solicitud220501Query.getValue().id_solicitud ;
    return this.http
      .get<ApiResponse<Exportador>>(`${this.host}${API_GET_TERCEROS('220501',SOLICTIUDE_ID)}`,{params: {tipoTercero: 'EXP'}, headers: RevisionService.getApiHeaders()})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene los datos de la tabla de destinatarios.
   *
   * @returns {Observable<Destinatario[]>} - Lista de destinatarios.
   */
  obtenerTablaDestinatario(): Observable<ApiResponse<Destinatario>> {
    const SOLICTIUDE_ID= this.solicitud220501Query.getValue().id_solicitud 
    return this.http
      .get<ApiResponse<Destinatario>>(`${this.host}${API_GET_TERCEROS('220501',SOLICTIUDE_ID)}`,{params: {tipoTercero: 'DES'}, headers: RevisionService.getApiHeaders()})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
 * Obtiene los datos generales asociados a una solicitud en revisión documental.
 *
 * Este método realiza la consulta al backend para obtener la información
 * general ligada al certificado proporcionado. La respuesta retornada por el
 * servidor se ajusta al modelo `DatosGeneralesRevision`, que contiene la
 * información base de la solicitud, transporte, trámite y otros datos clave.
 *
 * Flujo general del método:
 * 1. Construye dinámicamente el endpoint utilizando el número de trámite y
 *    el certificado enviado como parámetro.
 * 2. Envía una petición HTTP GET incluyendo los encabezados requeridos por el backend.
 * 3. Extrae únicamente la propiedad `datos` del `ApiResponse`, ya que contiene
 *    directamente el objeto con los datos generales.
 * 4. Maneja cualquier error interceptándolo y devolviendo un `Observable`
 *    que emite dicho error, evitando romper el flujo RXJS.
 *
 * @param certificado - Número de certificado o identificador utilizado para obtener los datos generales.
 * @returns Un `Observable<DatosGeneralesRevision>` que emite la información general de la solicitud.
 */
getDatosGeneralesRevision(certificado: string): Observable<DatosGeneralesRevision > {
  const ENDPOINT = `${this.host}${API_GET_DATOS_GENERALES_REVISION('220501', certificado)}`;
  return this.http.get<ApiResponse<DatosGeneralesRevision >>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response.datos),
    catchError(error => of(error))
  );
}

/**
 * Obtiene y transforma los datos de mercancías asociados a una revisión documental.
 *
 * Este método consulta el endpoint correspondiente del backend para recuperar
 * la lista de mercancías ligadas al certificado proporcionado. Posteriormente,
 * normaliza y estructura la respuesta del backend al formato definido por
 * la interfaz `MercanciasLista`.
 *
 * Flujo general del método:
 * 1. Construye dinámicamente el endpoint utilizando el número de trámite y el certificado.
 * 2. Realiza una petición HTTP GET incluyendo los encabezados requeridos por el backend.
 * 3. Extrae la propiedad `datos` del `ApiResponse`, la aplana (por si viene anidada)
 *    y mapea cada elemento al modelo `MercanciasLista`.
 * 4. Garantiza que cada campo sea convertido al tipo correcto (string o number)
 *    según lo esperado por el modelo.
 * 5. En caso de error, captura la excepción y devuelve un `Observable` con el error
 *    para evitar que el flujo RXJS se rompa.
 *
 * @param certificado - Identificador del certificado a consultar.
 * @returns Un `Observable<MercanciasLista[]>` que emite la lista procesada de mercancías.
 */
getDatosMercanciaRevision(certificado: string): Observable<ApiResponse<MercanciasLista>> {
  const ENDPOINT = `${this.host}${API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL('220501', certificado)}`;
   return this.http
    .get<ApiResponse<MercanciaRevisionApiResponse[]>>(ENDPOINT, {
      headers: RevisionService.getApiHeaders(),
    })
    .pipe(
      map((response) => {
        const DATOS = (response?.datos || []).flat();
       return {
          ...response,
          datos: DATOS.map((item): MercanciasLista => ({
  Partida: String(item.numero_partida),
  Tiporequisito: item.tipo_requisito,
  Requisito: item.requisito,
  Certificado: Number(certificado),

  Fraccion: item.fraccion_arancelaria,
  FraccionDescripcion: item.desc_de_la_frac,

  Nico: item.nico,
  NicoDescripcion: item.descripcion_nico,
  Descripcion: item.descripcion??'', 

  Umt: item.unidad_medida_tarifa ?? '',
  CantidadUMT: Number(item.cantidad_umt),

  Umc: item.unidad_medida_comercial ?? '',
  CantidadUMC: Number(item.cantidad_umc),

  Especie: item.especie??'', 
  Uso: item.uso ?? '',

  PaisOrigen: item.pais_origen ?? '',
  PaisProcedencia: item.pais_procedencia ?? '',

  Presentacion: '', 
  CantidadPresentacion: 0, 
  TipoPresentacion: '', 

  TipoPlanta: '', 
  PlantaAutorizadaOrigen: '', 

  CertificadoInternacionalElectronico: item.num_cert_intern
          })),
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene los datos del pago de derechos.
 *
 * @returns {Observable<PagoDerechos >} - Los datos del pago de derechos.
 */
getPagoDerechos(CERTIFICADO: string): Observable<PagoDerechosResponse> {
  const ENDPOINT = `${this.host}${API_GET_PAGO_DERECHOS_REVISION('220501', CERTIFICADO)}`;
  return this.http.get<PagoDerechosResponse>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}



/**
 * Obtiene la lista de mercancías asociadas a un certificado específico.
 *
 * Esta función realiza una llamada HTTP al endpoint correspondiente del backend,
 * transformando la respuesta cruda de la API (`MercanciaApiResponse[]`) en una estructura
 * más amigable para la vista (`MercanciaTabla[]`).
 *
 * Flujo general del método:
 * 1. Construye el endpoint dinámicamente con el trámite y el número de certificado.
 * 2. Realiza la solicitud HTTP GET con los encabezados necesarios.
 * 3. Transforma la respuesta de la API al formato que necesita el componente.
 * 4. Maneja errores devolviendo un arreglo vacío o el error capturado.
 *
 * @param certificado - Número o identificador único del certificado a consultar.
 * @returns Un `Observable<MercanciaTabla[]>` que emite la lista de mercancías transformada.
 */
getDatosMercancia(certificado: string): Observable<ApiResponse<MercanciaTabla>> {
  const ENDPOINT = `${this.host}${API_GET_DATOS_MERCANCIA('220501', certificado)}`;

  return this.http
    .get<ApiResponse<MercanciaApiResponse[]>>(ENDPOINT, {
      headers: RevisionService.getApiHeaders(),
    })
    .pipe(
      map((response) => {
        const DATOS: MercanciaApiResponse[] = (response?.datos || []).flat();
        return {
          ...response,
          datos: DATOS.map((item): MercanciaTabla => ({
            fraccionArancelaria: item.fraccion_arancelaria,
            descripcionFraccion: item.descripcion_de_la_fraccion,
            nico: item.nico,
            descripcion: item.descripcion_nico,
            unidaddeMedidaDeUMT: item.uni_medida_tar,
            cantidadTotalUMT: item.cant_total_umt,
            saldoPendiente: item.saldo_pendiente,
            saldoACapturar:String(item.cant_soli_umt),
            num_permiso_importacion: item.num_permiso_importacion,
          })),
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Obtiene el catálogo de medios de transporte desde la API.
 *
 * Este método construye el endpoint utilizando la clave del trámite
 * y realiza una solicitud HTTP GET al servidor con los encabezados
 * definidos en `getApiHeaders()` para la autenticación.
 *
 * En caso de error, se captura la excepción y se devuelve un arreglo con el error.
 *
 * @returns {Observable<Catalogo[]>} Un observable con la lista de medios de transporte.
 */
     getMediosDeTransporte(): Observable<Catalogo[]> {
      const ENDPOINT = `${this.host}${API_GET_MEDIO_TRANSPORTE('220501')}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: RevisionService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of([error]);
        })
      );
  }

  /**
 * Obtiene el historial de carros ferrocarril de un certificado.
 *
 * @param certificado - Número del certificado.
 * @returns {Observable<any>} - Respuesta de la API.
 */
obtenerHistorialCarrosFerrocarri(certificado: number | string): Observable<ApiResponse<HistorialCarrosFerroResponse >> {
  const ENDPOINT = `${this.host}${API_HISTORIAL_CARROS_FERROCARRIL('220501', certificado)}`;
  
  return this.http.get<ApiResponse<HistorialCarrosFerroResponse >>(ENDPOINT, {
    headers: RevisionService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}

/**
 * Obtiene el historial de inspecciones físicas asociado a un certificado específico.
 *
 * Este método realiza una llamada HTTP al endpoint correspondiente del backend
 * y transforma la respuesta cruda de la API (`HistorialInspeccionFisicaApiResponse[]`)
 * en una estructura tipada y más fácil de consumir en la vista (`HistorialInspeccionFisica[]`).
 *
 * Flujo general del método:
 * 1. Construye dinámicamente el endpoint utilizando el trámite y el número de certificado.
 * 2. Envía la solicitud HTTP GET con los encabezados requeridos por el backend.
 * 3. Normaliza y transforma los datos recibidos, asegurando que cada registro cumpla
 *    con la estructura definida en la interfaz `HistorialInspeccionFisica`.
 * 4. Maneja errores devolviendo un arreglo con el error capturado para evitar la ruptura del Observable.
 *
 * @param certificado - Identificador único del certificado para el cual se consulta el historial.
 * @returns Un `Observable<HistorialInspeccionFisica[]>` que emite la lista procesada.
 */
getHistorialInspeccionFisica(certificado: string): Observable<ApiResponse<HistorialInspeccionFisica>> {
  const ENDPOINT = `${this.host}${API_GET_HISTORIAL_INSPECCION_FISICA('220501', certificado)}`;
    return this.http
    .get<ApiResponse<HistorialInspeccionFisicaApiResponse[]>>(ENDPOINT, {
      headers: RevisionService.getApiHeaders(),
    })
    .pipe(
      map((response) => {
        const ITEMS = (response?.datos || []).flat();
           return {
          ...response,
          datos: ITEMS.map((item): HistorialInspeccionFisica => ({
            numeroPartidaMercancia: String(item.numero_partida_mercancia),
            fraccionArancelaria: String(item.fraccion_arancelaria),
            nico: String(item.clave_nico),
            cantidadUmt: String(item.cantidad_umt),
            cantidadInspeccion: String(item.cantidad_inspeccion),
            saldoPendiente: String(item.saldo_pendiente),
            fechaInspeccionString: item.fecha_inspeccion_string
          })),
        };
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene los datos de la tabla de solicitudes desde la API.
 *
 * Este método realiza una solicitud HTTP GET al endpoint correspondiente y
 * utiliza los encabezados definidos en `getApiHeaders()` para la autenticación.
 *
 * Los datos recibidos desde la API (`SolicitudApi`) se transforman al formato
 * interno de la aplicación (`Solicitud`).
 *
 * En caso de error, se captura la excepción y se devuelve un arreglo con el error.
 *
 * @returns {Observable<Solicitud[]>} Un observable con la lista de solicitudes.
 */
getTablaSolicitud(): Observable<ApiResponse<Solicitud>> {
  const ENDPOINT = `${this.host}${API_GET_SOLICITUDES('220501')}`;

  return this.http
    .get<ApiResponse<SolicitudApi>>(
      ENDPOINT,
      { headers: RevisionService.getApiHeaders() }
    )
    .pipe(
      map((response) => ({
        ...response,
        datos: response.datos.map((item): Solicitud => ({
          id_solicitud: item.id_solicitud,
          fechaCreacion: item.fecha_creation,
          mercancia: item.mercancia,
          cantidad: item.cantidad,
          proovedor: item.proveedor
        })),
      })),
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Endpoint para generar la cadena original de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param idSolicitud - Identificador de la solicitud.
 * @param payload - Datos requeridos para la generación de la cadena original.
 * @returns Observable con la cadena original generada.
 */
generaCadenaOriginal(
  TRAMITE: string,
  idSolicitud: string,
  payload: CadenaOriginalRequest
): Observable<CadenaOriginalResponse> {

  const ENDPOINT = API_GENERA_CADENA_ORIGINAL(TRAMITE, idSolicitud);
  const FULL_URL = `${this.host}${ENDPOINT}`;

  return this.http.post<CadenaOriginalResponse>(
    FULL_URL,
    payload,
    { headers: RevisionService.getApiHeaders() }
  ).pipe(
    catchError(error => {
      return throwError(() => error);
    })
  );
}

/**
 * Envía la firma de una solicitud al endpoint correspondiente.
 *
 * @param datos - Objeto con la información necesaria para firmar la solicitud.
 * @returns Observable con la respuesta del servidor (`IniciarResponse`).
 */
firmaDatos(datos: FirmaDatosRequest ): Observable<IniciarResponse> {
  const FULL_URL = `${this.host}${API_FIRMAR_SOLICITUD('220501')}`;
  return this.http.post<IniciarResponse>(
    FULL_URL,
    datos,
    { headers: RevisionService.getApiHeaders() }
  );
}
}

