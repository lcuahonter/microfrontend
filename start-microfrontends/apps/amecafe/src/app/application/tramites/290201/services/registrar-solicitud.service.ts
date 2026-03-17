import { API_FIRMAR_CERTIFICADO, API_GENERAR_CADENA_ORIGINAL, API_GET_CATALOGO_ADUANAS, API_GET_CATALOGO_CALIDAD_POR_TIPO, API_GET_CATALOGO_CERTIFICACIONES_POR_PROCESO, API_GET_CATALOGO_CICLO_CAFE, API_GET_CATALOGO_ENTIDAD, API_GET_CATALOGO_ENVASADO, API_GET_CATALOGO_FORMAS, API_GET_CATALOGO_FRACCION_ARANCELARIA_AMECAFE, API_GET_CATALOGO_MONEDA_SEDENA, API_GET_CATALOGO_PAISES, API_GET_CATALOGO_PROCESOS_POR_CALIDAD, API_GET_CATALOGO_TIPOS_POR_FORMA, API_GET_CATALOGO_TRANSPORTE, API_GET_CATALOGO_UNIDAD, API_GET_ULTIMAS_SOLICITUDES, API_GUARDAR_DATOS_CAFE, API_INICIAR_SOLICITUD } from '../../../core/server/api-router';
import { Observable,catchError, throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApiResponse, Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { GuadarResponse, SolicitudResponse } from '../models/fila-model';
import { Injectable } from '@angular/core';
import { Solicitud } from '../models/tabla-model';

import { Solicitud290201State, Solicitud290201Store } from '../../../estados/tramites/tramites290201.store';
import { CadenaOriginalRequest } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';

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
      contenido?: string; 
    };
  };
}
/** Respuesta que contiene la cadena original generada para el trámite. */
export interface CadenaOriginalResponse {
  codigo: string;   
  mensaje: string;   
  datos: string;      
}
export interface DocumentoRequerido {
  id_documento_seleccionado?: number;
}

export interface AbnRequest {
  num_folio_tramite?: string;
  documento_requerido?: DocumentoRequerido[];
}
/**
 * Payload para guardar o actualizar una solicitud de café.
 * Incluye datos generales del trámite, lotes y terceros relacionados.
 */
interface PayloadGuardarCafe {
  /** Identificador de la solicitud (nulo para nueva solicitud) */
  id_solicitud: number | null;

  /** Formas de presentación del café */
  formas_cafe: string;

  /** Tipos de café */
  tipos_cafe: string;

  /** Calidad del café */
  calidad_cafe: string;

  /** Procesos aplicados al café */
  procesos_cafe: string;

  /** Certificaciones del café */
  certificaciones_cafe: string;

  /** Clave de la aduana */
  clave_aduana: string;

  /** País de procedencia */
  pais_procedencia: string;

  /** Entidades asociadas a la solicitud */
  entidades_solicitud: string;

  /** Descripción genérica adicional */
  descripcion_generica1: string;

  /** Lista de lotes del café */
  lote: LotePayload[];

  /** Lista de terceros relacionados */
  terceros: TerceroPayload[];
}
/**
 * Payload que representa un lote de café dentro de la solicitud.
 */
interface LotePayload {
  /** Identificador de la mercancía */
  id_mercancia: number | null;

  /** Número de lote */
  numero_lote: string | null;

  /** Cantidad en unidad de medida comercial */
  cantidad_umc: string | null;

  /** Unidad de medida comercial */
  unidad_medida_comercial: string | null;

  /** Importe total del componente */
  importe_total_componente: string | null;

  /** Moneda del importe */
  moneda: string | null;

  /** Descripción de la mercancía */
  descripcion_mercancia: string;

  /** Indicador booleano genérico */
  boolean_generico1: boolean;

  /** Fecha de salida del lote */
  fecha_salida: string | null;

  /** Condición secundaria de almacenamiento */
  condicion_almacenamiento_secundario: string | null;

  /** Campo genérico adicional */
  generica2: string | null;

  /** Marcas de embarque */
  marcas_embarque: string | null;

  /** Descripción del tratamiento aplicado */
  descripcion_tratamiento: string | null;

  /** Indica si el lote fue aceptado */
  aceptada: boolean;

  /** Cantidad en la presentación */
  cantidad_presentacion: string | null;

  /** Número de oficio para casos especiales */
  numero_oficio_caso_especial: string | null;

  /** Condición primaria de almacenamiento */
  condicion_almacenamiento_primario: string | null;

  /** Otras especificaciones del producto */
  descripcion_otras_especificaciones: string | null;

  /** Identificador de fracción arancelaria */
  id_fraccion_gob: string | null;

  /** Campo genérico */
  generica1: string | null;

  /** Lista de detalles o marcas asociadas */
  detalles_marca: string[];
}

/**
 * Payload que representa a un tercero relacionado con la solicitud.
 */
interface TerceroPayload {
  /** Identificador del tercero */
  id_tercero: number | null;

  /** Tipo de tercero */
  tipo_tercero: string;

  /** RFC del tercero */
  rfc: string | null;

  /** Nombre del tercero */
  nombre: string | null;

  /** Apellido paterno */
  apellido_paterno: string | null;

  /** Apellido materno */
  apellido_materno: string | null;

  /** Correo electrónico */
  correo_electronico: string | null;

  /** Teléfono de contacto */
  telefono: string | null;

  /** Indicador de persona moral */
  persona_moral: boolean | null;

  /** Indicador de persona física no contribuyente */
  fisica_no_contribuyente: boolean | null;

  /** Indicador de extranjero */
  extranjero: boolean | null;

  /** Denominación (persona moral) */
  denominacion: string | null;

  /** Razón social */
  razon_social: string | null;

  /** CURP */
  curp: string | null;

  /** Calle del domicilio */
  calle: string | null;

  /** Número interior */
  numero_interior: string | null;

  /** Número exterior */
  numero_exterior: string | null;

  /** Información adicional del domicilio */
  informacion_extra: string | null;

  /** Código postal */
  codigo_postal: string | null;

  /** Clave de colonia */
  col_clave: string | null;

  /** Clave de delegación o municipio */
  deleg_mun_clave: string | null;

  /** Clave de localidad */
  loc_clave: string | null;

  /** Clave de entidad federativa */
  entidad_clave: string | null;

  /** Clave del país */
  pais_clave: string | null;
}
export interface FirmaDatosRequest {
/** Identificador de la solicitud que se va a firmar */
  id_solicitud: number | string;

  /** Cadena original que se va a firmar */
  cadena_original: string;

  /** Número de serie del certificado digital */
  cert_serial_number: string;

  /** Sello generado por la firma digital */
  sello: string;

  /** Número de autorización generado por la dependencia (opcional) */
  num_autorizacion?: string;

  /** Lista de documentos requeridos asociados a la firma */
  documentos_requeridos: DocumentoRequerido[];
}


@Injectable({
  providedIn: 'root'
})

export class RegistrarSolicitudService {
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
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, private solicitud290201Store: Solicitud290201Store) {
    this.host = ENVIRONMENT.API_HOST;
  }
  actualizarEstadoFormulario(DATOS: Solicitud290201State): void {
     this.solicitud290201Store.setFormasDelCafe(DATOS.formasdelcafe);
     this.solicitud290201Store.setTipos(DATOS.tipos);
     this.solicitud290201Store.setCalidad(DATOS.calidad);
     this.solicitud290201Store.setProcesos(DATOS.procesos);
     this.solicitud290201Store.setNombredeagencia(DATOS.nombredeagencia);
     this.solicitud290201Store.setCertifications(DATOS.certifications);
     this.solicitud290201Store.setAdunadesalida(DATOS.adunadesalida);
     this.solicitud290201Store.setPaisdestino(DATOS.paisdestino);
     this.solicitud290201Store.setEntidaddeprocedencia(DATOS.entidaddeprocedencia);
     this.solicitud290201Store.setCiclocafetalero(DATOS.ciclocafetalero);
     this.solicitud290201Store.setEnvasadoen(DATOS.envasadoen);
     this.solicitud290201Store.setUtilizoCafeComo(DATOS.utilizoCafeComo);
     this.solicitud290201Store.setCantidadutilizada(DATOS.cantidadutilizada);
     this.solicitud290201Store.setNumerodepedimento(DATOS.numerodepedimento);
     this.solicitud290201Store.setPaisdeimportacion(DATOS.paisdeimportacion);
     this.solicitud290201Store.setFraccionarancelaria(DATOS.fraccionarancelaria);
     this.solicitud290201Store.setCantidad(DATOS.cantidad);
     this.solicitud290201Store.setUnidaddemedida(DATOS.unidaddemedida);
     this.solicitud290201Store.setPrecioapplicable(DATOS.precioapplicable);
     this.solicitud290201Store.setDolar(DATOS.dolar);
     this.solicitud290201Store.setLote(DATOS.lote);
     this.solicitud290201Store.setOtrasmarcas(DATOS.otrasmarcas);
     this.solicitud290201Store.setElcafe(DATOS.elcafe);
     this.solicitud290201Store.setFechaexportacion(DATOS.fechaexportacion);
     this.solicitud290201Store.setPaisdetransbordo(DATOS.paisdetransbordo);
     this.solicitud290201Store.setMediodetransporte(DATOS.mediodetransporte);
     this.solicitud290201Store.setIdentificadordel(DATOS.Identificadordel);
     this.solicitud290201Store.setObservaciones(DATOS.observaciones);
     this.solicitud290201Store.setTipoPersona(DATOS.tipoPersona);
     this.solicitud290201Store.setDenominacion(DATOS.denominacion);
     this.solicitud290201Store.setDomicilio(DATOS.domicilio);
     this.solicitud290201Store.setPais(DATOS.pais);
     this.solicitud290201Store.setCodigopostal(DATOS.codigopostal);
     this.solicitud290201Store.setTelefono(DATOS.telefono);
     this.solicitud290201Store.setCorreoelectronico(DATOS.correoelectronico);

  }

  /**
   * Obtiene los datos de tipos.
   * @returns Observable con los datos del catálogo de tipos.
   */
getTiposData(
  tramite: string,
  claveForma: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_TIPOS_POR_FORMA(tramite, claveForma)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos de formas del café.
   * @returns Observable con los datos del catálogo de formas del café.
   */

  getFormasdelcafeData(tramite: string): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_FORMAS(tramite)}`,
      {
       
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos de calidad.
   * @returns Observable con los datos del catálogo de calidad.
   */
getCalidadData(
  tramite: string,
  claveTipos: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_CALIDAD_POR_TIPO(tramite, claveTipos)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos de procesos.
   * @returns Observable con los datos del catálogo de procesos.
   */
getProcesosData(
  tramite: string,
  claveCalidad: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_PROCESOS_POR_CALIDAD(tramite, claveCalidad)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos de aduana de salida.
   * @returns Observable con los datos del catálogo de aduana de salida.
   */
getAduanadesalidaData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_ADUANAS(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos de entidad de procedencia.
   * @returns Observable con los datos del catálogo de entidad de procedencia.
   */
 getEntidadDeProcedenciaData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_ENTIDAD(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos del ciclo cafetalero.
   * @returns Observable con los datos del catálogo del ciclo cafetalero.
   */
getCiclocafetaleroData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_CICLO_CAFE(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
   * Obtiene los datos de envasado.
   * @returns Observable con los datos del catálogo de envasado.
   */
getEnvasadoenData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_ENVASADO(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos de uso del café.
   * @returns Observable con los datos del catálogo de uso del café.
   */
  getUtilicoCafeComoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290201/utilizocafecomo.json');
  }

  /**
   * Obtiene los datos del país de importación.
   * @returns Observable con los datos del catálogo de país de importación.
   */
  getPaisDeImportacionData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290201/paisdeimportacion.json');
  }

  /**
   * Obtiene los datos de fracción arancelaria.
   * @returns Observable con los datos del catálogo de fracción arancelaria.
   */
getFraccionArancelariaData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_FRACCION_ARANCELARIA_AMECAFE(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos de unidad de medida.
   * @returns Observable con los datos del catálogo de unidad de medida.
   */
getUnidadDeMedidaData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_UNIDAD(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos del dólar.
   * @returns Observable con los datos del catálogo del dólar.
   */
getDollarData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_MONEDA_SEDENA(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos del medio de transporte.
   * @returns Observable con los datos del catálogo de medio de transporte.
   */
 getMediaDeTransporte(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_TRANSPORTE(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos del país.
   * @returns Observable con los datos del catálogo de país.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('./assets/json/290201/paisdeimportacion.json');
  }

  /**
   * Obtiene los datos de la solicitud.
   * @returns Observable con los datos de la solicitud.
   */
 getSolicitudData(
  tramite: string
): Observable<ApiResponse<Solicitud[]>> {

  return this.http
    .get<ApiResponse<Solicitud[]>>(
      `${this.host}${API_GET_ULTIMAS_SOLICITUDES(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
 * Obtiene los datos del país de destino.
 * @returns Observable con los datos del catálogo de país de destino.
 */
 getPaisDestinoData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_PAISES(tramite)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
 * Obtiene los datos de certificación.
 * @returns Observable con los datos del catálogo de certificación.
 */
 getCertificacionData(
  tramite: string,
  claveProcesos: string
): Observable<ApiResponse<Catalogo>> {

  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_CERTIFICACIONES_POR_PROCESO(tramite, claveProcesos)}`,
      {
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
 * Obtiene los datos de consulta.
 * @returns Observable con los datos de la consulta.
 */
 getConsultaData(): Observable<Solicitud290201State> {
  return this.http.get<Solicitud290201State>('assets/json/290201/consulta.json');
}
/**
 * Obtiene los datos del destinatario.
 * @returns Observable con los datos del destinatario en formato `Solicitud290201State`.
 * @description Realiza una solicitud HTTP para obtener los datos del destinatario desde un archivo JSON.
 */
getDestinatarioData(): Observable<Solicitud290201State> {
  return this.http.get<Solicitud290201State>('assets/json/290201/destinatariodata.json');
}

/**
 * Obtiene los datos de las entidades federativas.
 * 
 * @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas obtenida desde un archivo JSON local.
 */
getEntidadFederativaData(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/290201/domicilio.json');
}

/**
* @method getAlcaldiaMunicipo
* Obtiene los datos de las alcaldías o municipios desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de alcaldías o municipios.
*/
getAlcaldiaMunicipo(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('./assets/json/290201/alcaldio.json');
}

/**
* @method getColonia
* Obtiene los datos de las colonias desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de colonias.
*/
getColonia(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('./assets/json/290201/colonia.json');
}

iniciarSolicitud(
  tramite: string,
  idSolicitudPrellenado?: string
): Observable<SolicitudResponse> {

  return this.http
    .get<SolicitudResponse>(
      `${this.host}${API_INICIAR_SOLICITUD(tramite)}`,
      {
        params: idSolicitudPrellenado
          ? { idSolicitudPrellenado }
          : {},
        headers: RegistrarSolicitudService.getApiHeaders()
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Guarda los datos del trámite 290201 (Café).
 * @param payload - Datos del trámite.
 * @param idTramite - Clave del trámite (ej. '290201')
 * @returns Observable con la respuesta de la API.
 */
guardarDatosCafe(
  payload: PayloadGuardarCafe,
  idTramite: string

): Observable<GuadarResponse<string>> {
  const ENDPOINT = `${this.host}${API_GUARDAR_DATOS_CAFE(idTramite)}`;

  return this.http
 
    .post<GuadarResponse<string>>(ENDPOINT, payload, {
      headers: RegistrarSolicitudService.getApiHeaders(),
    })
    .pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
}
// Método para enviar los datos de la firma al servidor
// Recibe un objeto de tipo FirmaDatosRequest y devuelve un Observable con la respuesta del tipo IniciarResponse
// Realiza una petición POST al endpoint definido en API_FIRMAR, incluyendo los encabezados de la API
/**
 * Envía la firma del certificado de una solicitud.
 *
 * @param datos - Objeto con la información necesaria para firmar el certificado.
 * @returns Observable con la respuesta del servidor.
 */
firmarCertificado(datos: FirmaDatosRequest): Observable<IniciarResponse> {
  const ENDPOINT = `${this.host}${API_FIRMAR_CERTIFICADO('290201')}`;

  return this.http.post<IniciarResponse>(
    ENDPOINT,
    datos,
    {
      headers: RegistrarSolicitudService.getApiHeaders(),
    }
  ).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
}
/**
 * Genera la cadena original de una solicitud.
 *
 * @param TRAMITE - Identificador del trámite.
 * @param idSolicitud - Identificador de la solicitud.
 * @param payload - Datos necesarios para generar la cadena original.
 * @returns Observable con la respuesta de la cadena original.
 */
generaCadenaOriginalSolicitud(
  TRAMITE: string,
  idSolicitud: number | string,
  payload: AbnRequest
): Observable<CadenaOriginalResponse> {

  const ENDPOINT = `${this.host}${API_GENERAR_CADENA_ORIGINAL(TRAMITE, idSolicitud)}`;

  return this.http
    .post<CadenaOriginalResponse>(
      ENDPOINT,
      payload,
      { headers: RegistrarSolicitudService.getApiHeaders() }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

}
