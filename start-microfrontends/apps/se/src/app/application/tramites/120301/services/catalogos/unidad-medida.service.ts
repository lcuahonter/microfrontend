import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { API_GET_UNIDAD_MEDIDA } from '../../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  /**
   * URL base del servidor al que se realizarán las solicitudes
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
   * Obtiene las unidades de medida del catálogo.
   * @returns Observable que emite la respuesta del servidor.
   */
  getUnidadMedida(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_UNIDAD_MEDIDA}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

}