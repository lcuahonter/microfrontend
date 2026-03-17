import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API_GET_SENTIDOS_DISPONIBLES_VERIFICAR, ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { API_POST_FIRMAR_VERIFICAR, API_POST_INICIAR_VERIFICAR_DICTAMEN, API_POST_OBSERVACION_GUARDAR_VERIFICAR, API_POST_VERIFICAR_MOSTRAR_FIRMAR, NUMFOLIOTRAMITE, TRAMITE} from '../../../constantes/autorizar-dictamen/api-constants';

import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { Observable } from 'rxjs';

import { FirmaVerificarDictamenRequest, IniciarVerificarResponse } from '../../models/verificar-dictamen/iniciar-verificar-dictamen-response.model';
import { IniciarAutorizarDictamen } from '../../models/autorizar-dictamen/request/iniciar-autorizar-dictamen.model';
import { MostrarFirmaRequest } from '../../models/autorizar-requerimiento/request/mostrar-firmar-request.model';
import { MostrarFirmarResponse } from '../../models/autorizar-requerimiento/response/mostrar-firmar-response.model';
import { ObservacionRequest } from '../../models/autorizar-requerimiento/request/observacion-guardar-request.model';
import { SentidosDisponiblesResponse } from '@libs/shared/data-access-user/src/core/models/shared/sentidos-disponibles.model';



@Injectable({
  providedIn: 'root'
})
export class VerificarDictamenService {

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
   * Inicia el dictamen del trámite 130118.
   * @param tramite Número de trámite.
   * @param numFolio Número de folio del trámite.
   *  @param PAYLOAD Datos para iniciar el dictamen.
   * @returns Observable con la respuesta del servidor.
   */

  postIniciarDictamen(tramite: number, numFolio: string, PAYLOAD: IniciarAutorizarDictamen):
    Observable<BaseResponse<IniciarVerificarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_INICIAR_VERIFICAR_DICTAMEN.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<IniciarVerificarResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Muestra la información de firma para un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos para mostrar la firma
   * @returns Observable con la respuesta que incluye información de firma
   */
  postFirmarMostrar(tramite: number, numFolio: string, PAYLOAD: MostrarFirmaRequest):
    Observable<BaseResponse<MostrarFirmarResponse>> {
    const ENDPOINT = `${this.host}${API_POST_VERIFICAR_MOSTRAR_FIRMAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;

    return this.http.post<BaseResponse<MostrarFirmarResponse>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Realiza la firma y autorización de un dictamen
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos de firma y autorización
   * @returns Observable con la respuesta de la operación
   */
  firmarVerificar(tramite: number, numFolio: string, PAYLOAD: FirmaVerificarDictamenRequest):
    Observable<BaseResponse<null>> {
    const ENDPOINT = `${this.host}${API_POST_FIRMAR_VERIFICAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
  }

  /** 
   * Guarda una nueva observación en el sistema
   * @param tramite - Número de trámite asociado
   * @param numFolio - Número de folio del trámite
   * @param PAYLOAD - Datos de la observación a guardar
   * @returns Observable con la respuesta de la operación
 */
  postObservacionGuardar(tramite: number, numFolio: string, PAYLOAD: ObservacionRequest):
    Observable<BaseResponse<string>> {
    const ENDPOINT = `${this.host}${API_POST_OBSERVACION_GUARDAR_VERIFICAR.replace(TRAMITE, tramite.toString()).replace(NUMFOLIOTRAMITE, numFolio)}`;
    return this.http.post<BaseResponse<string>>(ENDPOINT, PAYLOAD);
  }
    /**
     * Obtiene los sentidos disponibles para el trámite 130118.
     * @param tramite Número de trámite.
     * @returns Observable con la respuesta del servidor.
     */
    getSentidosDisponibles(tramite: string): Observable<BaseResponse<SentidosDisponiblesResponse[]>> {
      const ENDPOINT = `${this.host}${API_GET_SENTIDOS_DISPONIBLES_VERIFICAR(tramite.toString())}`;
      return this.http.get<BaseResponse<SentidosDisponiblesResponse[]>>(ENDPOINT);
    }
  
}
