import {
  AvisoTablaDatos,
  CatalogoLista,
  DatosSolicitante,
  DocumentoApiResponse,
  FirmarSolicitudRequest,
  GeneraCadenaOriginalSolicitudRequest,
  GuardarSolicitudRequest,
  RespuestaConsulta,
  RespuestaGuardarSolicitud,
  RespuestaSolicitud,
} from '../models/aviso-traslado.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  API_GET_INICIAR_CONFIRMACION_NOTIFICACION,
  ENVIRONMENT,
} from '@ng-mf/data-access-user';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
/**
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado.
 *
 * Este servicio proporciona métodos para obtener datos como catálogos, tablas de aviso,
 * tablas de mercancías, y otros datos necesarios para el trámite 32503.
 */
@Injectable({
  providedIn: 'root',
})
export class EntregaActaService {
  /**
   * URL base del servidor al que se realizarán las solicitudes relacionadas con aduanas.
   * Esta variable almacena la dirección del host para los servicios compartidos de catálogos.
   * Es de solo lectura y se inicializa en el constructor del servicio.
   */
  private readonly host: string;

  /**
   * Constructor del servicio que inicializa la URL base del host.
   * @param http Instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Obtiene los datos del solicitante.
   *
   * @returns {Observable<DatosSolicitante>} Un observable con los datos del solicitante.
   */
  obtenerDatosSolicitante(): Observable<DatosSolicitante> {
    return this.http.get<DatosSolicitante>(
      `assets/json/32507/datosSolicitante.json`
    );
  }

  /**
   * Obtiene los datos de la tabla de mercancías.
   *
   * @returns {Observable<MercanciaTablaDatos>} Un observable con los datos de la tabla de mercancías.
   */
  obtenerAvisoTabla(): Observable<AvisoTablaDatos> {
    return this.http.get<AvisoTablaDatos>(`assets/json/32507/aviso-tabla.json`);
  }

  /**
   * Obtiene la lista de entidades federativas.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de entidades federativas.
   */
  obtenerLevantaActa(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/32507/levanta-acta.json`);
  }

  /**
   * Obtiene la lista de unidades de medida.
   *
   * @returns {Observable<CatalogoLista>} Un observable con la lista de unidades de medida.
   */
  obtenerUnidadMedida(): Observable<CatalogoLista> {
    const ENDPOINT = `${ENVIRONMENT.API_HOST}/api/catalogo/unidad-de-medida-enumeracion`;
    return this.http.get<CatalogoLista>(ENDPOINT);
  }

  /**
   * @method getDatosSolicitud
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   *
   * @returns {Observable<RespuestaSolicitud>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosAviso(idSolicitud: string): Observable<RespuestaSolicitud> {
    const ENDPOINT = `${this.host}sat-t32507/tramite/${idSolicitud}/solicitud/aviso`;
    return this.http.get<RespuestaSolicitud>(ENDPOINT);
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   *
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consulta_11201.json`.
   *
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(estado: string): Observable<RespuestaConsulta> {
    const ENDPOINT = `${this.host}sat-t32507/solicitud/adace/${estado}`;
    return this.http.get<RespuestaConsulta>(ENDPOINT);
  }

  /**
   * Guarda la solicitud del trámite 32507.
   *
   * @param datos Datos completos del trámite incluyendo solicitante, aviso y tabla de datos
   * @returns {Observable<any>} Un observable con la respuesta del servidor
   */
  guardarSolicitud(datos: GuardarSolicitudRequest): Observable<BaseResponse<RespuestaGuardarSolicitud>> {
    const ENDPOINT = `${this.host}sat-t32507/solicitud/guardar`;
    return this.http.post<BaseResponse<RespuestaGuardarSolicitud>>(ENDPOINT, datos);
  }

  /**
   * Consulta los documentos especificos del tramite
   * @returns {Observable<any>} Un observable con la respuesta del servidor
   */
  getDocumentosTramite(): Observable<BaseResponse<DocumentoApiResponse>> {
    const ENDPOINT = `${this.host}sat-t32507/solicitud/documentos?especifico=true`;
    return this.http.get<BaseResponse<DocumentoApiResponse>>(ENDPOINT);
  }

  /**
   * Metodo para mandar llamar la firma de la solicitud
   * @param request parametros para la firma
   * @param idSolicitud ID de la solicitud a firmar
   * @returns Observable con la respuesta de la firma
   */
  firmaSolicitud(request: FirmarSolicitudRequest, idSolicitud: number): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}sat-t32507/solicitud/${idSolicitud}/firmar`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, request);
  }

  /**
   * Metodo para generar la cadena original
   * @param idSolicitud identificador de la solicitud a firmar
   * @param request parametros requeridos
   * @returns Observable con la cadena original generada
   */
  generaCadenaOriginal(
    idSolicitud: number,
    request: GeneraCadenaOriginalSolicitudRequest
  ): Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}sat-t32507/solicitud/${idSolicitud}/genera-cadena-original`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, request);
  }
}
