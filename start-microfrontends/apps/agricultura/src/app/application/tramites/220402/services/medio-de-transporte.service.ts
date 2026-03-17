import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CatalogoLista, ENVIRONMENT } from '@ng-mf/data-access-user';
import { Observable, catchError, throwError } from 'rxjs';

import { CadenaOriginalRequest, CadenaOriginalResponse, IniciarResponse } from '../../220502/models/solicitud-pantallas.model';
import { CommonPost, DatosGuardarSolicitud, FirmaDatosRequest, Payload220402 } from '../constantes/certificado-zoosanitario.enum';

import { CommonGet, DatosDeChoresIniciarData, FraccionResponse } from '../models/pantallas-captura.model';

import { ADUANA_DE_SALIDA_URL, BANCO_URL, DESCRIPCION_EMAQUE_URL, ENTIDAD_FEDERATIVA_UNIDAD_EXPEDIDORA_URL, FIRMAR_URL, FITOSANITARIO_URL, FRACCION_ARANCELARIA_URL, GENERAR_CADENA_ORIGINAL_URL, GET_PAIS_URL, GUARDAR_DATOS_TRAMITE_URL, MEDIO_TRANSPORTE_URL, MODULOS_FITOSANITARIA_URL, MUNICIPIO_DE_ORIGIN_URL, NOMBRE_CLIENT_URL, NOMBRE_COMUN_URL, PAGE_DE_CHORES_INICIAR_URL, TERCERO_ESPECIALISTA_URL, UMC_URL, UNIDAD_VERIFICATION_URL, USO_MERCANCIA_URL } from '../server/api-router';

@Injectable({
  providedIn: 'root',
})
export class MediodetransporteService {
  /**
   * Host base de la API (por ejemplo: https://api-v30.cloud-ultrasist.net).
   * Se utiliza para construir las URLs absolutas de los servicios.
   */
  host: string;

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
  constructor(private http: HttpClient) {
    this.host = ENVIRONMENT.API_HOST;
  }

/**
 * Obtiene el catálogo de medios de transporte.
 *
 * @returns {Observable<CatalogoLista>} Catálogo de medios de transporte
 */
   getMedioDeTransporte(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/${MEDIO_TRANSPORTE_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }
/**
 * Obtiene el catálogo de bancos.
 *
 * @returns {Observable<CatalogoLista>} Catálogo de bancos
 */
  getBanco(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/${BANCO_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }

  getPagoDeChoresIniciar(): Observable<CommonGet<DatosDeChoresIniciarData>> {
    return this.http.get<CommonGet<DatosDeChoresIniciarData>>(`${this.host}/${PAGE_DE_CHORES_INICIAR_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }

  /**
   * @summary Obtiene el catálogo de aduanas de salida.
   * @returns Observable Catalogo
   */
   AduanaDeSalida(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/${ADUANA_DE_SALIDA_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }

    /**
   * @summary Get Pais.
   * @returns Observable Catalogo
   */
   getPais(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/${GET_PAIS_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }

   /**
   * @summary get unidad verification.
   * @returns Observable Catalogo
   */
  getUnidadVerification(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`${this.host}/${UNIDAD_VERIFICATION_URL}`, { headers: MediodetransporteService.getApiHeaders() });
  }

/**
 * @summary Obtiene el catálogo de módulos fitosanitarios.
 * @description Consulta el listado de módulos fitosanitarios disponibles.
 * @returns Observable<CatalogoLista>
 */
getModulosFitosanitaria(cveUnidad:string): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${MODULOS_FITOSANITARIA_URL(cveUnidad)}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo de módulos fitosanitarios.
 * @description Consulta el listado de módulos fitosanitarios disponibles.
 * @returns Observable<CatalogoLista>
 */
GetterceroEspecialista(cveUnidad:string): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${TERCERO_ESPECIALISTA_URL(cveUnidad)}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo de entidades federativas de la unidad expedidora.
 * @description Retorna la lista de entidades federativas asociadas a la unidad expedidora.
 * @returns Observable<CatalogoLista>
 */
getEntidadFederativaUnidadExpedidora(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${ENTIDAD_FEDERATIVA_UNIDAD_EXPEDIDORA_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo fitosanitario.
 * @description Consulta la información relacionada con certificados o datos fitosanitarios.
 * @returns Observable<CatalogoLista>
 */
getFitosanitario(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${FITOSANITARIO_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}
/**
 * Obtiene la información de una fracción arancelaria a partir de su clave.
 *
 * @param {string} claveFraccion Clave de la fracción arancelaria
 * @returns {Observable<FraccionResponse>} Respuesta con los datos de la fracción arancelaria
 */
getFraccionArancelaria(claveFraccion:string): Observable<FraccionResponse> {
  return this.http.get<FraccionResponse>(
    `${this.host}/${FRACCION_ARANCELARIA_URL(claveFraccion)}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}
/**
 * @summary Obtiene el catálogo de nombres comunes.
 * @description Retorna la lista de nombres comunes registrados en el sistema.
 * @returns Observable<CatalogoLista>
 */
getNombreComun(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${NOMBRE_COMUN_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo de nombres científicos por nombre común.
 * @description Consulta los nombres científicos asociados a un nombre común específico.
 * @param nombreCommun Nombre común seleccionado.
 * @returns Observable<CatalogoLista>
 */
getNombreClint(nombreCommun: string): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${NOMBRE_CLIENT_URL(nombreCommun)}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo de unidades de medida comerciales.
 * @description Retorna la lista de unidades de medida utilizadas comercialmente.
 * @returns Observable<CatalogoLista>
 */
getUnidadMedidaCommercial(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${UMC_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * Envía la firma de una solicitud al endpoint correspondiente.
 *
 * @param datos - Objeto con la información necesaria para firmar la solicitud.
 * @returns Observable con la respuesta del servidor (`IniciarResponse`).
 */
firmaDatos(datos: FirmaDatosRequest ): Observable<IniciarResponse> {
  return this.http.post<IniciarResponse>(
    `${this.host}/${FIRMAR_URL}`,
    datos,
    { headers: MediodetransporteService.getApiHeaders() }
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
  return this.http.post<CadenaOriginalResponse>(
    `${this.host}/${GENERAR_CADENA_ORIGINAL_URL(TRAMITE, idSolicitud)}`,
    payload,
    { headers: MediodetransporteService.getApiHeaders() }
  ).pipe(
    catchError(error => {
      return throwError(() => error);
    })
  );
}


/**
 * @summary Obtiene el catálogo de descripciones de empaque.
 * @description Consulta los tipos y descripciones de empaque disponibles.
 * @returns Observable<CatalogoLista>
 */
getDescripcionEmpaque(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${DESCRIPCION_EMAQUE_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * @summary Obtiene el catálogo de usos de la mercancía.
 * @description Retorna los diferentes usos permitidos o registrados para la mercancía.
 * @returns Observable<CatalogoLista>
 */
getUsosMercania(): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${USO_MERCANCIA_URL}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * Obtiene el catálogo de municipios de origen a partir de la clave de la entidad federativa.
 *
 * @param {string} cveEntidad Clave de la entidad federativa
 * @returns {Observable<CatalogoLista>} Catálogo de municipios de origen
 */
getMunicipioDeOrigin(cveEntidad:string): Observable<CatalogoLista> {
  return this.http.get<CatalogoLista>(
    `${this.host}/${MUNICIPIO_DE_ORIGIN_URL(cveEntidad)}`,
    { headers: MediodetransporteService.getApiHeaders() }
  );
}

/**
 * Guarda los datos del trámite para iniciar el proceso de pago.
 *
 * @param {Payload220402} payload - El cuerpo de la solicitud con los datos del trámite.
 * @returns {Observable<CommonPost>} Un observable con la respuesta del servidor.
 */
guardarDatosTramite(payload: Payload220402): Observable<CommonPost<DatosGuardarSolicitud>> {
  return this.http.post<CommonPost<DatosGuardarSolicitud>>(`${this.host}/${GUARDAR_DATOS_TRAMITE_URL}`, payload, { headers: MediodetransporteService.getApiHeaders() });
}
}
