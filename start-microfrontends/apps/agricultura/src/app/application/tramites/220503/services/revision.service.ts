import { ApiResponse, Catalogo, ENVIRONMENT, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,catchError,throwError } from 'rxjs';

import { API_GET_CATALOGO_REGIMENS, API_GET_DATOS_GENERALES_REVISION, API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL, API_GET_PAGO_DERECHOS_REVISION, API_GET_PUNTO_VERIFICACION_FEDERAL, API_GET_TERCEROS, API_GET_TERCEROS_POR_TIPO } from '../../../core/server/api-router';
import { Injectable } from '@angular/core';
import { Movilizacion } from '../models/datos-generales.model';

import { PagoDeDerechos } from '../models/pago-de-derechos.model';

import { Solicitud220503State } from '../estados/tramites220503.store';

/**
 * Datos generales de la revisión de una solicitud
 */
export interface DatosGeneralesRevision {
  /** Identificador único de la solicitud */
  id_solicitud: number;

  /** Folio del trámite */
  folio_tramite: string;

  /** Información asociada al trámite */
  tramite: {
    /** Aduana de ingreso */
    aduana: string;

    /** Oficina de inspección */
    oficina_inspeccion: string;

    /** Punto de inspección */
    punto_inspeccion: string;

    /** Régimen aduanero */
    regimen: string;

    /** Número de guía */
    numero_de_guia: string;

    /** Número de carro de ferrocarril */
    numero_carro_ferrocarril: string;
  };
}
export interface DatosGeneralesRevisionResponse {
  codigo: string;
  mensaje: string;
  datos: DatosGeneralesRevision;
}
/**
 * Información de un tercero asociado a la solicitud.
 */
export interface Tercero {
  /** Nombre o razón social */
  nombre_razon_social: string;

  /** Correo electrónico */
  correo_electronico: string;

  /** Calle */
  calle: string;

  /** País */
  pais: string;

  /** Colonia */
  colonia: string;

  /** Municipio o alcaldía */
  municipio_alcaldia: string;

  /** Entidad federativa */
  entidad_federativa: string;

  /** Código postal */
  codigo_postal: string;
  domicilio:string
}
/**
 * Respuesta del servicio para el pago de derechos
 * en la revisión documental.
 */
export interface PagoDerechosRevisionResponse {
  /** Código de respuesta del servicio */
  codigo: string;

  /** Mensaje descriptivo de la operación */
  mensaje: string;

  /** Datos del pago de derechos */
  datos: PagoDerechosRevision;
}
/**
 * Información del pago de derechos.
 */
export interface PagoDerechosRevision {
  /** Indica si el trámite está exento de pago */
  exento_pago: boolean;

  /** Clave o justificación del pago */
  justificacion: string;

  /** Fecha en la que se realizó el pago */
  fecha_pago: string;

  /** Importe del pago */
  imp_pago: number;
}
/**
 * Detalle de mercancías para revisión documental
 */
export interface MercanciaRevisionDocumental {
  id_mercancia: number;
  id_solicitud: number;
  numero_partida: number;
  tipo_requisito: string;
  requisito: string;
  num_cert_intern: string;
  fraccion_arancelaria: string;
  desc_de_la_frac: string;
  nico: string;
  descripcion_nico: string;
  descripcion: string;
  unidad_medida_tarifa: string;
  cantidad_umt: number;
  unidad_medida_comercial: string;
  cantidad_umc: number;
  uso: string;
  pais_origen: string;
  pais_procedencia: string;
  numero_lote: string;
}

/**
 * Servicio para gestionar las revisiones.
 */
@Injectable({
  providedIn: 'root',
})
export class RevisionService {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios.
   */
  host: string;

  /**
   * Constructor del servicio.
   *
   * @param {HttpClient} http - El cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    this.host = ENVIRONMENT.API_HOST;
  }
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
   * Obtiene los datos de la aduana de ingreso.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la aduana de ingreso.
   */
  getAduanaIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/aduana-ingreso.json'
    );
  }

  /**
   * Obtiene los datos de la oficina de inspección.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la oficina de inspección.
   */
  getOficianaInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/oficiana-de-inspeccion.json'
    );
  }

  /**
   * Obtiene los datos del punto de inspección.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de inspección.
   */
  getPuntoInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/punto-de-inspeccion.json'
    );
  }

  /**
   * Obtiene los datos del establecimiento.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del establecimiento.
   */
  getEstablecimiento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/establecimiento.json'
    );
  }

  /**
   * Obtiene los datos del régimen al que se destinarán las mercancías.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del régimen.
   */
  getRegimenDestinaran(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_CATALOGO_REGIMENS(tramite)}`,
      {
        headers: RevisionService.getApiHeaders(),
      }
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
      'assets/json/220503/movilizacion-nacional.json'
    );
  }

  /**
   * Obtiene los datos del punto de verificación.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de verificación.
   */
  getPuntoVerificacion(
  tramite: string
): Observable<ApiResponse<Catalogo>> {
  return this.http
    .get<ApiResponse<Catalogo>>(
      `${this.host}${API_GET_PUNTO_VERIFICACION_FEDERAL(tramite)}`,
      {
        headers: RevisionService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
}

  /**
   * Obtiene los datos de la empresa transportista.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la empresa transportista.
   */
  getEmpresaTransportista(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/empresa-transportista.json'
    );
  }

  /**
   * Obtiene los datos de la justificación.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la justificación.
   */
  getJustificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(
      'assets/json/220503/justificacion.json'
    );
  }

  /**
   * Obtiene los datos del banco.
   *
   * @returns {Observable<RespuestaCatalogos>} - Los datos del banco.
   */
  getBanco(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220503/banco.json');
  }

  /**
   * Servicio para obtener datos relacionados con la solicitud.
   */
  getPagoDeDerechos(): Observable<PagoDeDerechos> {
    /** Obtiene la información del pago de derechos desde un archivo JSON. */
    return this.http.get<PagoDeDerechos>(
      'assets/json/220503/pago-de-derechos.json'
    );
  }

  /**
   * Servicio para obtener los datos generales de la solicitud.
   */
  getDatosDelaSolicitud(): Observable<Solicitud220503State> {
    /** Obtiene los datos de la solicitud desde un archivo JSON. */
    return this.http.get<Solicitud220503State>(
      'assets/json/220503/datos-dela-solicitud.json'
    );
  }

  /**
   * Servicio para obtener los datos de movilización.
   */
  getMovilizacion(): Observable<Movilizacion> {
    /** Obtiene los datos de la movilización desde un archivo JSON. */
    return this.http.get<Movilizacion>('assets/json/220503/movilizacion.json');
  }

  /**
 * Obtiene los datos generales de la revisión documental
 * asociados a un certificado.
 *
 * @param tramite - Identificador del trámite.
 * @param certificado - Clave del certificado.
 * @returns Observable con los datos generales de la revisión.
 */
getDatosGeneralesRevision(
  tramite: string,
  certificado: string
): Observable<DatosGeneralesRevisionResponse> {
  return this.http
    .get<DatosGeneralesRevisionResponse>(
      `${this.host}${API_GET_DATOS_GENERALES_REVISION(tramite, certificado)}`,
      {
        headers: RevisionService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => throwError(() => error))
    );
}

/**
 * Obtiene los terceros asociados a una solicitud filtrados por tipo de tercero.
 *
 * @param tramite - Identificador del trámite.
 * @param codigo - Identificador de la solicitud.
 * @param tipoTercero - Tipo de tercero a filtrar.
 * @returns Observable con la respuesta de terceros.
 */
getTercerosPorTipoData(
  tramite: string,
  codigo: string,
  tipoTercero: string
): Observable<ApiResponse<Tercero>> {
  return this.http
    .get<ApiResponse<Tercero>>(
      `${this.host}${API_GET_TERCEROS_POR_TIPO(tramite, codigo, tipoTercero)}`,
      {
        headers: RevisionService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => throwError(() => error))
    );
}

/**
 * Obtiene el listado de mercancías asociadas a la
 * revisión documental de un certificado.
 *
 * @param tramite Código del trámite
 * @param certificado Número de certificado
 * @returns Observable con la respuesta que contiene las mercancías
 */
getDatosGeneralesRevisionDocumental(
  tramite: string,
  certificado: string
): Observable<ApiResponse<MercanciaRevisionDocumental>> {
  return this.http
    .get<ApiResponse<MercanciaRevisionDocumental>>(
      `${this.host}${API_GET_DATOS_GENERALES_REVISION_DOCUMENTAL(tramite, certificado)}`,
      {
        headers: RevisionService.getApiHeaders(),
      }
    )
    .pipe(
      catchError((error) => throwError(() => error))
    );
}


/**
 * Obtiene la información del pago de derechos
 * correspondiente a la revisión documental del trámite.
 *
 * @param tramite Código del trámite
 * @param certificado Número de certificado
 * @returns Observable con la respuesta del pago de derechos
 */
getPagoDerechosRevision(
  tramite: string,
  certificado: string
): Observable<PagoDerechosRevisionResponse> {
  return this.http.get<PagoDerechosRevisionResponse>(
    `${this.host}${API_GET_PAGO_DERECHOS_REVISION(tramite, certificado)}`,
    {
      headers: RevisionService.getApiHeaders(),
    }
  );
}
}
