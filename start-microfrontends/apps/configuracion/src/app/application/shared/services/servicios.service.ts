import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src';
import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
