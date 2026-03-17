import {
  Destinatario,
  Exportador,
  PagoDeDerechos,
} from '../models/pago-de-derechos.model';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import {
  Solicitud220502State,
  Solicitud220502Store,
} from '../estados/tramites220502.store';


import { API_FIRMAR_SOLICITUD, API_GENERA_CADENA_ORIGINAL, API_GET_ADUANA_INGRESO,API_GET_CERTIFICADOS_PENDIENTES, API_GET_CERTIFICADO_DATOS, API_GET_DATOS_GENERALES_REVISION, API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL, API_GET_DATOS_MERCANCIA, API_GET_HISTORIAL_INSPECCION_FISICA, API_GET_HORAS_INSPECCION, API_GET_JUSTIFICACION, API_GET_MEDIO_TRANSPORTE, API_GET_OFICINAS_INSPECCION_SANIDAD, API_GET_PAGO_DERECHOS_REVISION, API_GET_PUNTOS_INSPECCION, API_GET_PUNTO_VERIFICACION_FEDERAL, API_GET_REGIMENES, API_GET_SOLICITUDES, API_GET_TERCEROS, API_GET_TIPO_CONTENEDOR, API_GUARDAR_INSPECCION_FISICA_SAGARPA, API_HISTORIAL_CARROS_FERROCARRIL, API_INICIAR_INSPECCION_FISICA } from '../../../core/server/api-router';
import { CadenaOriginalRequest, CadenaOriginalResponse, CargarDatosIniciales, DatosGeneralesRevision, HistorialCarrosFerroResponse, HistorialInspeccionFisica, HistorialInspeccionFisicaApiResponse, IniciarResponse, InspeccionFisicaResponse, MercanciaApiResponse, MercanciaRevisionApiResponse, PagoDerechosResponse, PuntoInspeccion, Solicitud, SolicitudApi, SolicitudDatos } from '../models/solicitud-pantallas.model';

import { DatosDeLaSolicitud } from '../models/solicitud-pantallas.model';
import { DatosDelTramiteRealizar } from '../models/solicitud-pantallas.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { ApiResponse, Catalogo, ENVIRONMENT, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { MercanciasLista, RegistroTomaMuestrasMercanciasDatos } from '../models/datos-generales.model';
import { InspeccionFisicaPayload } from '../models/solicitud-pantallas.model';
import { MercanciaTabla } from '../models/medio-transporte.model';
import { Solicitud220501Store } from '../../220501/estados/tramites220501.store';
import { Solicitud220502Query } from '../estados/tramites220502.query';



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

/** Servicio para obtener los datos de la solicitud */
@Injectable({
  providedIn: 'root',
})


/** Servicio para obtener los datos de la solicitud */
export class SolicitudPantallasService {
  /** URL para obtener los datos de la solicitud */
  private dataUrl = 'assets/json/220502/solicitud-pantallas-mock-data.json';

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

  /** Constructor para inyectar el servicio HttpClient */
  constructor(
    public http: HttpClient,
    private solicitud220502Store: Solicitud220502Store,
    private solicitud220502Query: Solicitud220502Query,
     private solicitud220501Store: Solicitud220501Store,
  ) {
    this.host = ENVIRONMENT.API_HOST;
    /** Llamar al método para obtener los datos */
    this.getData();
  }

  /** Método para obtener los datos de la solicitud
   * @returns Observable<CargarDatosIniciales>
   */
  getData(): Observable<CargarDatosIniciales> {
    return this.http.get<CargarDatosIniciales>(this.dataUrl).pipe();
  }

  /** Método para obtener los datos de la solicitud
   * @returns Observable<DatosDelTramiteRealizar>
   */
  getDataDatosDelTramite(): Observable<DatosDelTramiteRealizar> {
    return this.http.get<DatosDelTramiteRealizar>(this.dataUrl).pipe();
  }

  /** 
 * Obtiene la lista de responsables de inspección desde el backend.
 * Retorna el catálogo contenido en `datos` o el error en caso de fallo.
 */

  getDataResponsableInspeccion(procedimiento:string): Observable<Catalogo[]> {
  const ENDPOINT = `${this.host}${API_GET_TIPO_CONTENEDOR(procedimiento)}`;

  return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
    .pipe(
      map(response => response.datos),
      catchError(error => {
        return of([error]);
      })
    );
}

  /**
   * Obtiene los datos iniciales de la solicitud desde un archivo JSON local.
   *
   * @returns Un observable que emite los datos de la solicitud.
   */
  getDatosDeLaSolicitud(): Observable<DatosDeLaSolicitud> {
    return this.http
      .get<DatosDeLaSolicitud>('assets/json/220502/datos-de-la-solicitud.json')
      .pipe();
  }

  /**
   * Actualiza el estado del formulario en el store con los datos recibidos.
   *
   * @param datos - Objeto que contiene la información de la solicitud.
   */
  actualizarEstadoFormulario(datos: DatosDeLaSolicitud): void {
    this.solicitud220502Store.setCertificadosAutorizados(
      datos.certificadosAutorizados
    );
    this.solicitud220502Store.setHoraDeInspeccion(datos.horaDeInspeccion);
    this.solicitud220502Store.setAduanaDeIngreso(datos.aduanaDeIngreso);
    this.solicitud220502Store.setSanidadAgropecuaria(datos.sanidadAgropecuaria);
    this.solicitud220502Store.setPuntoDeInspeccion(datos.puntoDeInspeccion);
    this.solicitud220502Store.setFechaDeInspeccion(datos.fechaDeInspeccion);
    this.solicitud220502Store.setNombre(datos.nombre);
    this.solicitud220502Store.setPrimerapellido(datos.primerapellido);
    this.solicitud220502Store.setSegundoapellido(datos.segundoapellido);
    this.solicitud220502Store.setMercancia(datos.mercancia);
    this.solicitud220502Store.setTipocontenedor(datos.tipocontenedor);
    this.solicitud220502Store.setTransporteIdMedio(datos.transporteIdMedio);
    this.solicitud220502Store.setIdentificacionTransporte(
      datos.identificacionTransporte
    );
    this.solicitud220502Store.setTotalDeGuiasAmparadas(
      datos.totalDeGuiasAmparadas
    );
    this.solicitud220502Store.setEsSolicitudFerros(datos.esSolicitudFerros);
    this.solicitud220502Store.setFoliodel(datos.foliodel);
    this.solicitud220502Store.setAduanaDeIngreso(datos.aduanaDeIngreso);
    this.solicitud220502Store.setSanidadAgropecuaria(datos.sanidadAgropecuaria);
    this.solicitud220502Store.setPuntoInspeccion(datos.puntoInspeccion);
    this.solicitud220502Store.setNumeroguia(datos.numeroguia);
    this.solicitud220502Store.setRegimen(datos.regimen);
    this.solicitud220502Store.setFerrocarril(datos.ferrocarril);
    this.solicitud220502Store.setMovilizacion(datos.movilizacion);
    this.solicitud220502Store.setIdentificacionTransporte(
      datos.identificacionTransporte
    );
    this.solicitud220502Store.setPunto(datos.punto);
    this.solicitud220502Store.setNombreEmpresa(datos.nombreEmpresa);
    this.solicitud220502Store.setExentoPagoNo(datos.exentoPagoNo);
    this.solicitud220502Store.setJustificacion(datos.justificacion);
    this.solicitud220502Store.setClaveReferencia(datos.claveReferencia);
    this.solicitud220502Store.setCadenaDependencia(datos.cadenaDependencia);
    this.solicitud220502Store.setBanco(datos.banco);
    this.solicitud220502Store.setIlavePago(datos.llavePago);
    this.solicitud220502Store.setFetchaPago(datos.fetchapago);
    this.solicitud220502Store.setImportePago(datos.importePago);
    this.solicitud220502Store.setAduanaIngreso(datos.aduanaIngreso);
    this.solicitud220502Store.setOficinaInspeccion(datos.oficinaInspeccion);
  }

  /**
   * Método para obtener los datos de registro de toma de muestras de mercancías.
   * @returns Observable con los datos del registro de toma de muestras de mercancías.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<RegistroTomaMuestrasMercanciasDatos> {
    return this.http.get<RegistroTomaMuestrasMercanciasDatos>(
      'assets/json/220502/registro_toma_muestras_mercancias.json'
    );
  }

  /**
   * Obtiene los datos de la tabla de exportadores.
   *
   * @returns {Observable<Exportador[]>} - Lista de exportadores.
   */
  obtenerTablaExportador(): Observable<ApiResponse<Exportador>> {
     const SOLICTIUDE_ID= this.solicitud220502Query.getValue().id_solicitud ;
    return this.http
      .get<ApiResponse<Exportador>>(`${this.host}${API_GET_TERCEROS('220502',SOLICTIUDE_ID)}`,{params: {tipoTercero: 'EXP'}, headers: SolicitudPantallasService.getApiHeaders()})
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
    const SOLICTIUDE_ID= this.solicitud220502Query.getValue().id_solicitud ;
    return this.http
      .get<ApiResponse<Destinatario>>(`${this.host}${API_GET_TERCEROS('220502',SOLICTIUDE_ID)}`,{params: {tipoTercero: 'DES'}, headers: SolicitudPantallasService.getApiHeaders()})
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene los datos de la aduana de ingreso.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la aduana de ingreso.
   */
  getAduanaIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/aduana-ingreso.json'
    );
  }

  /**
   * Obtiene los datos de la oficina de inspección.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la oficina de inspección.
   */
  getOficianaInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/oficiana-de-inspeccion.json'
    );
  }

  /**
   * Obtiene los datos del punto de inspección.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de inspección.
   */
  getPuntoInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/punto-de-inspeccion.json'
    );
  }

  /**
   * Obtiene los datos del establecimiento.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del establecimiento.
   */
  getEstablecimiento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/establecimiento.json'
    );
  }

  /**
   * Obtiene los datos del régimen al que se destinarán las mercancías.
   *
   * @returns {Observable<Catalogo>} - Los datos del régimen.
   */
getRegimenDestinaran(): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_REGIMENES('220502')}`,
      { headers: SolicitudPantallasService.getApiHeaders() }
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
  getMovilizacionNacional(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/movilizacion-nacional.json'
    );
  }

  

  /**
   * Obtiene los datos del punto de verificación.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de verificación.
   */
getPuntoVerificacion(): Observable<Catalogo[]> {
  const ENDPOINT = `${this.host}${API_GET_PUNTO_VERIFICACION_FEDERAL('220502')}`;

  return this.http.get<ApiResponse<Catalogo[]>>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
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
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220502/empresa-transportista.json'
    );
  }

  /**
   * Obtiene los datos de la justificación.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la justificación.
   */
 
  getJustificacion(): Observable<ApiResponse<Catalogo>> {
  const ENDPOINT = `${this.host}${API_GET_JUSTIFICACION('220502')}`;

  return this.http.get<Catalogo>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
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
    return this.http.get<RespuestaCatalogos>('assets/json/220502/banco.json');
  }

  /**
   * Servicio para obtener datos relacionados con la solicitud.
   */
  getPagoDeDerechos(): Observable<PagoDeDerechos> {
    /** Obtiene la información del pago de derechos desde un archivo JSON. */
    return this.http.get<PagoDeDerechos>(
      'assets/json/220502/pago-de-derechos.json'
    );
  }

  /**
   * Servicio para obtener los datos generales de la solicitud.
   */
  getDatosDelaSolicitud(): Observable<Solicitud220502State> {
    /** Obtiene los datos de la solicitud desde un archivo JSON. */
    return this.http.get<Solicitud220502State>(
      'assets/json/220502/datos-dela-solicitud.json'
    );
  }

/**
   * Obtiene la lista de certificados autorizados pendientes desde el servicio de la API.
   *
   * Este método realiza una solicitud HTTP GET al endpoint correspondiente para recuperar
   * los certificados que aún no han sido procesados o finalizados. Los encabezados necesarios
   * para la autenticación o identificación del usuario se agregan mediante el método estático
   * `getApiHeaders()`.
   *
   * En caso de error en la llamada, se captura la excepción y se devuelve un arreglo vacío,
   * registrando el error en la consola.
   *
   * @returns {Observable<Catalogo[]>} Un observable que emite la lista de certificados pendientes.
   */

    getCertificadosPendientes(procedimiento:string): Observable<Catalogo[]> {
      const ENDPOINT = `${this.host}${API_GET_CERTIFICADOS_PENDIENTES(procedimiento)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
        return of([error]);
        })
      );
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
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
          return of([error]);
        })
      );
  }

 /**
   * Obtiene las horas de inspección desde el catálogo de la API.
   *
   * Este método realiza una solicitud HTTP GET al endpoint correspondiente,
   * utilizando los encabezados definidos en `getApiHeaders()` para la autenticación.
   *
   * En caso de error, captura la excepción y devuelve un arreglo vacío,
   * registrando el error en la consola.
   *
   * @returns {Observable<Catalogo[]>} Un observable con la lista de horas de inspección.
   */

    getHoraDeInspeccion(procedimiento:string): Observable<Catalogo[]> {
      const ENDPOINT = `${this.host}${API_GET_HORAS_INSPECCION(procedimiento)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of([error]);
        })
      );
  }
/**
 * Obtiene los certificados autorizados asociados a una clave específica desde la API.
 *
 * Este método realiza una solicitud HTTP GET al endpoint correspondiente, utilizando
 * los encabezados definidos en `getApiHeaders()` para la autenticación.
 *
 * @param {string} clave La clave del certificado para consultar los datos.
 * @returns {Observable<Catalogo[]>} Un observable con la lista de certificados autorizados.
 *
 * En caso de error, se captura la excepción y se devuelve un arreglo con el error.
 */
  onCertificadosAutorizadosChange(clave:string,procedimiento:string): Observable<PuntoInspeccion> {
     const ENDPOINT = `${this.host}${API_GET_CERTIFICADO_DATOS(procedimiento,clave)}`;
    return this.http.get<ApiResponse<PuntoInspeccion>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of(error);
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
getTablaSolicitud(procedimento:string): Observable<ApiResponse<Solicitud>> {
  const ENDPOINT = `${this.host}${API_GET_SOLICITUDES(procedimento)}`;

  return this.http
    .get<ApiResponse<SolicitudApi>>(
      ENDPOINT,
      { headers: SolicitudPantallasService.getApiHeaders() }
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

   getOficinaInspeccionSanidadAgropecuaria(clave:string,procedimiento:string): Observable<Catalogo[]> {
     const ENDPOINT = `${this.host}${API_GET_OFICINAS_INSPECCION_SANIDAD(procedimiento,clave)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of(error);
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
     getMediosDeTransporte(procedimento:string): Observable<Catalogo[]> {
      const ENDPOINT = `${this.host}${API_GET_MEDIO_TRANSPORTE(procedimento)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        map(response => response.datos),
        catchError(error => {
           return of([error]);
        })
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
getDatosMercancia(certificado: string,procedimento:string): Observable<ApiResponse<MercanciaTabla>> {
  const ENDPOINT = `${this.host}${API_GET_DATOS_MERCANCIA(procedimento, certificado)}`;

  return this.http
    .get<ApiResponse<MercanciaApiResponse[]>>(ENDPOINT, {
      headers: SolicitudPantallasService.getApiHeaders(),
    })
    .pipe(
      map((response) => {
        const DATOS: MercanciaApiResponse[] = (response?.datos || []).flat();
return {
  ...response,
  datos: DATOS.map((item): MercanciaTabla => ({
  // Todos los campos backend con tipos garantizados
    id_solicitud: Number(item.id_solicitud),
    fraccion_arancelaria: item.fraccion_arancelaria ?? "",
    descripcion_de_la_fraccion: item.descripcion_de_la_fraccion ?? "",
    nico: item.nico ?? "",
    descripcion_nico: item.descripcion_nico ?? "",
    cant_soli_umt: Number(item.cant_soli_umt ?? 0),
    uni_medida_tar: item.uni_medida_tar ?? "",
    cant_total_umt: Number(item.cant_total_umt ?? 0),
    num_permiso_importacion: item.num_permiso_importacion ?? "",
    id_mercancia_gob: Number(item.id_mercancia_gob ?? 0),
    numero_partida: Number(item.numero_partida ?? 0),
    saldo_pendiente: Number(item.saldo_pendiente ?? 0),
// Campos mapeados por UI (opcional)
    fraccionArancelaria: item.fraccion_arancelaria,
    descripcionFraccion: item.descripcion_de_la_fraccion,
    descripcion: item.descripcion_nico,
    unidaddeMedidaDeUMT: item.uni_medida_tar,
    cantidadTotalUMT: Number(item.cant_total_umt ?? 0),
    saldoPendiente: Number(item.saldo_pendiente ?? 0),
    saldoACapturar: String(item.cant_soli_umt ?? 0),
  })),
};
      }),
      catchError((error) => {
        return throwError(() => error);
      })
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
getHistorialInspeccionFisica(certificado: string,procedimento:string): Observable<ApiResponse<HistorialInspeccionFisica>> {
  const ENDPOINT = `${this.host}${API_GET_HISTORIAL_INSPECCION_FISICA(procedimento, certificado)}`;
    return this.http
    .get<ApiResponse<HistorialInspeccionFisicaApiResponse[]>>(ENDPOINT, {
      headers: SolicitudPantallasService.getApiHeaders(),
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
getPuntosInspeccion(clave: string,procedimiento:string): Observable<Catalogo[]> {
  const ENDPOINT = `${this.host}${API_GET_PUNTOS_INSPECCION(procedimiento, clave)}`;
    return this.http.get<ApiResponse<Catalogo>>(ENDPOINT, { 
    headers: SolicitudPantallasService.getApiHeaders()
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
  const ENDPOINT = `${this.host}${API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL('220502', certificado)}`;
   return this.http
    .get<ApiResponse<MercanciaRevisionApiResponse[]>>(ENDPOINT, {
      headers: SolicitudPantallasService.getApiHeaders(),
    })
    .pipe(
      map((response) => {
        const DATOS = (response?.datos || []).flat();
       return {
          ...response,
          datos: DATOS.map((item): MercanciasLista => ({
             partida: String(item.numero_partida),
      tiporequisito: item.tipo_requisito,
      requisito: item.requisito,
      certificado: Number(certificado),
      fraccion: item.fraccion_arancelaria,
      fracciondescripcion: item.desc_de_la_frac,
      nicod: item.nico,
      nicodescripcion: item.descripcion_nico,
      descripcion: item.descripcion_nico,
      umt: item.unidad_medida_tarifa??'',
      cantidadumt: Number(item.cantidad_umt),
      umc: item.unidad_medida_comercial??'',
      cantidadumc: item.cantidad_umc??0,
      uso: item.uso??'',
      tipodeproducto: item.numero_lote??'',
      paisorigen: item.pais_origen??'',
      paisprocedencia: item.pais_procedencia??'',

      certificadoInternacionalElectronico: item.num_cert_intern
          })),
        };
      }),
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
  const ENDPOINT = `${this.host}${API_GET_DATOS_GENERALES_REVISION('220502', certificado)}`;
  return this.http.get<ApiResponse<DatosGeneralesRevision >>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
  })
  .pipe(
    map(response => response.datos),
    catchError(error => of(error))
  );
}
/**
 * Obtiene los datos del pago de derechos.
 *
 * @returns {Observable<PagoDerechos >} - Los datos del pago de derechos.
 */
getPagoDerechos(CERTIFICADO: string): Observable<PagoDerechosResponse> {
  const ENDPOINT = `${this.host}${API_GET_PAGO_DERECHOS_REVISION('220502', CERTIFICADO)}`;
  return this.http.get<PagoDerechosResponse>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}
/**
 * Inicia la inspección física de una solicitud prellenada.
 *
 * @param idSolicitudPrellenado - Identificador de la solicitud prellenada.
 * @returns {Observable<any>} - Respuesta de la API.
 */
iniciarInspeccionFisica(idSolicitudPrellenado: number | string,procedimiento:string): Observable<InspeccionFisicaResponse> {
  const ENDPOINT = `${this.host}${API_INICIAR_INSPECCION_FISICA(procedimiento, idSolicitudPrellenado)}`;
   return this.http.get<InspeccionFisicaResponse>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}
/**
 * Ejecutada cuando el usuario hace doble clic sobre un registro.
 * Esta función actualiza en el store el estado del formulario
 * y la información asociada al certificado seleccionado, permitiendo
 * reflejar sus datos en pantalla y continuar el flujo de trabajo.
 */

actualizarEstadoFormularioDobleClick(procedimento: number, datos: SolicitudDatos): void {
  // -------------------------------
  // Procedimiento 220502
  // -------------------------------
  if (procedimento === 220502) {
    this.solicitud220502Store.setCertificadosAutorizados(datos?.certificado);
    this.solicitud220502Store.setNombre(datos?.persona_inspeccion?.nombre ?? '');
    this.solicitud220502Store.setPrimerapellido(datos?.persona_inspeccion?.primer_apellido ?? '');
    this.solicitud220502Store.setSegundoapellido(datos?.persona_inspeccion?.segundo_apellido ?? '');
    this.solicitud220502Store.setMercancia(String(datos?.cant_de_contenedores ?? ''));
    this.solicitud220502Store.setTipocontenedor(datos?.clave_contendor ?? '');
    this.solicitud220502Store.setHoraDeInspeccion(datos?.hora_inspeccion);
    this.solicitud220502Store.setTransporteIdMedio(datos?.datos_certificado?.medio_de_transporte ?? '');
    this.solicitud220502Store.setIdentificacionTransporte(datos?.datos_certificado?.ident_de_transporte ?? '');
    this.solicitud220502Store.setFechaInspeccion(datos?.fecha_inspeccion ?? "");
  }

  // -------------------------------
  // Procedimiento 220501
  // -------------------------------
  if (procedimento === 220501) {
    this.solicitud220501Store.setCertificadosAutorizados(datos?.certificado);
    this.solicitud220501Store.setNombre(datos?.persona_inspeccion?.nombre ?? '');
    this.solicitud220501Store.setPrimerapellido(datos?.persona_inspeccion?.primer_apellido ?? '');
    this.solicitud220501Store.setSegundoapellido(datos?.persona_inspeccion?.segundo_apellido ?? '');
    this.solicitud220501Store.setMercancia(String(datos?.cant_de_contenedores ?? ''));
    this.solicitud220501Store.setTipocontenedor(datos?.clave_contendor ?? '');
    this.solicitud220501Store.setHoraDeInspeccion(datos?.hora_inspeccion);
    this.solicitud220501Store.setTransporteIdMedio(datos?.datos_certificado?.medio_de_transporte ?? '');
    this.solicitud220501Store.setIdentificacionTransporte(datos?.datos_certificado?.ident_de_transporte ?? '');
    this.solicitud220501Store.setFechaInspeccion(datos?.fecha_inspeccion ?? "");
  }
}

/**
   * Guarda los datos del trámite de inspección física.
   * @param payload - Datos del trámite.
   * @returns Observable con la respuesta de la API.
   */
  guardarInspeccionFisicaSagarpa(payload: InspeccionFisicaPayload): Observable<InspeccionFisicaResponse> { 
    const ENDPOINT = `${this.host}${API_GUARDAR_INSPECCION_FISICA_SAGARPA('220502')}`;
    return this.http.post<InspeccionFisicaResponse>(ENDPOINT, payload, { headers: SolicitudPantallasService.getApiHeaders() })
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

 /**
 * Obtiene el historial de carros ferrocarril de un certificado.
 *
 * @param certificado - Número del certificado.
 * @returns {Observable<any>} - Respuesta de la API.
 */
obtenerHistorialCarrosFerrocarri(certificado: number | string,procedimento:string): Observable<ApiResponse<HistorialCarrosFerroResponse >> {
  const ENDPOINT = `${this.host}${API_HISTORIAL_CARROS_FERROCARRIL(procedimento, certificado)}`;
  
  return this.http.get<ApiResponse<HistorialCarrosFerroResponse >>(ENDPOINT, {
    headers: SolicitudPantallasService.getApiHeaders()
  })
  .pipe(
    map(response => response),
    catchError(error => of(error))
  );
}
/**
 * Envía la firma de una solicitud al endpoint correspondiente.
 *
 * @param datos - Objeto con la información necesaria para firmar la solicitud.
 * @returns Observable con la respuesta del servidor (`IniciarResponse`).
 */
firmaDatos(datos: FirmaDatosRequest ): Observable<IniciarResponse> {
  const FULL_URL = `${this.host}${API_FIRMAR_SOLICITUD('220502')}`;
  return this.http.post<IniciarResponse>(
    FULL_URL,
    datos,
    { headers: SolicitudPantallasService.getApiHeaders() }
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

  const ENDPOINT = `${this.host}${API_GENERA_CADENA_ORIGINAL(TRAMITE, idSolicitud)}`;

  return this.http.post<CadenaOriginalResponse>(
    ENDPOINT,
    payload,
    { headers: SolicitudPantallasService.getApiHeaders() }
  ).pipe(
    catchError(error => {
      return throwError(() => error);
    })
  );
}

}
