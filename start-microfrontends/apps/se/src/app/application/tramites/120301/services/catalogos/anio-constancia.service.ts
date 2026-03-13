import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { API_GET_ANIOS_AUTORIZACION } from '../../server/api-router';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnioConstanciaService {

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
   * Obtiene los años de autorización del catálogo.
   * @returns Observable que emite la respuesta del servidor con los años de autorización.
   */
  getAnios(): Observable<BaseResponse<Catalogo[]>> {
    const ENDPOINT = `${this.host}${API_GET_ANIOS_AUTORIZACION}`;
    return this.http.get<BaseResponse<Catalogo[]>>(ENDPOINT);
  }

}
