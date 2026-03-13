import {
  API_GET_IDC_CONTRIBUYENTE,
  Catalogo,
  ENVIRONMENT, RFC_GENERICO,
  UploadDocumentResponse,
} from '@libs/shared/data-access-user/src';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  CargaArchivoDictamenResponse,
  ConsultaDatosAdace,
  GuardarSolicitudRequest,
  RespuestaConsulta,
  RespuestaConsultaAdace,
  RespuestaGuardarSolicitud,
  GeneraCadenaOriginalSolicitudRequest,
  FirmarSolicitudRequest,
  DictamenRequest,
  ConsultaDictamen,
} from '../models/adace.model';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { DatosGeneralesModel } from '@libs/shared/data-access-user/src/core/models/datos-generales.model';

/**
 * Servicio para gestionar la obtención de datos relacionados con los catálogos del trámite 32508.
 */
@Injectable({
  providedIn: 'root',
})
export class AdaceService {
  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  private readonly host: string;

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP utilizado para realizar solicitudes a los recursos JSON.
   */
  constructor(private http: HttpClient) {
    // Constructor utilizado para la creación de objetos requeridos en el componente
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
    // this.host = `http://localhost:8080/api/`;
  }

  /**
   * Obtiene los datos del catálogo de años.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo` con los datos de los años.
   */
  obtenerDatosAno(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}sat-t32508/catalogo/anios`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * Obtiene los datos del catálogo de meses.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo` con los datos de los meses.
   */
  obtenerDatosMes(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}sat-t32508/catalogo/meses`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   *
   * @returns {Observable<ConsultaDictamen>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(idSolicitud: string): Observable<BaseResponse<ConsultaDictamen>> {
    const ENDPOINT = `${this.host}sat-t32508/tramite/${idSolicitud}/solicitud/aviso`;
    return this.http.get<BaseResponse<ConsultaDictamen>>(ENDPOINT);
  }

  /**
   * Carga un archivo de dictamen para el tipo especificado.
   * Envía un FormData con el archivo al servidor.
   *
   * IMPORTANTE: No se establecen headers manuales para permitir que el navegador
   * establezca automáticamente 'Content-Type: multipart/form-data' con el boundary correcto.
   *
   * @param tipoDictamen Tipo de dictamen (disminucion, compensacion, disminucionYCompensacion)
   * @param formData FormData que contiene el archivo a cargar
   * @returns Observable con la respuesta del servidor
   */
  cargarArchivoDictamen(
    tipoDictamen: string,
    formData?: FormData
  ): Observable<BaseResponse<CargaArchivoDictamenResponse>> {
    const ENDPOINT = `${this.host}sat-t32508/solicitud/recibir-datos/${tipoDictamen}`;
    return this.http.post<BaseResponse<CargaArchivoDictamenResponse>>(ENDPOINT, formData);
  }

  /**
   * @method getAdace
   * @description Obtiene los datos del adace.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos del adace correspiendete al estado.
   *
   * @returns {Observable<ConsultaDatosAdace>} Un observable que emite la respuesta de los datos de consulta.
   */
  getAdace(estado: string): Observable<BaseResponse<ConsultaDatosAdace>> {
    const ENDPOINT = `${this.host}sat-t32508/solicitud/adace/${estado}`;
    return this.http.get<BaseResponse<ConsultaDatosAdace>>(ENDPOINT);
  }

  /**
   * Guarda la solicitud del trámite 32508.
   *
   * @param datos Datos completos del trámite incluyendo solicitante, aviso y tablas de datos
   * @returns {Observable<any>} Un observable con la respuesta del servidor
   */
  guardarSolicitud(datos: GuardarSolicitudRequest): Observable<BaseResponse<RespuestaGuardarSolicitud>> {
    const ENDPOINT = `${this.host}sat-t32508/solicitud/guardar`;
    return this.http.post<BaseResponse<RespuestaGuardarSolicitud>>(ENDPOINT, datos);
  }

  /**
   * Genera la cadena original necesaria para la firma electrónica.
   *
   * @param idSolicitud ID de la solicitud del trámite 32508
   * @param request Request con los datos necesarios para generar la cadena
   * @returns Observable con la cadena original generada
   */
  generaCadenaOriginal(
    idSolicitud: number,
    request: GeneraCadenaOriginalSolicitudRequest
  ): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}sat-t32508/solicitud/${idSolicitud}/genera-cadena-original`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, request);
  }

  /**
   * Firma la solicitud del trámite 32508.
   *
   * @param request Request con los datos de la firma electrónica
   * @param idSolicitud ID de la solicitud a firmar
   * @returns Observable con el folio del trámite firmado
   */
  firmaSolicitud(request: FirmarSolicitudRequest, idSolicitud: number): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}sat-t32508/solicitud/${idSolicitud}/firmar`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, request);
  }

  /**
   * Obtiene los datos generales de un contribuyente desde la API.
   * @param {string} rfc - RFC del contribuyente para realizar la consulta.
   * @returns {Observable<DatosGeneralesModel>} - Observable con la respuesta de la API.
   */
  getDatosGeneralesAPI(rfc: string): Observable<DatosGeneralesModel> {
    const ENDPOINT = `${ENVIRONMENT.API_HOST}/api/` + API_GET_IDC_CONTRIBUYENTE.replace(RFC_GENERICO, rfc);
    return this.http.get<DatosGeneralesModel>(`${ENDPOINT}`).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Descarga la plantilla de acuerdo al tipo de dictamen.
   * @param idSolicitud Identificador único de la solicitud
   * @param tipoDictamen Tipo de dictamen: 'compensacion' o 'disminucion'
   * @returns Observable con el blob del archivo Excel
   */
  descargaPlantilla(idSolicitud: string, tipoDictamen: string): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}sat-t32508/tramite/${idSolicitud}/descarga-plantilla/${tipoDictamen}`;
    return this.http.get<BaseResponse<string>>(ENDPOINT);
  }
}