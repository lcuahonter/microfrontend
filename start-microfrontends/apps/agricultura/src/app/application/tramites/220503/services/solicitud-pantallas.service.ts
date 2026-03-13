import { API_FIRMAR_SOLICITUD, API_FIRMAR_SOLICITUD_ACUICOLA, API_GENERA_CADENA_ORIGINAL, API_GET_ADUANA_INGRESO,API_GET_CATALOGO_MEDIO_TRANSPORTE,API_GET_CERTIFICADOS_PENDIENTES, API_GET_CERTIFICADO_DATOS, API_GET_DATOS_MERCANCIA, API_GET_HISTORIAL_INSPECCION_FISICA, API_GET_HORAS_INSPECCION, API_GET_MEDIO_TRANSPORTE, API_GET_OFICINAS_INSPECCION_SANIDAD, API_GET_PUNTOS_INSPECCION, API_GET_PUNTOS_INSPECCION_POR_OISA, API_GET_SOLICITUDES, API_GET_TIPO_CONTENEDOR, API_GUARDAR_SOLICITUD, API_HISTORIAL_CARROS_FERROCARRIL, API_INICIAR_INSPECCION_FISICA, API_INICIAR_SOLICITUD } from '../../../core/server/api-router';
import { ApiResponse, Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { CadenaOriginalRequest, CadenaOriginalResponse, CargarDatosIniciales, HistorialCarrosFerroResponse, HistorialInspeccionFisica, HistorialInspeccionFisicaApiResponse, IniciarResponse, InspeccionFisicaPayload, InspeccionFisicaResponse, TipoContenedor } from '../models/solicitud-pantallas.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatosDelTramiteRealizar } from '../models/solicitud-pantallas.model'

import { Injectable } from '@angular/core';

import { Observable,catchError, map, of, throwError } from 'rxjs';


/**
 * Modelo que representa los datos de ingreso e inspección
 * asociados a un certificado.
 */
export interface CertificadoDatosIngreso {
  /** Código de resultado de la operación */
  codigo: string;

  /** Mensaje descriptivo de la operación */
  mensaje: string;

  /** Datos de ingreso e inspección del certificado */
  datos: {
    /** Clave de la aduana de ingreso */
    aduana_de_ingreso: string;

    /** Clave del punto de inspección */
    punto_de_inspeccion: string;

    /** Clave de la oficina de inspección agropecuaria */
    ofic_de_insp_agro: string;

    /** Clave del medio de transporte */
    medio_de_transporte: string;

    /** Identificador del medio de transporte */
    ident_de_transporte: string;
  };
}
/**
 * Modelo de una solicitud devuelta por el servicio
 */
export interface SolicitudItem {
  /** Identificador único de la solicitud */
  id_solicitud: number;

  /** Fecha de creación de la solicitud */
  fecha_creation: string;

  /** Descripción de la mercancía */
  mercancia: string;

  /** Cantidad solicitada */
  cantidad: number;

  /** Proveedor de la mercancía */
  proveedor: string;
}
/**
 * Modelo de mercancía asociada a una solicitud / certificado.
 */
export interface MercanciaSolicitud {
  id_solicitud: number;
  fraccion_arancelaria: string;
  descripcion_de_la_fraccion: string;
  nico: string;
  descripcion_nico: string;
  cant_soli_umt: number;
  uni_medida_tar: string;
  cant_total_umt: number;
  num_permiso_importacion: string;
  id_mercancia_gob: number;
  numero_partida: number;
  saldo_pendiente: number | null;
}

/**
 * Respuesta del servicio de solicitudes
 */
export interface SolicitudesResponse {
  codigo: string;
  mensaje: string;
  datos: SolicitudItem[];
}
/**
 * Respuesta del servicio para iniciar la inspección física SAGARPA.
 */
export interface IniciarInspeccionFisicaResponse {
  /** Código de respuesta de la operación */
  codigo: string;

  /** Mensaje descriptivo de la operación */
  mensaje: string;

  /** Datos devueltos por el servicio */
  datos: {
    /** Identificador único de la solicitud */
    id_solicitud: number;

    /** Número de certificado asociado */
    certificado: string;

    /** Hora programada para la inspección */
    hora_inspeccion: string;

    /** Fecha programada para la inspección */
    fecha_inspeccion: string;

    /** Clave del contenedor */
    clave_contendor: string;

    /** Datos relacionados al certificado */
    datos_certificado: {
      /** Aduana de ingreso */
      aduana_de_ingreso: string;

      /** Punto de inspección */
      punto_de_inspeccion: string;

      /** Oficina de inspección agropecuaria */
      ofic_de_insp_agro: string;

      /** Medio de transporte (puede ser null) */
      medio_de_transporte: string | null;

      /** Identificador del medio de transporte (puede ser null) */
      ident_de_transporte: string | null;
    };
  };
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

/** Servicio para obtener los datos de la solicitud */
@Injectable({
  providedIn: 'root',
})
/** Servicio para obtener los datos de la solicitud */
export class SolicitudPantallasService {
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
  
  /** URL para obtener los datos de la solicitud */
  private dataUrl =
    '../../../assets/json/220503/solicitud-pantallas-mock-data.json';

  /** Constructor para inyectar el servicio HttpClient */
  constructor(public http: HttpClient) {
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
 * Obtiene el catálogo de horas de inspección desde el servicio.
 *
 * @param tramite - Identificador del trámite.
 * @returns Observable con la respuesta del catálogo de horas de inspección.
 */
  getHorasInspeccionData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_HORAS_INSPECCION(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene el catálogo de aduanas de ingreso desde el servicio.
 *
 * @param tramite - Identificador del trámite.
 * @returns Observable con la respuesta del catálogo de aduanas de ingreso.
 */
getAduanaIngresoData(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_ADUANA_INGRESO(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene el catálogo de tipos de contenedor desde el servicio.
 *
 * @param tramite - Identificador del trámite.
 * @returns Observable con la respuesta del catálogo de tipos de contenedor.
 */
getTipoContenedorData(
  tramite: string
): Observable<ApiResponse<Catalogo[]>> {
  return this.http
    .get<ApiResponse<Catalogo[]>>(
      `${this.host}${API_GET_TIPO_CONTENEDOR(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene el catálogo de certificados pendientes desde el servicio.
 *
 * @returns Observable con la respuesta del catálogo de certificados pendientes.
 */
getCertificadosPendientes(tramite: string): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CERTIFICADOS_PENDIENTES(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Obtiene los datos de un certificado asociado a una solicitud.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave o identificador del certificado.
 * @returns Observable con la respuesta de los datos del certificado.
 */
getCertificadoDatos(
  tramite: string,
  clave: string
): Observable<CertificadoDatosIngreso> {
  return this.http
    .get<CertificadoDatosIngreso>(
      `${this.host}${API_GET_CERTIFICADO_DATOS(tramite, clave)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /** Método para obtener los datos de la solicitud
   * @returns Observable<TipoContenedor>
   */
/**
 * Obtiene el catálogo de responsables de inspección
 * desde el servicio (tipos de contenedor).
 *
 * @param tramite - Identificador del trámite.
 * @returns Observable con la respuesta del catálogo.
 */
getDataResponsableInspeccion(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_TIPO_CONTENEDOR(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
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
  const FULL_URL = `${this.host}${API_FIRMAR_SOLICITUD_ACUICOLA('220503')}`;
  return this.http.post<IniciarResponse>(
    FULL_URL,
    datos,
    { headers: SolicitudPantallasService.getApiHeaders() }
  );
}


  /**
 * Obtiene el catálogo de oficinas de inspección de sanidad
 * en función de la clave proporcionada.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave relacionada con la oficina o punto de inspección.
 * @returns Observable con la respuesta del catálogo de oficinas de inspección de sanidad.
 */
getOficinasInspeccionSanidadData(
  tramite: string,
  clave: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_OFICINAS_INSPECCION_SANIDAD(tramite, clave)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Obtiene el catálogo de puntos de inspección
 * asociados a una oficina OISA y tipo de trámite.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave de la oficina OISA.
 * @returns Observable con la respuesta del catálogo de puntos de inspección.
 */
getPuntosInspeccionData(
  tramite: string,
  clave: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_PUNTOS_INSPECCION_POR_OISA(tramite, clave)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
/**
 * Obtiene el catálogo de medios de transporte desde el servicio.
 *
 * @param tramite - Identificador del trámite.
 * @returns Observable con la respuesta del catálogo de medios de transporte.
 */
getCatalogoMedioTransporte(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
     `${this.host}${API_GET_MEDIO_TRANSPORTE(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}
  /**
 * Obtiene las solicitudes asociadas a un trámite.
 *
 * @param tramite - Identificador del trámite.
 */
getSolicitudesData(
  tramite: string
): Observable<SolicitudesResponse> {
  return this.http
    .get<SolicitudesResponse>(
      `${this.host}${API_GET_SOLICITUDES(tramite)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

/**
 * Obtiene los datos de las mercancías asociadas a una solicitud/certificado.
 *
 * @param tramite - Identificador del trámite.
 * @param clave - Clave del certificado.
 * @returns Observable con la lista de mercancías.
 */
getMercanciaSolicitudDatos(
  tramite: string,
  clave: string
): Observable<ApiResponse<MercanciaSolicitud[]>> {
  return this.http.get<ApiResponse<MercanciaSolicitud[]>>(
    `${this.host}${API_GET_DATOS_MERCANCIA(tramite, clave)}`,
    { headers: SolicitudPantallasService.getApiHeaders() }
  ).pipe(
    catchError((error) => throwError(() => error))
  );
}

/**
 * Inicia la inspección física SAGARPA con una solicitud prellenada.
 *
 * @param tramite - Identificador del trámite.
 * @param idSolicitudPrellenado - ID de la solicitud prellenada.
 * @returns Respuesta con los datos iniciales de la inspección física.
 */
iniciarInspeccionFisica(
  tramite: string,
  idSolicitudPrellenado: number | string
): Observable<IniciarInspeccionFisicaResponse> {
  return this.http
    .get<IniciarInspeccionFisicaResponse>(
       `${this.host}${API_INICIAR_SOLICITUD(tramite, idSolicitudPrellenado)}`,
      {
        headers: SolicitudPantallasService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => throwError(() => error))
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
 * Guarda los datos de la solicitud.
 *
 * @param payload - Información de la solicitud a guardar.
 * @returns Observable con la respuesta de la API.
 */
guardarSolicitud(
  payload: InspeccionFisicaPayload
): Observable<InspeccionFisicaResponse> {
  const ENDPOINT = `${this.host}${API_GUARDAR_SOLICITUD('220503')}`;

  return this.http
    .post<InspeccionFisicaResponse>(ENDPOINT, payload, {
      headers: SolicitudPantallasService.getApiHeaders(),
    })
    .pipe(
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
