import { API_POST_FIRMAR_DICTAMEN, API_POST_FIRMAR_REGISTRAR_DICTAMEN } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { FirmarDictamenRequest } from '../../models/evaluar/request/firmar-dictamen-request.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmarDictamenService {

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
     * Guarda el dictamen del trámite 130118.
     * @param numFolio Número de folio del trámite.
     * @param PAYLOAD Datos del dictamen a guardar.
     * @returns Observable con la respuesta del servidor.
     */
    postFirmarDictamen(tramite: number, numFolio: string, PAYLOAD: FirmarDictamenRequest): 
    Observable<BaseResponse<null>> {
      const ENDPOINT = `${this.host}${API_POST_FIRMAR_DICTAMEN(tramite.toString(), numFolio)}`;
      return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
    }
  
        /**
     * Guarda el dictamen del trámite 130118.
     * @param numFolio Número de folio del trámite.
     * @param PAYLOAD Datos del dictamen a guardar.
     * @returns Observable con la respuesta del servidor.
     */
    postregistrarFirmarDictamen(tramite: number, numFolio: string, PAYLOAD: FirmarDictamenRequest): 
    Observable<BaseResponse<null>> {
      const ENDPOINT = `${this.host}${API_POST_FIRMAR_REGISTRAR_DICTAMEN(tramite.toString(), numFolio)}`;
      return this.http.post<BaseResponse<null>>(ENDPOINT, PAYLOAD);
    }
}
