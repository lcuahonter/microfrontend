import { API_BUSCAR_CANCELACIONES_GRID, API_BUSCAR_CUPOS_DISPONIBLES, API_BUSCAR_DATOS_GRID, API_BUSCAR_DETALLE_DEL_PERMISO_DATOS, API_BUSCAR_TERCIARIZADAS, API_OBTENER_CERTIFICADOS_DISPONIBLES, API_OBTENER_DETALLE_SOLICITUD } from '../../core/server/api-router';
import { CuposDisponiblesBuscarPayload, CuposDisponiblesBuscarResponse, DetalleSolicitudBuscarPayload, DetalleSolicitudBuscarResponse, ObtenerCertificadosDisponiblesPayload, ObtenerCertificadosDisponiblesResponse } from '../models/cupos-disponibles.model';
import { DetalleDelBuscarPayload, DetalleDelBuscarResponse } from '../models/detalleDelPermiso.model';
import { EmpresasNacionalesResponse, ServicioDtosKey, ServicioItemResponse, ServiciosAutorizadosTablePayload, ServiciosEmpresasNacionalesPayload, ServiciosImmexTablePayload } from '../models/modelo-interface.model';
import { PlantasDisponiblesPayload, PlantasDisponiblesResponse } from '../models/modelo-interface.model';
import { SERVICIO_AUTORIZADOS_TABLA, SERVICIO_EMPRESAS_NACIONALES, SERVICIO_IMMEX_TABLA } from '../../core/server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProgramaACancelar } from '../models/ProgramaACancelar.model';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  /**
    * URL del servidor donde se encuentra la API.
    */
  private readonly host: string;

  /**
   * Constructor del servicio IniciarService.
   * @param http - Cliente HTTP para realizar solicitudes al servidor.
   */
  constructor(private http: HttpClient) {
    this.host = `${ENVIRONMENT.API_HOST}/api/`;
  }

  /**
   * Envía las opciones de evaluación del trámite 130118.
   * @param PAYLOAD Datos de las opciones de evaluación.
   * @returns Observable con la respuesta del servidor.
   */
  postServiciosImmexTabla(tramite: string, PAYLOAD: ServiciosImmexTablePayload):
    Observable<BaseResponse<ServicioItemResponse[]>> {
    const ENDPOINT = `${this.host}${SERVICIO_IMMEX_TABLA(tramite.toString())}`;
    return this.http.post<BaseResponse<ServicioItemResponse[]>>(ENDPOINT, PAYLOAD);
  }

/**
 * Envía las opciones de evaluación del trámite 130118.
 * @param PAYLOAD Datos de las opciones de evaluación.
 * @returns Observable con la respuesta del servidor.
 */
  postServiciosAutorizadosTabla(tramite: string, PAYLOAD: ServiciosAutorizadosTablePayload):
    Observable<BaseResponse<ServicioDtosKey>> {
    const ENDPOINT = `${this.host}${SERVICIO_AUTORIZADOS_TABLA(tramite.toString())}`;
    return this.http.post<BaseResponse<ServicioDtosKey>>(ENDPOINT, PAYLOAD);
  }

  /**
 * Envía las opciones de evaluación del trámite 130118.
 * @param PAYLOAD Datos de las opciones de evaluación.
 * @returns Observable con la respuesta del servidor.
 */
  postServiciosEmpresasNacionales(tramite: string, PAYLOAD: ServiciosEmpresasNacionalesPayload):
    Observable<BaseResponse<EmpresasNacionalesResponse>> {
    const ENDPOINT = `${this.host}${SERVICIO_EMPRESAS_NACIONALES(tramite.toString())}`;
    return this.http.post<BaseResponse<EmpresasNacionalesResponse>>(ENDPOINT, PAYLOAD);
  }

postPlantasDisponiblesTabla(tramite: string, PAYLOAD: PlantasDisponiblesPayload):
  Observable<BaseResponse<PlantasDisponiblesResponse[]>> {
    const ENDPOINT = `${this.host}${API_BUSCAR_DATOS_GRID(tramite.toString())}`;
    return this.http.post<BaseResponse<PlantasDisponiblesResponse[]>>(ENDPOINT, PAYLOAD);
  }

  postPlantasDisponiblesTablaTerciarizadas(tramite: string, PAYLOAD: PlantasDisponiblesPayload):
    Observable<BaseResponse<PlantasDisponiblesResponse[]>> {
      const ENDPOINT = `${this.host}${API_BUSCAR_TERCIARIZADAS(tramite.toString())}`;
      return this.http.post<BaseResponse<PlantasDisponiblesResponse[]>>(ENDPOINT, PAYLOAD);
  }
  
  /**
   * Obtiene los datos del programa a cancelar desde un archivo JSON local.
   * 
   * @returns Observable que emite los datos del programa a cancelar.
   */
  obtenerDatos(tramite: string, rfc: string): Observable<BaseResponse<ProgramaACancelar[]>> {
    const ENDPOINT = `${this.host}${API_BUSCAR_CANCELACIONES_GRID(tramite.toString(), rfc)}`;
    return this.http.get<BaseResponse<ProgramaACancelar[]>>(ENDPOINT);

  }

  /**
   * Obtiene el detalle del permiso de datos para el trámite especificado.
   * @param tramite Identificador del trámite.
   * @param PAYLOAD Datos necesarios para obtener el detalle del permiso.
   * @returns Observable con la respuesta del servidor que contiene el detalle del permiso.
   */
  obtenerDetalleDelPermisoDatos(tramite: string, PAYLOAD: DetalleDelBuscarPayload): Observable<BaseResponse<DetalleDelBuscarResponse[]>> {
    const ENDPOINT = `${this.host}${API_BUSCAR_DETALLE_DEL_PERMISO_DATOS(tramite.toString())}`;
    return this.http.post<BaseResponse<DetalleDelBuscarResponse[]>>(ENDPOINT, PAYLOAD);
  }

  /**
   * Obtiene los cupos disponibles para el trámite especificado.
   * @param tramite Identificador del trámite.
   * @param PAYLOAD Datos necesarios para buscar los cupos disponibles.
   * @returns Observable con la respuesta del servidor que contiene los cupos disponibles.
   */
  obtenerCuposDisponibles(tramite: string, PAYLOAD: CuposDisponiblesBuscarPayload): Observable<BaseResponse<CuposDisponiblesBuscarResponse[]>> {
    const ENDPOINT = `${this.host}${API_BUSCAR_CUPOS_DISPONIBLES(tramite.toString())}`;
    return this.http.post<BaseResponse<CuposDisponiblesBuscarResponse[]>>(ENDPOINT, PAYLOAD);
  }


  /**
   * Obtiene los certificados disponibles para el trámite especificado.
   * @param tramite Identificador del trámite.
   * @param PAYLOAD Datos necesarios para obtener los certificaObtenerCertificadosDisponiblesPayloaddos disponibles.
   * @returns Observable con la respuesta del servidor que contiene los certificados disponibles.
   */
  obtenerCertificadosDisponibles(
    tramite: string,
    PAYLOAD: ObtenerCertificadosDisponiblesPayload
  ): Observable<BaseResponse<ObtenerCertificadosDisponiblesResponse[]>> {
    const ENDPOINT = `${this.host}${API_OBTENER_CERTIFICADOS_DISPONIBLES(tramite.toString())}`;
    return this.http.post<BaseResponse<ObtenerCertificadosDisponiblesResponse[]>>(ENDPOINT, PAYLOAD);
  }

 /**
   * @method obtenerDetalleSolicitud
   * @description
   * Realiza una petición HTTP POST para obtener el detalle de una solicitud específica según el trámite proporcionado.
   * @memberof ServiciosService
   */
  obtenerDetalleSolicitud(
    tramite: string,
    PAYLOAD: DetalleSolicitudBuscarPayload
  ): Observable<BaseResponse<DetalleSolicitudBuscarResponse>> {
    const ENDPOINT = `${this.host}${API_OBTENER_DETALLE_SOLICITUD(
      tramite.toString()
    )}`;

    return this.http.post<BaseResponse<DetalleSolicitudBuscarResponse>>(
      ENDPOINT,
      PAYLOAD
    );
  }

  /**
   * Genera una alerta de error con los mensajes proporcionados.
   * @param mensajes Mensajes de error a mostrar en la alerta.
   * @returns HTML de la alerta de error.
   */
static generarAlertaDeError(mensajes:string): string {
    const ALERTA = `
<div class="d-flex justify-content-center text-center">
  <div class="col-md-12 p-3  border-danger  text-danger rounded">
    <div class="mb-2 text-secondary" >Corrija los siguientes errores:</div>

    <div class="d-flex justify-content-start mb-1">
      <span class="flex-grow-1 text-center">${mensajes}</span>
    </div>  
  </div>
</div>
`;
return ALERTA;
  }
}
